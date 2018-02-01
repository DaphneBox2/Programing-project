/* Daphne Box
10455701
this javascript file is the main file for my programming project
where all functions are written to load data, draw figures, update/change them
and handle events that are called by the html page
*/

// declare all global variables and give them a basic value that needs to be used upon loading the page
var globalData;
var parallelAwareness;
var parallelVote;
var parallelEffect;
var chosenQuestion = "basicIncomeVote";
var countryCode = "Germany";
var chosenOption = "answerOrder";

/* 
main function
calls the function to draw the lines of the map, loads all data and calls the dataLoaded function
*/

window.onload = function main() {
	
	drawMap();

	d3.queue()
		.defer( d3.csv, "basicIncomeDoubleCountries.csv" )
		.defer( d3.csv, "parallelCoordinatesDataAwaraness.csv" )
		.defer( d3.csv, "parallelCoordinatesDataEffect.csv" )
		.defer( d3.csv, "parallelCoordinatesDataVote.csv" )
		.await( dataLoaded );
	
}

/* 
loadData 
makes from the loaded data a global variable and calls the functions that draw the two graphs 
and the function that colors the map
*/

function dataLoaded( error, loadedData, parallelAwarenessData, parallelEffectData, parallelVoteData ) {
	if (error) throw error;

	globalData = loadedData;
	parallelAwareness = parallelAwarenessData;
	parallelVote = parallelVoteData;
	parallelEffect = parallelEffectData; 
	colorMap( globalData, chosenQuestion );
	drawBarGraph( chosenOption, globalData, chosenQuestion, countryCode );
	drawParallelCoordinatesGraph();
	
}

/*
dropdownMap function
is operated from the html file and reacts on the choice of a question by altering the global 
chosenQuestion variable and calls all update functions for the graphs and map colors
code comes from: https://www.w3schools.com/howto/howto_js_dropdown.asp
 */

function dropdownMap( question ) {

	// shows question of choice by user and gives it to the data selection function
	if (document.getElementById( question ) == null ) {

		chosenQuestion = "basicIncomeVote";
	}
	else {
		if ( document.getElementById( question ).id == "awareness" ) {

			chosenQuestion = "basicIncomeAwareness";
		}
		else if ( document.getElementById( question ).id == "vote" ) {

			chosenQuestion = "basicIncomeVote";
		}
		else if ( document.getElementById( question ).id == "effect" ) {

			chosenQuestion = "basicIncomeEffect";
		}
	}
	
	updateMap( globalData, chosenQuestion, countryCode );
	updateBarGraph( chosenOption, globalData, chosenQuestion, countryCode );
	updateParallelCoordinatesGraph( globalData, chosenQuestion, countryCode );
	
	return chosenQuestion;
}

/* drawMap function
this function draws the strokes/lines of the map and host the mouseover, mouseout and click events
when an onclick happens drawMap calls the two functions that update the two graphs function calls the 
calculateChoice function as well when hovering over a country so it can display the data
furthermore this function loads in its own data necessary to draw a map
code comes from: http://bl.ocks.org/milafrerichs/69035da4707ea51886eb
json of Europe comes from: https://geojson-maps.ash.ms/
*/
function drawMap() {

	( function() {
		
		var width = 700;
		var height = 1000;
		var center = [5, 70];
		var scale = 500;
		var projection = d3.geo
			.mercator()
			.scale( scale )
			.translate( [width / 2, 0] )
			.center( center );
		var path = d3.geo
			.path()
			.projection( projection );
		var column = d3.select( ".map" );
				
		var svg = column.select( "svg" )
			.attr( "id", "draw" )		
			.attr( "height", height )
			.attr( "width", width );

		var tooltip = d3.select( "body" )
			.append( "div" )
			.attr( "class", "tooltip hidden" );
		
		d3.json("scripts/custom-geo-3_topojson.json", function( error, data ) {

			if (error) throw error;

			var europeMap = topojson.feature( data, data.objects.customgeo3 );

			svg.selectAll( ".europeMap" )
					.data( topojson.feature( data, data.objects.customgeo3 ).features )
				.enter()
				.append( "path" )
					.attr( "class", "country")
					.attr( "id", function( d ) { return d.properties.sovereignt; } )
					.attr( "stroke", "#000000" )
					.attr( "fill", "#E0E0E0" )
					.attr( "d", path )
					.on( "mouseover", function( d ){ 
						d3.select( this )
							.style( "opacity", 0.5 );
						var mouseX = d3.event.pageX;
						var mouseY = d3.event.pageY;
						showToolTip( d, mouseX, mouseY );  
						} )
					.on( "mouseout", function( d ){ 
						d3.select( this )
							.style( "opacity", 1 );
						tooltip.classed( "hidden", true );
						// d3.select( ".countryName" )
						// 	.remove() 
						} )
					.on( "click", function(){ 

						countryCode = d3.select( this ).attr( "id" );
						updateBarGraph( chosenOption, globalData, chosenQuestion, countryCode ); 
						updateParallelCoordinatesGraph( globalData, chosenQuestion, countryCode );
					} );

			function showToolTip( d, mouseX, mouseY ) {
				
				var label = d.properties.sovereignt;

				// determine most chosen answer for a country
				var currentCountryCode = d.properties.sovereignt;
				var questions = ["basicIncomeAwareness", "basicIncomeVote", "basicIncomeEffect"];
				var awareness = calculateChoice( globalData, questions[0], currentCountryCode );
				var vote = calculateChoice( globalData, questions[1], currentCountryCode );
				var effect = calculateChoice( globalData, questions[2], currentCountryCode );
				var show;

				if ( awareness[3] > 0 ) {

					show = ( label + "<br>"
							+ "Awareness: " + awareness[4] + " is chosen most with " + Math.round( ( awareness[3] * 10 ) / 10 ) + " % <br>"
							+ "Vote: " + vote[4] + " is chosen most with " + Math.round( ( vote[3] * 10 ) / 10 ) + " % <br>"
							+ "Effect: " + effect[4] + " is chosen most with " + Math.round( ( effect[3] * 10 ) / 10 ) + " % <br>" ); 
				}
				else {

					show = ( label + "<br>" + "Unfortunately, there is no data for this country" );
				}
			
				tooltip.classed( "hidden", false )
					.attr( "style", "left:" + ( mouseX ) + "px; top:" + ( mouseY ) + "px" )
					.html( show );
			}
		});	
	}).call( this );
}

/* 
colorMap function
gives the countries on the map a color according to corresponding data, the data is first split on country 
afterwards the outcome is calculated via the calculateChoice function
this function creates also the legend of the map
*/

function colorMap( globalData, chosenQuestion ) {

	// declare necessary variables, choice variables are declared in order of description of codebook_basicIncome.pdf file
	var countryList = [];

	for ( var i = 1; i < globalData.length; i++ ) {

		if ( i < ( globalData.length - 1 ) ) {

			// determine how many countries are surveyed
			if ( globalData[i - 1].countryName != globalData[i].countryName ) {
				
				countryList.push( globalData[i - 1]. countryName);
			}
		}
		else {

			countryList.push( globalData[i - 1].countryName );
		}
	}

	var returncalculateChoices;

	// loop through the list of all surveyed countries
	for ( var j = 0; j < countryList.length; j++ ) {

		country = countryList[j];
		
		// determine which options is chosen most often and determine color
		returncalculateChoices = calculateChoice( globalData, chosenQuestion, country );

		// color the country
		var currentCountry = "#" + countryList[j] + "";

		d3.selectAll( currentCountry )
			.attr( "fill", returncalculateChoices[5] );
	}

	// make legenda
	returncalculateChoices[2].push( "#E0E0E0" );
	returncalculateChoices[0].push( "No data available" );

	var legend = d3.select( ".map" )
		.select( "svg" )
		.append( "g" )
		.attr("class", "legenda")
		.append("rect")
	        .attr("id", "canvas")
	        .attr("x", 300)
	        .attr("y", 550)
	        .attr("class", "st0")
	        .attr("width", "250")
	        .attr("height", "150")
	        .style("opacity", "0");

    // make rectangles with colors for legenda
    for ( var p = 0; p < ( returncalculateChoices[2].length ); p++ ) {
    	
    	d3.select( ".legenda" )
        	.append( "rect" )
	            .attr( "x", 300 )
	            .attr( "y", ( 23.4 * ( p ) + 550 ) )
	            .attr( "class", "st1" )
	            .attr( "width", "10" )
	            .attr( "height", "15" )
	            .style( "fill", returncalculateChoices[2][p] );
    }
   

    // // make text element to describe input legenda and data
    for ( var q = 0; q < ( returncalculateChoices[0].length ); q++ ) {
    	
    	d3.select( ".legenda" )
	        	.append( "text" )
	            .attr( "x", 320 )
	            .attr( "y", ( 23.4 * ( q ) + 560 ) )
	            .attr( "class", "st2" )
	            .attr( "width", "60" )
	            .attr( "height", "15" )
	            .text( returncalculateChoices[0][q] );
    }   
}

/* 
updateMap function
updates the colors of the map by removing the legend and recalling the colorMap function
*/

function updateMap( globalData, chosenQuestion, country ) {

	d3.select( ".legenda" )
		.remove();

	colorMap( globalData, chosenQuestion, country );
}

/*
drawBarGraph function
this function draws the bar graph on the website and uses the calculateChoice function to calculate data outcome 
when clicking on the bar the function calls the barUpdatesParallel function
code inspired from: https://bost.ocks.org/mike/bar/
*/

function drawBarGraph( chosenOption, globalData, chosenQuestion, countryCode ) {
	
	// update title so user knows which country is selected and which question is selected
	var selectedQuestion = "";

	if ( chosenQuestion == "basicIncomeAwareness" ) {

		selectedQuestion = "How familiar are you with the concept known as basic income?";
	}
	else if ( chosenQuestion == "basicIncomeVote" ) {

		selectedQuestion = "If there would be a referendum on introducing basic income today, how would you vote?";
	}
	else if ( chosenQuestion == "basicIncomeEffect" ) {

		selectedQuestion = "What could be the most likely effect of basic income on your work choices?";
	}

	d3.select( ".barChartTitle" )
		.text( "Answers chosen for the question: " + selectedQuestion + " from participants in " + countryCode );

	// make data complete for a country
	var dataCountry = calculateChoice( globalData, chosenQuestion, countryCode );
	var dataCountryPercentages = [];

	if ( dataCountry[1][0] == 0 && dataCountry[1][1] == 0 && dataCountry[1][2] == 0 && dataCountry[1][3] == 0 && dataCountry[1][5] == 0 ) {

		d3.select( ".barChart" )
			.text( "Sorry we don't have any data from this country." );
	}

	for ( var i = 0; i < ( dataCountry[0].length ); i++ ) {

		dataCountryPercentages.push( { "choice": dataCountry[0][i], "percentage": dataCountry[1][i] } );
	}

	// make translation formula to calculate the bar heigth and width depending on choice radio-button
	if ( chosenOption == "percentage" ) {

		dataCountryPercentages.sort( function( a, b ) { return b.percentage - a.percentage; } );
	}

	// state dimensions
	var margin = { top: 50, right: 30, bottom: 250, left: 100 };
	var width = 500 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	var y = d3.scale.linear()
		.range( [height, 0] );

	var x = d3.scale.ordinal()
		.rangeRoundBands( [0, width], .1 );

	// make translation formula to calculate the bar heigth and width
	x.domain( dataCountryPercentages.map( function ( d ) { return d.choice; } ) );
	y.domain( [0, ( d3.max( dataCountryPercentages, function ( d ) { return d.percentage; } ) )] ).nice();

	var chart = d3.select( ".barChart" )
		.attr( "width", ( width + margin.left + margin.right ) )
		.attr( "height", ( height + margin.top + margin.bottom ) );

	var barWidth = width / dataCountryPercentages.length;

	var tip = d3.tip()
		.attr( "class", "tip" )
		.html( function( d ) { return "<span>" + ( Math.round( d.percentage * 10 ) / 10 ) + "%" + "</span>"; } )

	var bar = chart.selectAll( "g" )
			.data( dataCountryPercentages )
		.enter()
		.append( "g" )
			.attr("class", "bar")
			.attr( "transform", function( d ){ return "translate( " + ( margin.left + x( d.choice ) ) + "," + margin.top + " )"; } );

	bar.append( "text" )
		.attr( "x", barWidth / 2 )
		.attr( "y", function( d ) { return y( d.percentage ); } )
		.attr( "dy", ".75em" )
		.text( function( d ) { return d.choicesList; } )

	bar.append( "rect" )
		.attr( "y", function( d ) { return y( d.percentage ); } )
		.attr( "height", function( d ) { return ( height - y( d.percentage ) ); } )
		.attr( "width", ( barWidth - 5 ) ) 
		.attr( "fill", "blue" )
		.on( "mouseover", function( d ) {
			tip.show( d ); 
			d3.select( this )
				.style( "fill", "red" );  
		} )
		.on( "mouseout", function( d ) {
			tip.hide( d );
			d3.select( this )
				.style( "fill", "blue" ); 
		} )
		.on( "click", function( d ){ 
			var answer = d.choice;
			barUpdatesParallel( globalData, chosenQuestion, countryCode, answer );
		} );

		bar.call( tip );

	// make axis
	var xAxis = d3.svg.axis()
		.scale( x )
		.orient( "bottom" );

	var xLabels = chart.append( "g" )
		.attr( "class", "xAxis" )
		.attr( "transform", "translate(" + margin.left + "," + ( height + margin.top ) + " )" )
		.call( xAxis );	
	
	var xName = chart.append( "text" )
		.attr( "class", "label" )
		.attr( "x", width + 100 )
		.attr( "y", height + 100 )
		// .attr("transform", "translate(" + (width / 2) + ", 20)")
		.style( "text-anchor", "end" )
		.text( "choice" );

	var rotateXLabels = d3.select( ".xAxis" )
		.selectAll( "text" )
		.attr( "transform", "rotate( -45 )" )
		.style( "text-anchor", "end" );

	var yAxis = d3.svg.axis()
		.scale( y )
		.orient( "left" );

	chart.append( "g" )
		.attr( "class", "y axis" )
		.attr( "transform", "translate(" + margin.left + "," + margin.top + ")" )
		.call( yAxis );	
	
	chart.append( "text" )
		.attr( "class", "label" )
		.attr( "x", -30 )
		.attr( "y", 60 )
		.attr( "transform", "rotate( -90 )" )
		.style( "text-anchor", "end" )
		.text( "percentage" );
}

/* 
updateBarGraph function
is called when clicking on the radio button and when data changes happened 
so the bar graph needed to be updated
code comes from: https://www.w3schools.com/howto/howto_js_dropdown.asp
*/

function updateBarGraph( option ){
	
	if ( document.getElementById( option ).id == "answerOrder" ) {
		
		chosenOption = "answerOrder";
	}

	else if ( document.getElementById( option ).id == "percentage" ) {

		chosenOption = "percentage";
	}

	d3.select( ".barChart" )
		.selectAll( "g" )
			.remove();

	drawBarGraph( chosenOption, globalData, chosenQuestion, countryCode );
}

/*
drawParallelCoordinatesGraph function
draws the parallel coordinates graph for this function three data files were necessary 
for which precounting was done in a python file (parallelCoordinateData.py)
code for parallel coordinates graph is derived from: https://bl.ocks.org/mbostock/1341021
and https://gist.github.com/sebastian-meier/03df214f456fc100526a
and https://bl.ocks.org/YuanyuanZh/28897524626fa3f1d4c0
*/

function drawParallelCoordinatesGraph() {
	
	// update title so user knows which country is selected and which question is selected
	d3.select( ".parallelOrientationsTitle" )
		.append( "g" )
			.attr( "text-anchor", "middle" )
			.text( "Demographics of participants in " + countryCode );

	// declare size of graph and margins
	var margin = { top: 100, right: 200, bottom: 30, left: 30 };
	var width = 750 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;

	// preselect the appropriate data set for the question
	var selectData = "";
	var answerList = [];

	if ( chosenQuestion == "basicIncomeAwareness" ) {

		selectData = parallelAwareness;
		answerList = ["I understand it fully", "I know something about it", "I have heard just a little about it", "I have never heard of it"];
	}
	else if ( chosenQuestion == "basicIncomeEffect" ) {

		selectData = parallelEffect;
		answerList = ["I would vote for it", "I would probably vote for it", "I would probably vote against it", "I would vote against it", "I would not vote"];
	}
	else if ( chosenQuestion == "basicIncomeVote" ) {

		selectData = parallelVote;
		answerList = ["I would stop working", "I would work less", "I would do more volunteering work", "I would spend more time with my family",
		"I would look for a different job", "I would work as a freelancer", "I would gain additional skills", "A basic income would not affect my work choices", "None of the above"];
	}

	var dimensions = [
	{
		name: "age",
		scale: d3.scale.linear().range( [0, height] ),
		type: "number"
	},
	{
		name: "ruralUrban",
		scale: d3.scale.ordinal().rangePoints( [0, height] ),
		sort: ["rural", "urban"],
		type: "string"
	},
	{
		name: "gender",
		scale: d3.scale.ordinal().rangePoints( [0, height] ),
		sort: ["male", "female"],
		type: "string"
	},
	{
		name: "educationLevel",
		scale: d3.scale.ordinal().rangePoints( [0, height] ),
		sort: ["high", "medium", "low", "no", "NA"],
		type: "string"
	},
	{
		name: "fullTime",
		scale: d3.scale.ordinal().rangePoints( [ 0, height ] ),
		sort: ["yes", "no"],
		type: "string"
	},
	{
		name: "children",
		scale: d3.scale.ordinal().rangePoints( [ 0, height ] ),
		sort: ["yes", "no"],
		type: "string"
	},
	{
		name: chosenQuestion,
		scale: d3.scale.ordinal().rangePoints( [0, height] ),
		sort: calculateChoice( selectData, chosenQuestion, countryCode )[0],
		type: "string"
	}];

	// declare other variables
	var x = d3.scale.ordinal().domain( dimensions.map( function( d ) { return d.name; } ) ).rangePoints( [0, width] );
	var dragging = {};
	var line = d3.svg.line();
	var yAxis = d3.svg.axis()
		.orient( "left" );
	
	var background;
	var foreground;
	var colors = d3.scale.linear().domain([1,length])
    	.interpolate(d3.interpolateHcl)
    	.range([d3.rgb("#4292c6"), d3.rgb("#64B5F6")]);

	var chart = d3.select( ".parallelOrientations" )
			.attr( "width", width + margin.left + margin.right )
			.attr( "height", height + margin.top + margin.bottom )
		.append( "g" )
			.attr( "transform", "translate( " + margin.left + "," + margin.top + " )" );
	
	// make filter for all data that needs to be included in the graph
	var filter = d3.keys( selectData[0] )
		.filter( function( d ) { return d != "countryName" } );

	// filter data for specific country
	var filterData = [];

	for ( var h = 0; h < selectData.length; h++ ) {

		if ( countryCode == selectData[h].countryName ){

			filterData.push( selectData[h] );
		}
	}

	// calculate the x-scale positions
	dimensions.forEach( function( dimension ) {
		dimension.scale.domain( dimension.type === "number"
			? d3.extent( filterData, function( d ) { return +d[dimension.name]; } )
			: dimension.sort);
	} )
	
	// add grey background lines for context
	background = chart.append( "g" )
			.attr( "class", "background" )
			.attr( "class", function( d ) { d.chosenQuestion; } )
		.selectAll( "path" )
			.data( filterData )
		.enter()
		.append( "path" )
		.attr( "d", draw );

	// add blue foreground lines for focus
	foreground = chart.append( "g" )
			.attr( "class", "foreground" )
			.attr( "class", function( d ) { d.chosenQuestion; } )
		.selectAll( "path" )
			.data( filterData )
		.enter()
		.append( "path" )
		.attr( {"style": function( d ) { return "stroke: " + colors( d.count ); } } )
		.attr( "data-legend", function( d ) { return d.count; } )
		.attr( "d", draw );

  // add a group element for each dimension
  var g = chart.selectAll( ".dimension" )
  		.data( dimensions )
	.enter()
	.append( "g" )
		.attr( "class", "dimension" )
		.attr( "transform", function( d ) { return "translate( " + x( d.name ) + " )"; } )
	.call( d3.behavior.drag()
			.origin( function( d ) { return { x: x( d.name ) }; } )
		.on( "dragstart", function( d ) { 
			dragging[d.name] = x( d.name );
			background.attr( "visibility", "hidden" );
			} ) 
		.on( "drag", function( d ) {
				dragging[d.name] = Math.min( width, Math.max( 0, d3.event.x ) );
				foreground.attr( "d", draw );
				dimensions.sort( function( a, b ) { return position( a ) - position( b ); } );
				x.domain( dimensions.map( function( d ) { return d.name; } ) );
				g.attr( "transform", function( d ) { return "translate(" + position( d ) + ")"; } )
		} )
		.on( "dragend", function( d ) {
			delete dragging[d.name];
			transition( d3.select( this ) )
				.attr( "transform", "translate(" + x( d.name ) + ")" );
			transition( foreground ).attr( "d", draw );
			background
				.attr("d", draw )
				.transition()
					.delay( 500 )
					.duration( 0 )
					.attr( "visibility", null );
		} )
	)

	// add an axis and title
	chart.selectAll( ".dimension" )
		.append( "g" )
			.attr( "class", "axis" )
			.attr( "id", function( d ) { return d.name; } )
			.each( function( d ) { d3.select( this ).call( yAxis.scale( d.scale ) ); } ) 
		.append( "text" )
			.attr( "class", "title" )
			.style( "text-anchor", "middle" )
			.attr( "y", -9 )
			.text( function( d ) { return d.name; });

	// set text to right side of most right axis
	d3.select( "#" + chosenQuestion )
		.selectAll( ".tick" )
			.select( "text" )
				.style( "text-anchor", "start" )
				.attr( "transform", "translate( 10, 0 )" );

	// add and store a brush for each axis
	chart.selectAll( ".dimension" )
		.append( "g" )
				.attr( "class", "brush" )
			.each( function( d ) {

				d3.select( this ).call( d.scale.brush = d3.svg.brush().y( d.scale ).on( "brushstart", brushstart ).on( "brush", brush) );
			})
			.selectAll( "rect" )
				.attr( "x", -8 )
				.attr( "width", 16 );

	// make a legend
	var legend = chart.append( "g" )
		.attr( "class", "legenda" )
		.attr( "transform", "translate( 550, 30 )" )
		.style( "font-size", "12px" )
		.call( d3. legend );

	// returns path for given data point
	function draw( d ) {

		return line( dimensions.map( function ( dimension ) {
			var v = dragging[dimension.name];
			var tx = v == null ? x( dimension.name ) : v;
			return [tx, dimension.scale( d[dimension.name] )]; 
		} ) )
	}

	function position( d ) {

		var v = dragging[d.name];
		return v == null ? x( d.name ) : v;
	}

	function transition( g ) {

		return g.transition().duration( 500 );
	}

	function brushstart() { 

		d3.event.sourceEvent.stopPropagation();
	}

	function brush() {

		var actives = dimensions.filter( function( p ) { return !p.scale.brush.empty(); } );
		var extents = actives.map( function( p ) { return p.scale.brush.extent(); } );

		foreground.style( "display", function( d ) {
			return actives.every( function( p, i ) { 

				if ( p.type === "number" ) {
					return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];
				}
				else {
					return extents[i][0] <= p.scale( d[p.name] ) && p.scale( d[p.name] ) <= extents[i][1];
				}
			}) ? null : "none";
		})
	}
}

// updateParallelCoordinatesGraph function
function updateParallelCoordinatesGraph( ) {

	d3.select( ".parallelOrientationsTitle" )
		.remove();

	d3.selectAll( ".legend-box" )
		.remove();

	d3.select( ".parallelOrientations" )
		.selectAll( "g" )
		.remove();

	drawParallelCoordinatesGraph();
}

/* 
function barUpdatesParallel
updates the parallel coordinates graph upon click on bar of bar chart 
and changes the data input for the parallel coordinates graph
updating happens by removing graph and recalling the drawParallelCoordinatesGraph function
*/

function barUpdatesParallel() {

	var answerData = [];

	for ( var i = 0; i < globalData.length; i++ ) {

		if ( globalData[i].countryName == countryCode && globalData[i][chosenQuestion] == answer ) {

			answerData.push( globalData[i] );
		}
	}
	
	// redraw lines
	d3.select( ".parallelOrientations" )
		.selectAll( "g" )
			.remove();

	drawParallelCoordinatesGraph();

}


/* 
calculateChoice function
function calculates the total times a choice option is chosen by participants from a certain country 
*/
function calculateChoice( globalData, chosenQuestion, countryCode ) {

	// declare variables
	var answer1 = "";
	var answer2 = "";
	var answer3 = "";
	var answer4 = "";
	var answer5 = "";
	var answer6 = "";
	var answer7 = "";
	var answer8 = "";
	var answer9 = "";

	// select answer possibilities for the selected question
	if ( chosenQuestion == "basicIncomeAwareness" ) {

			answer1 = "I understand it fully";
			answer2 = "I know something about it";
			answer3 = "I have heard just a little about it";
			answer4 = "I have never heard of it";
		}
		else if ( chosenQuestion == "basicIncomeVote" ) {

			answer1 = "I would vote for it";
			answer2 = "I would probably vote for it";
			answer3 = "I would probably vote against it";
			answer4 = "I would vote against it";
			answer5 = "I would not vote";
		}
		else if ( chosenQuestion == "basicIncomeEffect" ) {

			answer1 = "I would stop working";
			answer2 = "I would work less";
			answer3 = "I would do more volunteering work";
			answer4 = "I would spend more time with my family";
			answer5 = "I would look for a different job";
			answer6 = "I would work as a freelancer";
			answer7 = "I would gain additional skills";
			answer8 = "A basic income would not affect my work choices";
			answer9 = "None of the above";
		}

	// declare variables necessary to count votes and participants
	var totalParticipants = 0;
	var choice1 = 0;
	var choice2 = 0;
	var choice3 = 0;
	var choice4 = 0;
	var choice5 = 0;
	var choice6 = 0;
	var choice7 = 0;
	var choice8 = 0;
	var choice9 = 0;
	var other = 0;

	// loop through dataset
	for ( var i = 0; i < globalData.length; i++ ) {

		// check if participant belongs to current check country
		if ( countryCode == globalData[i].countryName ) {
			
			// count chosen options for participants per country
			if ( globalData[i][chosenQuestion]== answer1 ) {
				choice1 = choice1 + 1;
			}
			
			else if ( globalData[i][chosenQuestion] == answer2 ) {
				choice2 = choice2 + 1;
			}
			
			else if ( globalData[i][chosenQuestion] == answer3 ) {
				choice3 = choice3 + 1;
			}
			
			else if ( globalData[i][chosenQuestion] == answer4 ) {
				choice4 = choice4 + 1;
			}
			
			else if ( globalData[i][chosenQuestion] == answer5 ) {
				choice5 = choice5 + 1;
			}

			else if ( globalData[i][chosenQuestion] == answer6 ) {
				choice6 = choice6 + 1;
			}
			
			else if ( globalData[i][chosenQuestion] == answer7 ) {
				choice7 = choice7 + 1;
			}

			else if ( globalData[i][chosenQuestion] == answer8 ) {
				choice8 = choice8 + 1;
			}

			else if ( globalData[i][chosenQuestion] == answer9 ) {
				choice9 = choice9 + 1;
			}

			else {
				other = other + 1;
			}
		totalParticipants = totalParticipants + 1;
		}
	}
	
	var dataCountry = [answer1, answer2, answer3, answer4, answer5, answer6, answer7, 
	answer8, answer9, choice1, choice2, choice3, choice4, choice5, choice6, 
	choice7, choice8, choice9, other];

	var choicesList = [];
	var choicesPercentages = [];
	var colorCountries = [];
	var choiceMax = 0;
	var choiceVar = "";
	var choiceColor = "";

	for ( var j = 0; j < ( dataCountry.length - 10 ); j++ ) {
 
		if ( dataCountry[j] != "" ) {

			var percentage = ( dataCountry[j + 9]/ totalParticipants ) * 100;
			choicesList.push( dataCountry[j] );
			choicesPercentages.push( percentage );
		}
	}

	// most chosen answer and color on map
	for ( var k = 0; k < choicesList.length; k++ ) {

		if ( choicesList[k] == "I understand it fully" ) {

			colorCountries = ["#1A237E", "#303F9F", "#3F51B5", "#7986CB"];
		}

		else if ( choicesList[k] == "I would vote for it") {

			colorCountries = ["#0D47A1", "#64B5F6", "#E57373", "#B71C1C", "#616161"];
		}

		else if ( choicesList[k] == "I would stop working" ) {

			colorCountries = ["#EC407A", "#90CAF9", "#512DA8", "#C62828", "#004D40", "#FF9800", "#AFB42B", "#00E5FF", "#FFE082"];
		}
	}
	
	for ( var l = 0; l < choicesPercentages.length; l++ ) {

		if ( choiceMax < choicesPercentages[l] ) {

			choiceMax = choicesPercentages[l];
			choiceVar = choicesList[l];
			choiceColor = colorCountries[l];
		}
	}

	return [choicesList, choicesPercentages, colorCountries, choiceMax, choiceVar, choiceColor, totalParticipants];
}

/* 
showInfo function
code for tab funtionality so it reacts on clicking and code is derived from: https://www.w3schools.com/howto/howto_js_tabs.asp
*/

function showInfo( evt, show ) {
	// declare all variables
	var i;
	var tabContent;
	var tabLinks;

	// get tabContent elements and hide them
	tabContent = document.getElementsByClassName( "tabContent" );
	for ( i = 0; i < tabContent.length; i++ ) {
		tabContent[i].style.display = "none";
	}

	// show current tab, and add an "active" class to the button that opened the tab
	document.getElementById( show ).style.display = "block";
}
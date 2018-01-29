/* Daphne Box
10455701
this javascript file is the main file for my programming project where all important functions are written to load data and figures are programmed
*/

var globalData;
var chosenQuestion = "basicIncomeVote";
var countryCode = "DEU";

// main function
window.onload = function main() {
	// load data
	// d3.csv("basicIncomeDoubleCountries.csv", function( data ) {
		
	// 	drawMap();
	// 	drawBarGraph( data );
	// 	drawParallelCoordinatesGraph( data );
	// })

	drawMap();
	d3.queue()
		.defer( d3.csv, "basicIncomeDoubleCountries.csv" )
		.await( dataLoaded );
	
}

// loadData
function dataLoaded( error, loadedData ) {
	if (error) throw error;

	globalData = loadedData;
	colorMap( globalData, chosenQuestion );
	updateMap( globalData );
	drawBarGraph( globalData, chosenQuestion, countryCode );
	drawParallelCoordinatesGraph( globalData, chosenQuestion, countryCode );
	
}

// dropdownMap function
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
	console.log(chosenQuestion);
	colorMap( globalData, chosenQuestion, country );
	updateBarGraph( globalData, chosenQuestion, country );
	updateParallelCoordinatesGraph( globalData, chosenQuestion, country );
	return chosenQuestion;
}

/* drawMap function
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
			.attr( "height", height )
			.attr( "width", width );
		
		d3.json("scripts/custom-geo-3_topojson.json", function( error, data ) {

			if ( error ){
				throw error;
			}

			var europeMap = topojson.feature( data, data.objects.customgeo3 );

			var tip = d3.tip()
				.attr( "class", "tip" )
				.html( function( d ) { return "<span>" + d.properties.sovereignt + "</span>"; } )

			svg.selectAll( ".europeMap" )
					.data( topojson.feature( data, data.objects.customgeo3 ).features )
				.enter()
				.append( "path" )
					.attr( "class", "country")
					.attr( "id", function( d ) { return d.properties.sov_a3; } )
					.attr( "stroke", "#000000" )
					.attr( "fill", "#E0E0E0" )
					.attr( "d", path )
					.on( "mouseover", function( d ){ 
						d3.select( this )
							.style( "opacity", 0.5 ) 
						// d3.select( this )
						// 	.append( "div" )
						// 	.attr("class", "countryName")
						// 	.text( d.properties.sovereignt )
						// 	.html( function( d ) {
						// 		return ("<g><rect id = countryName></rect><p>" + d.properties.sovereignt + "</p></g>");
						// 	} ) 
						} )
					.on( "mouseout", function( d ){ 
						d3.select( this )
							.style( "opacity", 1 ) 
						// d3.select( ".countryName" )
						// 	.remove() 
						} )
					.on( "click", function(){ 

						countryCode = d3.select( this ).attr( "id" );
						updateBarGraph( globalData, chosenQuestion, countryCode ); 
						updateParallelCoordinatesGraph( globalData, chosenQuestion, countryCode );
					} );

			// colorMap();
		});	
	}).call( this );
}

/* 
colorMap function
gives the countries on the map a color according to corresponding data
*/

function colorMap( globalData, chosenQuestion ) {

	// var data = loadData();
	// console.log(data);
	// declare necessary variables, choice variables are declared in order of description of codebook_basicIncome.pdf file
	var countryList = [];

	for ( var i = 1; i < globalData.length; i++ ) {

		if ( i < ( globalData.length - 1 ) ) {

			// determine how many countries are surveyed
			if ( globalData[i - 1].countryCode3 != globalData[i].countryCode3 ) {
				
				countryList.push( globalData[i - 1].countryCode3 );
			}
		}
		else {

			countryList.push( globalData[i - 1].countryCode3 );
		}
	}

	// declare variables
	var choicesList;
	var choices;
	var choiceMax;
	var choiceVar;
	var choiceColor;
	var mostChosenPercentage;
	var colorCountries;

	// loop through the list of all surveyed countries
	for ( var j = 0; j < countryList.length; j++ ) {

		country = countryList[j];
		
		// determine which options is chosen most often and determine color
		var returncalculateChoices = calculateChoice( globalData, chosenQuestion, country );
		choicesList = [];
		choices = [];
		choiceMax = 0;
		choiceVar = "";

		// put necessary data in choices
		for ( var l = 0; l < ( returncalculateChoices.length - 11 ); l++ ) {
 
			if ( returncalculateChoices[l] != ""  ) {
		
				choicesList.push( returncalculateChoices[l] );
				choices.push( returncalculateChoices[l + 10] );
			}
		}
		
		// determine color
		for ( var n = 0; n < choicesList.length; n++ ) {

			if ( choicesList[n] == "I understand it fully" ) {

				colorCountries = ["#1A237E", "#303F9F", "#3F51B5", "#7986CB"];
			}

			else if ( choicesList[n] == "I would vote for it") {

				colorCountries = ["#0D47A1", "#64B5F6", "#E57373", "#B71C1C", "#616161"];
			}

			else if ( choicesList[n] == "I would stop working" ) {

				colorCountries = ["#EC407A", "#90CAF9", "#512DA8", "#C62828", "#004D40", "#FF9800", "#AFB42B", "#00E5FF", "#FFE082"];
			}
		}

		for ( var o = 0; o < choices.length; o++ ) {

			if ( choiceMax < choices[o] ) {

				choiceMax = choices[o];
				choiceVar = choicesList[o];
				choiceColor = colorCountries[o];
			}
		}
		
		mostChosenPercentage = ( choiceMax / returncalculateChoices[( returncalculateChoices.length - 1 )] ) * 100;

		// color country
		var currentCountry = "#" + countryList[j] + "";

		d3.selectAll( currentCountry )
			.attr( "fill", choiceColor );
	} 

	// make legenda
	var legend = d3.select( ".map" )
		.select( "svg" )
		.append( "g" )
		.attr("class", "legenda")
		.append("rect")
	        .attr("id", "canvas")
	        .attr("x", 580)
	        .attr("y", 150)
	        .attr("class", "st0")
	        .attr("width", "250")
	        .attr("height", "150")
	        .style("opacity", "0.1");

    // make rectangles with colors for legenda
    for ( var p = 0; p < ( colorCountries.length ); p++ ) {
    	
    	d3.select( ".legenda")
    		.select( "#canvas" )
        	.append( "rect" )
	            .attr( "x", 580 )
	            .attr( "y", ( 23.4 * ( p ) + 150 ) )
	            .attr( "class", "st1" )
	            .attr( "width", "10" )
	            .attr( "height", "15" )
	            .style( "fill", colorCountries[p] );
    }
   

    // make text element to describe input legenda and data
    for ( var q = 0; q < ( choicesList.length ); q++ ) {
    	
    	d3.select(".legenda")
    		.select( "#canvas" )
	        	.append( "text" )
	            .attr( "x", 580 )
	            .attr( "y", ( 23.4 * ( q ) + 410 ) )
	            .attr( "class", "st2" )
	            .attr( "width", "60" )
	            .attr( "height", "15" )
	            .text( choicesList[q] );
    }   
}

// updateMap function

function updateMap(){
}

/*
drawBarGraph function
this function draws for the first time the bar graph of the website after country click. 
Code inspired from: https://bost.ocks.org/mike/bar/
*/

function drawBarGraph( globalData, chosenQuestion, countryCode ) {

	// make data complete for a country
	var dataCountry = calculateChoice( globalData, chosenQuestion, countryCode );

	// calculate percentages and choices
	var choicesList = [];
	var choicePercentages = [];
	var dataCountryPercentages = [];

	for ( var i = 0; i < ( dataCountry.length - 11 ); i++ ) {
 
		if ( dataCountry[i] != "" ) {

			choicesList.push( dataCountry[i] );
			var percentage = ( dataCountry[i + 10] / dataCountry[( dataCountry.length - 1 )] ) * 100 ;
			choicePercentages.push( percentage );
		}
	}
	
	for ( var j = 0; j < choicePercentages.length; j++ ) {

		dataCountryPercentages.push( { "choice": choicesList[j], "percentage" : choicePercentages[j] } );
	}
console.log(dataCountryPercentages);
	// state dimensions
	var margin = { top: 10, right: 30, bottom: 200, left: 50 };
	var width = 500 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	var y = d3.scale.linear()
		.range( [height, 0] );

	var x = d3.scale.ordinal()
		.rangeRoundBands( [0, width], .1 );

	// make translation formula to calculate the bar heigth and width
	x.domain( dataCountryPercentages.map( function ( d ) { return d.choice; } ) );
	y.domain( [0, d3.max( dataCountryPercentages, function ( d ) { return d.percentage; } )] );

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
			.attr( "transform", function( d ){ return "translate( " + ( margin.left + x( d.choice ) ) + ",0 )"; } );

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
			// d3.select( this )
			// 	.select( "text" )
			// 		.attr( "x", function() { return x( d.choice ) + ( ( barWidth / 2 ) + margin.left ) } )
			// 		.attr( "y", function() { return y( d.percentage ) } )
			// 		.text( function() { return d.choice } )
			// 		.style( "opacity", 1 ); 
		} )
		.on( "mouseout", function( d ) {
			tip.hide( d );
			d3.select( this )
				.style( "fill", "blue" ); 
			// d3.select( "text" )
			// 	.style( "opacity", 0 ); 
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
		.attr( "transform", "translate(" + margin.left + "," + height + " )" )
		.call( xAxis );	
	
	var xName = chart.append( "text" )
		.attr( "class", "label" )
		.attr( "x", width + 50 )
		.attr( "y", height + 40 )
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
		.attr( "transform", "translate(" + margin.left + ", 0 )" )
		.call( yAxis );	
	
	chart.append( "text" )
		.attr( "class", "label" )
		.attr( "x", -30 )
		.attr( "y", 20 )
		.attr( "transform", "rotate( -90 )" )
		.style( "text-anchor", "end" )
		.text( "percentage" );
}

// updateBarGraph function

function updateBarGraph( globalData, chosenQuestion, countryCode ){
	
	d3.select( ".barChart" )
		.selectAll( "g" )
			.remove()

	drawBarGraph( globalData, chosenQuestion, countryCode );
}

/*
 drawParallelCoordinatesGraph function
code for parallel coordinates graph is derived from: https://bl.ocks.org/mbostock/1341021
*/

function drawParallelCoordinatesGraph( globalData, chosenQuestion, countryCode ) {

	// declare size of graph and margins
	var margin = { top: 100, right: 200, bottom: 30, left: 50 };
	var width = 700 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	
	 // make filter for all data that needs to be included in the graph
	var filter = d3.keys( globalData[0] )
		.filter( function( d ) { return d != "countryCode2" && d != "countryCode3" && d != "age" 
			&& d != "gender" && d != "ruralUrban" && d != "basicIncomeAwareness" && d != "basicIncomeVote" 
			&& d != "basicIncomeEffect" && d != "basicIncomeArgumentsFor" && d != "basicIncomeArgumentsAgainst" 
			&& d != "weight" } );

	filter.push( chosenQuestion );

	// filter data for specific country
	var filterData = [];

	for ( var h = 0; h < globalData.length; h++ ) {

		if ( countryCode == globalData[h].countryCode3 ){

			filterData.push( globalData[h] );
		}
	}
	
	// make the different scales for each object in filter
	var dimensions = [];

	for ( var i = 0; i < filter.length; i++ ){
		
		var dataDimension = { name: "" + filter[i] + "", scale: d3.scale.ordinal().rangePoints( [ 0, height ] ), type: "string" }
		dimensions.push(dataDimension);
	}

	// declare other variables
	var x = d3.scale.ordinal().domain( dimensions.map( function( d ) { return d.name; } ) ).rangePoints( [0, width] );
	var dragging = {};
	var line = d3.svg.line();
	var yAxis = d3.svg.axis()
		.orient( "left" );
	
	var background;
	var foreground;

	var chart = d3.select( ".parallelOrientations" )
			.attr( "width", width + margin.left + margin.right )
			.attr( "height", height + margin.top + margin.bottom )
		.append( "g" )
			.attr( "transform", "translate( " + margin.left + "," + margin.top + " )" );
	

	dimensions.forEach( function( dimension ) {
		// console.log(filterData);
		dimension.scale.domain( filterData.map( function( d ) { return d[ dimension.name ]; } ).sort() );
	} )
	
	// add grey background lines for context
	background = chart.append( "g" )
			.attr( "class", "background" )
		.selectAll( "path" )
			.data( filterData )
		.enter()
		.append( "path" )
		.attr( "d", draw );

	// add blue foreground lines for focus
	foreground = chart.append( "g" )
			.attr( "class", "foreground" )
		.selectAll( "path" )
			.data( filterData )
		.enter()
		.append( "path" )
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
			// console.log("hoi");
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
			.each( function( d ) {console.log(d3.select(this).call(yAxis.scale(d.scale))); d3.select( this ).call( yAxis.scale( d.scale ) ); } ) 
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

	// var ordinalLabels = chart.selectAll( ".axis text" )
	// 	.on( "mouseover", mouseover )
	// 	.on( "mouseout", mouseout );

	// var projection = chart.selectAll( ".background path, .foreground path" )
	// 	.on( "mouseover", mouseover )
	// 	.on( "mouseout", mouseout );

	// function mouseover( d ) {

	// 	chart.classed( "active", true );
	// 	projection.classed( "inactive", function( p ) { return p.name; } );
	// 	// projection.filter( function( p ) { return p.name; } ).each( moveToFront );
	// 	ordinalLabels.classed( "inactive", function( p ) { return p; } );
	// 	// ordinalLabels.filter( function( p ) { return p; } ).each( moveToFront);
	// }

	// function mouseout( d ) {

	// 	chart.classed( "active", false );
	// 	projection.classed( "inactive", false);
	// 	ordinalLabels.classed( "inactive", false);
	// }

	// function moveToFront() {

	// 	this.partentNode.appendChild( this );
	// }

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
			return actives.every( function( p, i ) { return extents[i][0] <= p.scale( d[p.name] ) && p.scale( d[p.name] ) <= extents[i][1];
			}) ? null : "none";
		})
	}
}

// updateParallelCoordinatesGraph function
function updateParallelCoordinatesGraph( globalData, chosenQuestion, country ) {

	d3.select( ".parallelOrientations" )
		.selectAll( "g" )
		.remove();

	drawParallelCoordinatesGraph( globalData, chosenQuestion, countryCode );
}

// function barUpdatesParallel
function barUpdatesParallel( globalData, chosenQuestion, countryCode, answer ) {

	var answerData = [];

	for ( var i = 0; i < globalData.length; i++ ) {

		if ( globalData[i].countryCode3 == countryCode && globalData[i][chosenQuestion] == answer ) {

			answerData.push( globalData[i] );
		}
	}
	
	// redraw lines
	d3.select( ".parallelOrientations" )
		.selectAll( "g" )
			.remove();

	drawParallelCoordinatesGraph( answerData, chosenQuestion, countryCode );

}

/* 
calculateChoice function
function calculates the total times a choice option is chosen by participants from a certain country 
*/
function calculateChoice( globalData, chosenQuestion, countryCode ) {

	// select answer possibilities for the selected question
	if ( chosenQuestion == "basicIncomeAwareness" ) {

			answer1 = "I understand it fully";
			answer2 = "I know something about it";
			answer3 = "I have heard just a little about it";
			answer4 = "I have never heard of it";
			answer5 = "";
			answer6 = "";
			answer7 = "";
			answer8 = "";
			answer9 = "";
			otherAnswer = "";
		}
		else if ( chosenQuestion == "basicIncomeVote" ) {

			answer1 = "I would vote for it";
			answer2 = "I would probably vote for it";
			answer3 = "I would probably vote against it";
			answer4 = "I would vote against it";
			answer5 = "I would not vote";
			answer6 = "";
			answer7 = "";
			answer8 = "";
			answer9 = "";
			otherAnswer = "";
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
			otherAnswer = "";
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
	for ( var k = 0; k < globalData.length; k++ ) {

		// check if participant belongs to current check country
		if ( countryCode == globalData[k].countryCode3 ) {
			
			// count chosen options for participants per country
			if ( globalData[k][chosenQuestion]== answer1 ) {
				choice1 = choice1 + 1;
			}
			
			else if ( globalData[k][chosenQuestion] == answer2 ) {
				choice2 = choice2 + 1;
			}
			
			else if ( globalData[k][chosenQuestion] == answer3 ) {
				choice3 = choice3 + 1;
			}
			
			else if ( globalData[k][chosenQuestion] == answer4 ) {
				choice4 = choice4 + 1;
			}
			
			else if ( globalData[k][chosenQuestion] == answer5 ) {
				choice5 = choice5 + 1;
			}

			else if ( globalData[k][chosenQuestion] == answer6 ) {
				choice6 = choice6 + 1;
			}
			
			else if ( globalData[k][chosenQuestion] == answer7 ) {
				choice7 = choice7 + 1;
			}

			else if ( globalData[k][chosenQuestion] == answer8 ) {
				choice8 = choice8 + 1;
			}

			else if ( globalData[k][chosenQuestion] == answer9 ) {
				choice9 = choice9 + 1;
			}

			else {
				other = other + 1;
			}
		totalParticipants = totalParticipants + 1;
		}
	}
	
	return [answer1, answer2, answer3, answer4, answer5, answer6, answer7, 
	answer8, answer9, otherAnswer, choice1, choice2, choice3, choice4, choice5, choice6, 
	choice7, choice8, choice9, other, totalParticipants];

}

// genderDropDown
function genderDropDown( gender ) {

	var chosenGender;
	var genderData = [];

	// shows question of choice by user and gives it to the data selection function
	if ( document.getElementById( gender ).id == "male" ) {

		chosenGender = "male";
	}
	else if ( document.getElementById( gender ).id == "female" ) {

		chosenGender = "female";
	}

	for ( var i = 0; i < globalData.length; i++ ) {

		if ( globalData[i].countryCode3 == countryCode && globalData[i].gender == chosenGender ) {

			genderData.push( globalData[i] );
		}
	}

	// console.log(genderData);

	d3.select( ".parallelOrientations" )
		.selectAll( "g" )
		.remove();

	drawParallelCoordinatesGraph( genderData, chosenQuestion, countryCode );	
}

// genderDropDown
function residencyDropDown( residency ) {

	var chosenResidency;
	var residencyData = [];

	// shows question of choice by user and gives it to the data selection function
	if ( document.getElementById( residency ).id == "rural" ) {

		chosenResidency = "rural";
	}
	else if ( document.getElementById( residency ).id == "urban" ) {

		chosenResidency = "urban";
	}
		
	for ( var i = 0; i < globalData.length; i++ ) {

		if ( globalData[i].countryCode3 == countryCode && globalData[i].ruralUrban == chosenResidency ) {

			residencyData.push( globalData[i] );
		}
	}	

	// console.log(residencyData);

	d3.select( ".parallelOrientations" )
		.selectAll( "g" )
		.remove();

	drawParallelCoordinatesGraph( residencyData, chosenQuestion, countryCode );
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
/* Daphne Box
10455701
this javascript file is the main file for my programming project where all important functions are written to load data and figures are programmed
*/

var globalData;

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
	colorMap( globalData );
	updateMap( globalData );
	drawBarGraph( globalData );
	console.log(globalData);
	drawParallelCoordinatesGraph( globalData );
	
}

// dropdownMap function
function dropdownMap( question ) {

	var chosenQuestion;

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
		else if ( document.getElementById( question ).id == "argumentsFor" ) {

			chosenQuestion = "basicIncomeArgumentsFor";
		}
		else if ( document.getElementById( question ).id == "argumentsAgainst" ) {

			chosenQuestion = "basicIncomeArgumentsAgainst";
		}
	}

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

			svg.selectAll( ".europeMap" )
					.data( topojson.feature( data, data.objects.customgeo3 ).features )
				.enter()
				.append( "path" )
					.attr( "class", "country")
					.attr( "id", function( d ) { return d.properties.sov_a3; } )
					.attr( "stroke", "#000000" )
					.attr( "fill", "#E0E0E0" )
					.attr( "d", path )
					.on( "mouseover", function( d ){ d3.select( this )
							.style( "opacity", 0.5 ) 
						d3.select( this ).append( "text" )
						.attr("class", "countryName")
						.text( d.properties.sovereignt ) } )
					.on( "mouseout", function( d ){ d3.select( this )
							.style( "opacity", 1 ) 
						d3.select( ".countryName" )
							.remove() } )
					.on( "click", function(){ updateBarGraph() } );

			// colorMap();
		});	
	}).call( this );
}

/* 
colorMap function
gives the countries on the map a color according to corresponding data
*/

function colorMap( data ) {
	
	console.log(1, data);

	// var data = loadData();
	// console.log(data);
	// declare necessary variables, choice variables are declared in order of description of codebook_basicIncome.pdf file
	var countryList = [];

	for ( var i = 1; i < data.length; i++ ) {

		if ( i < ( data.length - 1 ) ) {

			// determine how many countries are surveyed
			if ( data[i - 1].countryCode3 != data[i].countryCode3 ) {
				countryList.push( data[i - 1].countryCode3 );
			}
		}
		else {

			countryList.push( data[i - 1].countryCode3 );
		}
	}

	// loop through the list of all surveyed countries
	for ( var j = 0; j < countryList.length; j++ ) {

		country = countryList[j];
		
		// determine which options is chosen most often and determine color
		var returncalculateChoices = calculateChoice( data, country );
		var choicesList = ["choice1", "choice2", "choice3", "choice4", "choice5", "other"];
		var choices = [];
		var colorCountries = ["#B71C1C", "#E57373", "#64B5F6", "#0D47A1", "#616161"];
		var choiceMax = 0;
		var choiceVar = "";
		var choiceColor;
		var mostChosenPercentage;

		// put necessary data in choices
		for ( var l = 0; l < ( returncalculateChoices.length - 1 ); l++ ) {

			choices.push( returncalculateChoices[l] );
		}

		for ( var m = 0; m < choices.length; m++ ) {

			if ( choiceMax < choices[m] ) {

				choiceMax = choices[m];
				choiceVar = choicesList[m];
				choiceColor = colorCountries[m];
			}
		}
		
		mostChosenPercentage = ( choiceMax / returncalculateChoices[( returncalculateChoices.length - 1 )] ) * 100;

		// color country
		var currentCountry = "#" + countryList[j] + "";

		d3.selectAll( currentCountry )
			.attr( "fill", choiceColor );
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

function drawBarGraph( data ) {

	// make data complete for a country
	var countryCode = "DEU";
	var dataCountry = calculateChoice( data, countryCode );
	var choicesList = ["choice1", "choice2", "choice3", "choice4", "choice5", "other"];

	// calculate percentages
	var dataCountryPercentages = [];

	for ( var i = 0; i < ( dataCountry.length - 1 ); i++ ) {

		var percentage = ( dataCountry[i] / dataCountry[dataCountry.length - 1] ) * 100;
		dataCountryPercentages.push( { "choice": choicesList[i], "percentage" : percentage } );
	}
	
	// state dimensions
	var margin = { top: 30, right: 30, bottom: 100, left: 50 };
	var width = 400 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

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

	var bar = chart.selectAll( "g" )
			.data( dataCountryPercentages )
		.enter()
		.append( "g" )
			.attr("class", "bar")
			.attr( "transform", function( d ){ return "translate( " + ( margin.left + x( d.choice ) ) + ",0 )"; } );

	bar.append( "rect" )
		.attr( "y", function( d ) { return y( d.percentage ); } )
		.attr( "height", function( d ) { return ( height - y( d.percentage ) ); } )
		.attr( "width", ( barWidth - 5 ) ) 
		.attr( "fill", "blue" );

	bar.append( "text" )
		.attr( "x", barWidth / 2 )
		.attr( "y", function( d ) { return y( d.percentage ); } )
		.attr( "dy", ".75em" )
		.text( function( d ) { return d.choicesList; } );

	// make axis
	var xAxis = d3.svg.axis()
		.scale( x )
		.orient( "bottom" );

	chart.append( "g" )
		.attr( "class", "x axis" )
		.attr( "transform", "translate(" + margin.left + "," + height + " )" )
		.call( xAxis );	
	
	chart.append( "text" )
		.attr( "class", "label" )
		.attr( "x", width )
		.attr( "y", height + 30 )
		.attr("transform", "translate(" + (width / 2) + ", 20)")
		.style( "text-anchor", "end" )
		.text( "choice" );

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

function updateBarGraph(){
	
	console.log("hoi");
	d3.selectAll( ".bar" )
		.remove()

	d3.select( ".barChart" )
}

/*
 drawParallelCoordinatesGraph function
code for parallel coordinates graph is derived from: https://bl.ocks.org/mbostock/1341021
*/

function drawParallelCoordinatesGraph( data ) {

	// state dimentions
	var margin = { top: 100, right: 30, bottom: 30, left: 30 };
	var width = 700 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	
	var line = d3.svg.line();
	var axis = d3.svg.axis()
		.orient( "left" );
	
	var background;
	var foreground;

	var chart = d3.select( ".parallelOrientations" )
			.attr( "width", width + margin.left + margin.right )
			.attr( "height", height + margin.top + margin.bottom )
		.append( "g" )
			.attr( "transform", "translate( " + margin.left + "," + margin.top + " )" );

	 // make filter for all data that needs to be included in the graph
	var filter = d3.keys( data[0] )
		.filter( function( d ) { return d != "countryCode2" && d != "countryCode3" && d != "age" 
			&& d != "gender" && d != "ruralUrban" && d != "basicIncomeAwareness" && d != "basicIncomeEffect" 
			&& d != "basicIncomeArgumentsFor" && d != "basicIncomeArgumentsAgainst" && d != "weight" } );

	// make the different scales for each object in filter
	var dimensions = [];

	for ( var i = 0; i < filter.length; i++ ){
		
		var dataDimension = { name: "" + filter[i] + "", scale: d3.scale.ordinal().rangePoints( [ 0, height ] ), type: "string" }
		dimensions.push(dataDimension);
	}

	// declare other variables
	var x = d3.scale.ordinal().domain( dimensions.map( function( d ) { return d.name; } ) ).rangePoints( [0, width] );
	var y = {};

	dimensions.forEach( function( dimension ) {

		dimension.scale.domain( data.map( function( d ) { return d[ dimension.name ]; } ).sort() );
	} )

	// // extract list of dimensions and create a scale for each
	// x.domain( dimensions = d3.keys( data[0] )
	// 	.filter( function( d ) { return d != "countryCode2" && d != "countryCode3" && d != "age" 
	// 		&& d != "gender" && d != "ruralUrban" && d != "basicIncomeAwareness" && d != "basicIncomeEffect" 
	// 		&& d != "basicIncomeArgumentsFor" && d != "basicIncomeArgumentsAgainst" && d != "weight" 
	// 		&& ( y[d] = d3.scale.ordinal().rangePoints( [0, height] )
	// 		.domain( d3.extent( data, function( p ) { return + p[d]; } ) )
	// 		.range( [height, 0] ) )
	// } ) );
	
	// make path for lines
	var path = function( d ) { return line( dimensions.map( function( p ) { return [x( p ), y[p]( d[p] )]; } ) ) };
	// console.log(typeof(path));
	// add grey background lines for context
	background = chart.append( "g" )
			.attr( "class", "background" )
		.selectAll( "path" )
			.data( data )
		.enter()
		.append( "path" )
		.attr( "d", path );

	// add blue foreground lines for focus
	foreground = chart.append( "g" )
			.attr( "class", "foreground" )
		.selectAll( "path" )
			.data( data )
		.enter()
		.append( "path" )
		.attr( "d", path );

  // add a group element for each dimension
  var g = chart.selectAll( ".dimension" )
  		.data( dimensions )
	.enter()
	.append( "g" )
		.attr( "class", "dimension" )
		.attr( "transform", function( d ) { return "translate( " + x(d) + " )"; } );

	// add an axis and title
	chart.selectAll( ".dimension" )
		.append( "g" )
			.attr( "class", "axis" )
			.each( function( d ) { d3.select( this ).call(axis.scale( [d.scale] ) ) } )
		.append( "text" )
			.style( "text-anchor", "middle" )
			.attr( "y", -9 )
			.text( function( d ) { return d; });

	// add and store a brush for each axis
	g.append( "g" )
			.attr( "class", "brush" )
			.each( function( d ) { d3.select( this ).call( y[d].brush = d3.svg.brush().y( y[d] ).on( "brush", brush ) ); } ) 
		.selectAll( "rect" )
			.attr( "x", -8 )
			.attr( "width", 16 );

	// returns path for given data point
	

	// handles a brush event, toggling the display of foreground lines
	function brush() {

		var actives = dimensions.filter( function ( p ) { return !y[p].brush.empty(); } );
		var extents = actives.map( function ( p ) { return y[p].brush.extent(); } );

		foreground.style("display", function( d ) { return actives.every( function ( p, i ) { return extents[i][0] <= d[p] && d[p] <= extents[i][1]; } ) ? null : "none"; } )
	}
}

// updateParallelCoordinatesGraph function

/* 
calculateChoice function
function calculates the total times a choice option is chosen by participants from a certain country 
*/
function calculateChoice( data, country ) {

	// declare variables necessary to count votes and participants
	var totalParticipants = 0;
	var choice1 = 0;
	var choice2 = 0;
	var choice3 = 0;
	var choice4 = 0;
	var choice5 = 0;
	var other = 0;
	var question = dropdownMap( question );

	// loop through dataset
	for ( var k = 0; k < data.length; k++ ) {

		// check if participant belongs to current check country
		if ( country == data[k].countryCode3 ) {
			
			// count chosen options for participants per country
			if ( data[k][question]== "I would vote for it" ) {
				choice1 = choice1 + 1;
			}
			
			else if ( data[k][question] == "I would probably vote for it" ) {
				choice2 = choice2 + 1;
			}
			
			else if ( data[k][question] == "I would probably vote against it" ) {
				choice3 = choice3 + 1;
			}
			
			else if ( data[k][question] == "I would vote against it" ) {
				choice4 = choice4 + 1;
			}
			
			else if ( data[k][question] == "I would not vote" ) {
				choice5 = choice5 + 1;
			}
			
			else {
				other = other + 1;
			}
		totalParticipants = totalParticipants + 1;
		}
	}
	
	choice1, choice2, choice3, choice4, choice5, other, totalParticipants;
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
/* Daphne Box
10455701
this javascript file is the main file for my programming project where all important functions are written to load data and figures are programmed
*/

// main function
window.onload = function main(){
	// load data
	d3.csv("basicIncomeDoubleCountries.csv", function(data){
		
		// console.log(data);
		// select question, to start with only data from question vote for will be selected!!!
		// var question = [];
		// var countries = [];
		// data.forEach(function(d){
		// 	console.log(d.country_code_3);
		// 	question.push(d.basic_income_vote, d.country_code_3);
		// 	countries.push(d.country_code_3);
		// })
		// console.log(question);
		// console.log(countries);
		drawMap(data);
		drawBarGraph(data);
		// colorMap(data);
	})
}

// dropdownMap function

/* drawMap function
code comes from: http://bl.ocks.org/milafrerichs/69035da4707ea51886eb
json of Europe comes from: https://geojson-maps.ash.ms/
*/
function drawMap(dataColors){
	(function(){
		var center, height, path, projection, scale, svg, width;
		width = 700;
		height = 1000;
		center = [5, 70];
		scale = 500;
		projection = d3.geo
			.mercator()
			.scale(scale)
			.translate([width / 2, 0])
			.center(center);
		path = d3.geo
			.path()
			.projection(projection);
		column = d3.select(".map");
				
		svg = column.select("svg")		
			.attr("height", height)
			.attr("width", width);
		
		d3.json("scripts/custom-geo-3_topojson.json", function(error, data) {
			if (error){
				throw error;
			}

			var europeMap = topojson.feature(data, data.objects.customgeo3);
			console.log(europeMap);

			svg.selectAll(".europeMap")
					.data(topojson.feature(data, data.objects.customgeo3).features)
				.enter()
				.append("path")
					.attr("id", function(d) {return d.properties.sov_a3;})
					.attr("stroke", "#000000")
					.attr("fill", "#E0E0E0")
					.attr('d', path);

			colorMap(dataColors);
		});

		
	}).call(this);
}

// colorMap function
function colorMap(data){
	console.log(data);


	// declare necessary variables, choice variables are declared in order of description of codebook_basicIncome.pdf file
	var countryList = [];

	for( var i = 1; i < data.length; i++ ){

		if ( i < (data.length - 1 ) ){

			// determine how many countries are surveyed
			if ( data[ i - 1 ].country_code_3 != data[ i ].country_code_3 ){
				countryList.push( data[i - 1].country_code_3 );
			}
		}
		else{

			countryList.push( data[i - 1].country_code_3 );
		}
		console.log(countryList);
	}

	// loop through the list of all surveyed countries
	for( var j = 0; j < countryList.length; j++){

		country = countryList[j];
		
		// determine which options is chosen most often and determine color
		var returncalculateChoices = calculateChoice(data, country);
		var choicesList = [ "choice1", "choice2", "choice3", "choice4", "choice5", "other" ];
		var choices = [];
		var colorCountries = [ "#B71C1C", "#E57373", "#64B5F6", "#0D47A1", "#616161" ];
		var choiceMax = 0;
		var choiceVar = "";
		var choiceColor;
		var mostChosenPercentage;

		// put necessary data in choices
		for ( var l = 0; l < (returncalculateChoices.length - 1); l++){

			choices.push( returncalculateChoices[l] );
		}
		console.log(returncalculateChoices);
		console.log(choices);
		for( var m = 0; m < choices.length; m++ ){

			if( choiceMax < choices[m]){

				choiceMax = choices[m];
				choiceVar = choicesList[m];
				choiceColor = colorCountries[m];
			}
		}
		
		mostChosenPercentage = ( choiceMax / returncalculateChoices[( returncalculateChoices.length - 1 )] ) * 100;
		console.log("country:", countryList[ j ], "most chosen:", choiceVar, "with percentage:", mostChosenPercentage, choiceColor);

		// color country
		var currentCountry = "#" + countryList[ j ] + "";

		d3.selectAll(currentCountry)
			.attr("fill", choiceColor);
	}
}

// updateMap function

// drawBarGraph function
function drawBarGraph(data){

	// make data complete for a country
	var countryCode = "DEU";
	var dataCountry = calculateChoice(data, countryCode);
	var choicesList = [ "choice1", "choice2", "choice3", "choice4", "choice5", "other" ];

	// calculate percentages
	var dataCountryPercentages = [];

	for ( var i = 0; i < (dataCountry.length - 1 ); i++ ){

		var percentage = ( dataCountry[i] / dataCountry[dataCountry.length - 1] ) * 100;
		dataCountryPercentages.push( { "choice": choicesList[i], "percentage" : percentage } );
	}
	console.log(dataCountryPercentages[0].percentage);
	// state dimensions
	var margin = { top: 100, right: 30, bottom: 30, left: 30 };
	var width = 400 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var y = d3.scale.linear()
		.range( [height, 0] );

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	function(error, dataCountryPercentages){

		// check for errors
		if (error) throw error;

		// make translation formula to calculate the bar heigth and width
		x.domain( dataCountryPercentages.map( function (d) { return d.choice; }));
		y.domain( [ 0, d3.max( dataCountryPercentages, function (d) { return d.percentage; })]);

		var chart = d3.select(".barChart")
			.attr( "width", width )
			.attr( "height", height );

		var barWidth = width / data.length;

		var bar = chart.selectAll("g")
				.data(data)
			.enter()
			.append( "g" )
				.attr( "transform", function( d, i ){ return "translate(" + i * barWidth + ",0)"; } );

		bar.append("rect")
			.attr( "x", function(d) { return x ( d.choice );})
			.attr( "y", function(d) { return y ( d.percentage );})
			.attr( "height", function(d){ height - y( d.percentage );})
			.attr("width", barWidth - 1 );

		bar.append("text")
			.attr("x", barWidth / 2 )
			.attr("y", function(d){ return y(d.percentage); })
			.attr("dy", ".75em")
			.text(function(d){ return d.choicesList ;});

		// make axis
		var xAxis = chart.svg.axis()
			.scale(y)
			.orient("bottom");

		var yAxis = chart.svg.axis()
			.scale(x)
			.orient("left");
	}
}

// updateBarGraph function

// drawParallelCoordinatesGraph function

// updateParallelCoordinatesGraph function

/* 
calculateChoice function
function calculates the total times a choice option is chosen by participants from a certain country 
*/
function calculateChoice(data, country){

	// declare variables necessary to count votes and participants
	var totalParticipants = 0;
	var choice1 = 0;
	var choice2 = 0;
	var choice3 = 0;
	var choice4 = 0;
	var choice5 = 0;
	var other = 0;

	// loop through dataset
	for( var k = 0; k < data.length; k++){

		// check if participant belongs to current check country
		if( country == data[k].country_code_3 ){
			
			// count chosen options for participants per country
			if( data[ k ].basic_income_vote == "I would vote for it"){
				choice1 = choice1 + 1;
			}
			
			else if( data[ k ].basic_income_vote == "I would probably vote for it"){
				choice2 = choice2 + 1;
			}
			
			else if( data[ k ].basic_income_vote == "I would probably vote against it"){
				choice3 = choice3 + 1;
			}
			
			else if( data[ k ].basic_income_vote == "I would vote against it"){
				choice4 = choice4 + 1;
			}
			
			else if( data[ k ].basic_income_vote == "I would not vote"){
				choice5 = choice5 + 1;
			}
			
			else{
				other = other + 1;
			}
		totalParticipants = totalParticipants + 1;
		}
	}
	console.log(totalParticipants);
	return [ choice1, choice2, choice3, choice4, choice5, other, totalParticipants ];
}

/* 
showInfo function
code for tab funtionality so it reacts on clicking and code is derived from: https://www.w3schools.com/howto/howto_js_tabs.asp
*/
function showInfo(evt,show){
	// declare all variables
	var i, tabContent, tabLinks;

	// get tabContent elements and hide them
	tabContent = document.getElementsByClassName("tabContent");
	for(i = 0; i < tabContent.length; i++){
		tabContent[i].style.display = "none";
	}

	// show current tab, and add an "active" class to the button that opened the tab
	document.getElementById(show).style.display = "block";
}
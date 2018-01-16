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
		
		d3.json("scripts/customEuropeMap_topojson.json", function(error, data) {
			if (error){
				throw error;
			}

			var europeMap = topojson.feature(data, data.objects.customEuropeMap);
			console.log(europeMap);

			svg.selectAll(".europeMap")
					.data(topojson.feature(data, data.objects.customEuropeMap).features)
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
	var totalParticipants = 0;
	var choice1 = 0;
	var choice2 = 0;
	var choice3 = 0;
	var choice4 = 0;
	var choice5 = 0;
	var other = 0;

	for( var i = 1; i < data.length; i++ ){

		// determine how many countries are surveyed
		if( data[ i - 1 ].country_code_3 != data[ i ].country_code_3 ){
			countryList.push( data[i - 1].country_code_3 );
		}
	}

	// loop through the list of all surveyed countries
	for( var j = 0; j < countryList.length; j++){

		for( var k = 0; k < data.length; k++){

			// check if participant belongs to current check country
			if( countryList[j] == data[k].country_code_3 ){
				
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
			totalParticipants =+ 1;
			}
		}

		// determine which options is chosen most often and determine color
		var choicesList = [ "choice1", "choice2", "choice3", "choice4", "choice5", "other" ];
		var mostChosen = [ choice1, choice2, choice3, choice4, choice5, other ];
		var colorCountries = [ "#B71C1C", "#E57373", "#64B5F6", "#0D47A1", "#616161" ];
		var choiceMax = 0;
		var choiceVar = "";
		var choiceColor;

		for( var l = 0; l < mostChosen.length; l++ ){

			if( choiceMax < mostChosen[ l ]){

				choiceMax = mostChosen[ l ];
				choiceVar = choicesList[ l ];
				choiceColor = colorCountries[ l ];
			}
		}
		
		mostChosenPercentage = ( choiceMax / totalParticipants ) * 100;
		console.log("country:", countryList[ j ], "most chosen:", choiceVar, "with percentage:", mostChosenPercentage, choiceColor);

		// color country
		var currentCountry = "#" + countryList[ j ] + "";
		console.log((currentCountry));

		d3.select(currentCountry)
			.attr("fill", choiceColor);
		
		// set data to zero for next country
		choice1 = 0;
		choice2 = 0;
		choice3 = 0;
		choice4 = 0;
		choice5 = 0;
		other = 0;
	}
}

// updateMap function

// drawBarGraph function

// updateBarGraph function

// drawParallelCoordinatesGraph function

// updateParallelCoordinatesGraph function

/* showInfo function
code for tab funtionality is derived from: https://www.w3schools.com/howto/howto_js_tabs.asp
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
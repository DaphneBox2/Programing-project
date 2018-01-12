/* Daphne Box
10455701
this javascript file is the main file for my programming project where all important functions are written to load data and figures are programmed
*/

// main function
window.onload = function main(){
	// load data
	d3.csv("basic_income_dataset_dalia.csv", function(data){
		// select question, to start with only data from question vote for will be selected!!!
		var question = [];
		data.forEach(function(d){
			question.push(d.question_bbi_2016wave4_basicincome_vote);
			// console.log(question);
		})
		console.log(question);
		drawMap();
		colorMap(question);
	})
}

// dropdownMap function

/* drawMap function
code comes from: http://bl.ocks.org/milafrerichs/69035da4707ea51886eb
json of Europe comes from: https://geojson-maps.ash.ms/
*/
function drawMap(){
	(function(){
		var center, countries, height, path, projection, scale, svg, width;
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
		svg = d3.select(".map")
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
					.attr("fill", "#ffffff")
					.attr('d', path);
		});
	}).call(this);
}

// colorMap function
function colorMap(){

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
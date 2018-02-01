# Final report Daphne Box

## Short description
This application shows the opinion and knowledge about basic income from citizens in all European Union member countries. At first an overall most chosen answer of all countries is shown on a map. Secondly the two other graphs show more detailed information about the choices and demographics of the participants of one single country. The country displayed in the graphs is chosen by clicking on the correspondend country in the map.

## Technical design

### Overview
My website consists of two tabs one of which contains all information and one that shows all the data. To operate the tabs a function is written in JavaScript that shows one of the two tabs on an onclick basis.

Since the info tab is only showing text, there are no functions in the Javascript file that can be called at this page.

On the other hand the data tab shows an interactive map, bar chart and parallel coordinates graph. Furthermore, there is a dropdown for question/ data selection and an option to influence the data order in the bar chart upon a radio button selection. All maps, graphs and interactive elements are supported with functions in the JavaScript file. 

### Description of all functions
#### Function to operate tabs
ShowInfo: is the function that is used to show and hide the two tabs on the webpage the function is called by the html code on click base. Within the JavaScript file the showInfo function does not interact with any other function in the JavaScript file.

#### Functions for the data tab
*Main: the main function is used to draw the lines of the map of Europe by calling the drawMap function and to load all the different datafiles necessary to operate most of the other functions to make the visualizations and functions to interact with them. Furthermore main calls the function dataLoaded. 
*dataLoaded: makes from the data a global variable and calls the functions that draw the two graphs and the function that colors the maps.
*drawMap: this function draws the strokes/lines of the map and host the mouse events when an onclick happens drawMap calls the two functions that update the two graphs. For the information that needs to be shown when hovering over a country the function calls the calculateChoice function to get the calculated outcome.
*colorMap: colors the countries on the map according to outcome which is obtained via splitting the data on country and calling the calculateChoice function. Furthermore, this function creates the legend of the map.
*drawBarGraph: draws the total barGraph and uses calculateChoice to calculate the outcome of the data. When clicking on the bar the function calls the barUpdatesParallel function.
*drawParallelCoordinatesGraph: draws the parallel coordinates graph for this function three datasets with pre-counting are necessary which is done with a python file (parallelCoordinateData.py).
*updateMap: updates the colors of the map by removing the legend and recalling the colorMap function.
*updateBarGraph: is called when clicking on the radio buttons at the website or after required data changes and the function removes the current bar graph and calls the drawBarGraph function.
*calculateChoice: calculates given the input variables how many times a certain answer is chosen on a questionnaire by participants comming from the same country and counts the total participants from a certain country and the percentages of all answer.
*barUpdatesParallel: on click on barchart this function is called and alters the data given to the parallel coordinates graph 
*updateParallelCoordinatesGraph: is called upon required data changes and removes the parallel coordinates graph and recalls the drawParallelCoordinatesGraph function.
*dropdownMap: is the code called after choice on dropdown is made/chosen it changes the global variable chosenQuestion and calls the functions to update the graphs and map colors.

## Challenges and decisions
The main challenge I have faced was to get the parallel coordinates graph working, especially the brush function took me 4 days to implement. Only after the graph was working as described in the document I figured out that some choices were not that good. An example of this was that the dataset had too many participants to see anything happen if I pre-selected the data with a dropdown. I changed the dropdown with radio buttions changing the order of bars and included the former selection options as axis on the graph. Furthermore, I have given the line another color if it represented multiple persons. 
Another thing that I changed was that I excluded the multiple answer questions out of my visualisations since they were harder to implement and leaving them out only changed the amount of choice options in the dropdown but did not limit the functionality options. 

## Ideal world
In an ideal world with much more time (or with much more programming knowledge), I would have implemented the crossinteraction from the parallel coordinates graph to the bar graph this is currently not done.
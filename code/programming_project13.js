// make legenda
	var legend = d3.select( ".map" )
		.append( "g" )
		.attr("class", "legenda")
		.append("rect")
	        .attr("id", "canvas")
	        .attr("x", 550)
	        .attr("y", 395)
	        .attr("class", "st0")
	        .attr("width", "250")
	        .attr("height", "150")
	        .style("opacity", "0.1");

    // make rectangles with colors for legenda
    for ( var p = 1; p < ( colorCountries.length + 1 ); p++ ) {
    	
    	d3.select( ".legenda")
    		.select( "#canvas" )
        	.append( "rect" )
	            .attr( "x", 550 )
	            .attr( "y", ( 23.4 * ( p ) + 400 ) )
	            .attr( "class", "st1" )
	            .attr( "width", "10" )
	            .attr( "height", "15" )
	            .style( "fill", colorCountries[p] );
    }
   

    // make text element to describe input legenda and data
    for ( var q = 1; q < ( choicesList.length + 1 ); q++ ) {
    	
    	d3.select(".legenda")
    		.select( "#canvas" )
	        	.append( "rect" )
	            .attr( "x", 580 )
	            .attr( "y", ( 23.4 * ( q ) + 410 ) )
	            .attr( "class", "st2" )
	            .attr( "width", "60" )
	            .attr( "height", "15" )
	            .text( choicesList[q] );
    }   


    
		d3.selectAll( currentCountry )
			.attr( "data-legend", function( d ) { return d.choicesList; } )
			.attr( "fill", choiceColor );

		var legend = d3.selectAll( currentCountry )
			.select( "svg" )
			.attr( "class", "legend" )
			.attr( "transform", "translate( 50, 30 )" )
			.style( "font-size", "12px" )
			.call( d3.legend );
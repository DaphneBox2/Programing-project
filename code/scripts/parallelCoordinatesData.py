'''
Daphne Box
10455701
Transforms a csv file to JSON format
'''

import csv
import json

# open the input and output file
inputFile = open( "basicIncomeDoubleCountries.csv", "r" )
outputFile = open( "parallelCoordinatesDataEffect.csv", "w" )

# read write to the files
reader = csv.reader( inputFile, delimiter = ",", quoting = csv.QUOTE_NONE )
writer = csv.writer( outputFile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL )

# make column titles and write them to the output file
fieldNames = ["countryName", "age", "gender", "ruralUrban", "educationLevel", "fullTime", "children", "basicIncomeEffect"]
writer.writerow( fieldNames )

# claim variables that need to be an empty array or contain specific predefined values
count = 0
sameValues = []
fieldNames.append(count)
sameValues.append(fieldNames)

'''' 
loop through the reader and put the data in correct format
put them all together in an array and write them to the out-put file
'''
for row in reader:
	for i in range( len( sameValues ) ):
		if ( row[1] == sameValues[i][0] and row[2] == sameValues[i][1] and row[3] == sameValues[i][2] and row[4] == sameValues[i][3] and row[5] == sameValues[i][4] and row[6] == sameValues[i][5] and row[7] == sameValues[i][6] and row[10] == sameValues[i][7] ):
			sameValues[i][8] = sameValues[i][8] + 1
			break
		elif ( i == len( sameValues ) - 1 ):
			usefullCells = [row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[10], count]
			sameValues.append( usefullCells )


for j in range( len( sameValues ) ):
	writer.writerow( sameValues[j] )

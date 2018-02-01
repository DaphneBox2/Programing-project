'''
Daphne Box
10455701
Transforms a csv file to JSON format
'''

import csv
import json

# open the input and output file
inputFile1 = open( "parallelCoordinatesDataEffect.csv", "r" )
inputFile2 = open( "parallelCoordinatesDataAwareness.csv", "r" )
inputFile3 = open( "parallelCoordinatesDataVote.csv", "r" )
outputFile = open( "parallelCoordinatesDataTotal.csv", "w" )

# read write to the files
reader1 = csv.reader( inputFile1, delimiter = ",", quoting = csv.QUOTE_NONE )
reader2 = csv.reader( inputFile2, delimiter = ",", quoting = csv.QUOTE_NONE )
reader3 = csv.reader( inputFile3, delimiter = ",", quoting = csv.QUOTE_NONE )
writer = csv.writer( outputFile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL )

# make column titles and write them to the output file
fieldNames = ["countryName", "age", "gender", "ruralUrban", "educationLevel", "fullTime", "children", "basicIncomeEffect", "count", "basicIncomeAwareness", "basicIncomeVote"]
writer.writerow( fieldNames )

# claim variables that need to be an empty array or contain specific predefined values
count = 0
sameValues = []
sameValues.append(fieldNames)

'''' 
loop through the reader and put the data in correct format
put them all together in an array and write them to the out-put file
'''
for row in reader1:
	usefullCells = [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]]
	sameValues.append( usefullCells )	

for row in reader2:
	for i in range( len( sameValues ) ):
		if ( row[0] == sameValues[i][0] and row[1] == sameValues[i][1] and row[2] == sameValues[i][2] and row[3] == sameValues[i][3] and row[4] == sameValues[i][4] and row[5] == sameValues[i][5] and row[6] == sameValues[i][6] ):
			addRows = row[7]
			sameValues[i].append( addRows )
			sameValues[i][8] = sameValues[i][8] + row[8]


for j in range( len( sameValues ) ):
	writer.writerow( sameValues[j] )

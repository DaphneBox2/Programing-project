'''
Daphne Box
10455701
Transforms a csv file to JSON format
'''

import csv
import json

# open the input and output file
inputFile1 = open( "../basic_income_dataset_dalia.csv", "r" )
inputFile2 = open( "../countryCodes.csv", "r" )
outputFile = open( "basicIncomeDoubleCountries.csv", "w" )

# read write to the files
reader1 = csv.reader( inputFile1, delimiter = ",", quoting = csv.QUOTE_NONE )
reader2 = csv.reader( inputFile2, delimiter = ",", quoting = csv.QUOTE_NONE )
writer = csv.writer( outputFile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL )

# make column titles and write them to the output file
fieldNames = ["countryCode2", "countryCode3", "age", "gender", "ruralUrban", "educationLevel", "fullTime", "children", "basicIncomeAwareness", "basicIncomeVote", "basicIncomeEffect", "basicIncomeArgumentsFor", "basicIncomeArgumentsAgainst", "ageGroup", "weight"]
writer.writerow( fieldNames )

# claim variables that need to be an empty array or contain specific predefined values
countries = []
includedColumns = [1, 2] 

# loop through county file and select all 2 and 3 letter country codes and put it in an array
for row in reader2:
	country = list( row[i] for i in includedColumns )
	countries.append( country )

'''' 
loop through the reader and put the data in correct format
put them all together in an array and write them to the out-put file
'''
for row in reader1:
	for j in range( 0, len( countries ) ):
		if row[0] == countries[j][0]:
			if row[0] != "":
				out = [row[0], countries [j][1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10],  row[11],  row[12],  row[13],  row[14]]
				writer.writerow( out )


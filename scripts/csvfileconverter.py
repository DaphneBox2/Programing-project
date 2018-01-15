'''
Daphne Box
10455701
Transforms a csv file to JSON format
'''

import csv
import json

# open the input and output file
input_file_1 = open("../basic_income_dataset_dalia.csv", "r")
input_file_2 = open("../countryCodes.csv", "r")
output_file = open("basicIncomeDoubleCountries.csv", 'w')

# read write to the files
reader_1 = csv.reader(input_file_1, delimiter = ",", quoting = csv.QUOTE_NONE)
reader_2 = csv.reader(input_file_2, delimiter = ",", quoting = csv.QUOTE_NONE)
writer = csv.writer(output_file, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)

# make column titles and write them to the output file
fieldnames = ["country_code_2", "country_code_3", "age", "gender", "rural_urban", "education_level", "full_time", "children", "basic_income_awareness", "basic_income_vote", "basic_income_effect", "basic_income_arguments_for", "basic_income_arguments_against", "age_group", "weight"]
writer.writerow(fieldnames)

# claim variables that need to be an empty array or contain specific predefined values
countries = []
included_columns = [1, 2] 

# loop through county file and select all 2 and 3 letter country codes and put it in an array
for row in reader_2:
	country = list(row[i] for i in included_columns)
	countries.append(country)

'''' 
loop through the reader and put the data in correct format
put them all together in an array and write them to the out-put file
'''
for row in reader_1:
	for j in range(0, len(countries)):
		if row[0] == countries[j][0]:
			if row[0] != "":
				out = [row[0], countries [j][1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10],  row[11],  row[12],  row[13],  row[14]]
				writer.writerow(out)


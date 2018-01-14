# # Daphne Box
# # 10455701
# # Transforms a csv file to JSON format

import csv
import json

# open the input and output file
input_file_1 = open("basic_income_dataset_dalia.csv", "r")
input_file_2 = open("countryCodes.csv", "r")
output_file = open("basicIncomeDoubleCountries.csv", 'w')

# read the file
reader_1 = csv.reader(input_file_1, delimiter = ",", quoting = csv.QUOTE_NONE)
reader_2 = csv.reader(input_file_2, delimiter = ",", quoting = csv.QUOTE_NONE)
print(reader_1)
print(reader_2)


fieldnames = ["country_code_2", "country_code_3", "age", "gender", "rural_urban", "education_level", "full_time", "children", "basic_income_awareness", "basic_income_vote", "basic_income_effect", "basic_income_arguments_for", "basic_income_arguments_against", "age_group", "weight"]
print(fieldnames)
data = []
count = 0
countries = []
included_columns = [1, 2] 

# loop through county file and select all 2 and 3 letter country codes
for row in reader_2:
	countries = list(row[i] for i in included_columns)
	print countries

# loop through the reader and put the data in correct format
# put them all together in an array and write them to the out-put file
for row in reader_1:
	for j in len(countries):
		if row[0] == countries[j]:
		if count > 0:
			i = 0
			if row[0] != "":
				out = ({fieldnames[0] : row[0], fieldnames[1] : countries[j+1], fieldnames[2] : row[1], fieldnames[3] : row[2], fieldnames[4] : row[3], fieldnames[5] : row[4], fieldnames[6] : row[5]}, fieldnames[7]: row[6], fieldnames[8]: row[7], fieldnames[9]: row[8], fieldnames[14]: row[13])
				data.append(out)
		count += 1
	data_write = (json.dumps(data, output_file))
	output_file.write(data_write)

	




	fieldnames = ["place", "months", "upper_temperature", "lower_temperature", "average_temperature", "hours_sunshine", "artificial_date"]
	print(fieldnames)
	data = []
	count = 0

# loop through the reader and put the data in correct format
# put them all together in an array and write them to the out-put file
for row in reader:
	if count > 0:
		i = 0
		if row[0] != "":
			out = ({fieldnames[0] : row[0], fieldnames[1] : row[1], fieldnames[2] : row[2], fieldnames[3] : row[3], fieldnames[4] : row[4], fieldnames[5] : row[5], fieldnames[6] : row[6]})
			data.append(out)
	count += 1
data_write = (json.dumps(data, output_file))
output_file.write(data_write)
		

from psiturkpy.experiment import validate, load_experiment, get_validation_fields
from psiturkpy.utils import find_directories
import os
import pandas
import json

myexperiments = find_directories("../")
output_file = os.path.abspath("../index.html")
data_folder = os.path.abspath("../.data")

# Let's make a dataframe of valid experiments
fields = [f[0] for f in get_validation_fields()]
valid = pandas.DataFrame(columns=fields)

# Make a table of experiment information
for candidate in myexperiments:
    if validate(candidate):
        experiment = load_experiment(candidate)[0]      
        for field in experiment.keys():
            values = experiment[field]
            # Join lists with a comma
            if isinstance(values,list):
                values = ",".join(values)
            valid.loc[experiment["tag"],field] = values

# First prepare rendered table
table = valid.to_html(index=None,classes="table table-striped table-bordered")
table = table.replace('class="dataframe',' id="chart" class="dataframe')  

# Read in template
template = "".join(open("index.html","rb").readlines())
template = template.replace("[[SUB_TABLE_SUB]]",table)
filey = open(output_file,"wb")
filey.writelines(template)
filey.close()

# Function to save pretty json file
def save_pretty_json(outfile,myjson):
    filey = open(outfile,'wb')
    filey.write(json.dumps(myjson, sort_keys=True,indent=4, separators=(',', ': ')))
    filey.close()

# Finally, save other versions of updated metadata for people to use
save_pretty_json("%s/efactory-experiments.json" %(data_folder),json.loads(valid.to_json(orient="records")))
valid.to_csv("%s/efactory-experiments.tsv" %(data_folder),sep="\t",index=None)
valid.to_pickle("%s/efactory-experiments.pkl" %(data_folder))

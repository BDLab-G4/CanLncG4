import re
import requests
from bs4 import BeautifulSoup as bs
import numpy as np
import pandas as pd
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

from tools import G4, QGRS

class ExcelSQLProcessor:
    def __init__(self, file_path, table_name, modify_column_names=True):
        self.file_path = file_path
        self.df = pd.read_excel(file_path)
        self.table_name = table_name
        if modify_column_names:
            self.df.columns = [col.lower().replace(' ', '_') for col in self.df.columns]

        self.df.columns = [col.lower().replace(' ', '_') for col in self.df.columns]

    def execute_query(self, sql_query):
        # Create a new SQLite connection for each query
        with sqlite3.connect(':memory:') as conn:
            # Store data in 'lc_rna' table
            self.df.to_sql(self.table_name, conn, index=False, if_exists='replace')
            query_result = pd.read_sql_query(sql_query, conn)
            return query_result.to_json(orient='records')




app = Flask(__name__)
excel_processor_sheet_1 = None
excel_processor_sheet_2 = None

excel_processor_sheet_2a = None
excel_processor_sheet_2b = None
excel_processor_sheet_2c = None
excel_processor_sheet_2d = None

@app.route('/query_lnc_rna_interaction_partners_a/', methods=['POST'])
def query_lnc_rna_interaction_partners():
    data = request.json
    sql_query = data.get('query')
    print(sql_query)
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:
        result = excel_processor_sheet_2a.execute_query(sql_query)

        # parse result which is a string as json
        result = json.loads(result)
        # return jsonify({'data': result})
        # return json with column and data. Column is needed for table header and data is a json array
        columns = []
        data = []


        if len(result) != 0:

            for key in result[0].keys():
                columns.append(key)

            for row in result:
                data.append(list(row.values()))

        ret_data = {'columns': columns, 'data': data, 'name': '1.1. LncRNA-protein interactions_NPInter'}
        return jsonify({'data': ret_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/query_lnc_rna_interaction_partners_b/', methods=['POST'])
def query_lnc_rna_interaction_partners_b():
    data = request.json
    sql_query = data.get('query')
    print(sql_query)
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:
        result = excel_processor_sheet_2b.execute_query(sql_query)

        # parse result which is a string as json
        result = json.loads(result)
        # return jsonify({'data': result})
        # return json with column and data. Column is needed for table header and data is a json array
        columns = []
        data = []


        if len(result) != 0:

            for key in result[0].keys():
                columns.append(key)

            for row in result:
                data.append(list(row.values()))

        ret_data = {'columns': columns, 'data': data, 'name': '1.2. LncRNA-protein interactions_LncTarD'}
        return jsonify({'data': ret_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 

@app.route('/query_lnc_rna_interaction_partners_c/', methods=['POST'])
def query_lnc_rna_interaction_partners_c():
    data = request.json
    sql_query = data.get('query')
    print(sql_query)
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:
        result = excel_processor_sheet_2c.execute_query(sql_query)

        # parse result which is a string as json
        result = json.loads(result)
        # return jsonify({'data': result})
        # return json with column and data. Column is needed for table header and data is a json array
        columns = []
        data = []


        if len(result) != 0:

            for key in result[0].keys():
                columns.append(key)

            for row in result:
                data.append(list(row.values()))

        ret_data = {'columns': columns, 'data': data, 'name': '2.1. LncRNA-RNA interactions_NPInter'}
        return jsonify({'data': ret_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/query_lnc_rna_interaction_partners_d/', methods=['POST'])
def query_lnc_rna_interaction_partners_d():
    data = request.json
    sql_query = data.get('query')
    print(sql_query)
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:

      
        result = excel_processor_sheet_2d.execute_query(sql_query)

        # parse result which is a string as json
        result = json.loads(result)
        # return jsonify({'data': result})
        # return json with column and data. Column is needed for table header and data is a json array
        columns = []
        data = []


        if len(result) != 0:

            for key in result[0].keys():
                columns.append(key)

            for row in result:
                data.append(list(row.values()))

        ret_data = {'columns': columns, 'data': data, 'name': '2.2. LncRNA-RNA interactions_LncTarD'}
     
        return jsonify({'data': ret_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/query_lnc_rna/', methods=['POST'])
def query():
    data = request.json
    sql_query = data.get('query')
    print(sql_query)
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:
        result = excel_processor_sheet_1.execute_query(sql_query)
        return jsonify({'data': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/query_qgrs_g4/', methods=['POST'])
def query2():
    data = request.json
    sql_query = data.get('query')
    print(sql_query)
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:
        result = excel_processor_sheet_2.execute_query(sql_query)
        return jsonify({'data': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/g4/', methods=['POST'])
def g4_handler():
    data = request.json
    input_str = data.get("inputString")
    window_size = data.get("windowSize")
    threshold = data.get("threshold")

    # convert window size to int and threshold to float
    window_size = int(window_size)
    threshold = float(threshold)
    input_type  = ""

    print(input_str, window_size, threshold)

    # if input starts with NR_ then it is NCBI_ID otherwise it is sequence
    if input_str.startswith("NR_"):
        input_type = "NCBI_ID"
    else:
        input_type = "seq"

    g4 = G4()
    result = g4.get_data(input_str,window_size , threshold, "NCBI_ID")

    # getting cant convert int64 to json error. so take care of it
    for row in result:
        row["numg"] = int(row["numg"])
        row["start"] = int(row["start"])
        row["score"] = float(row["score"])
        row["len"] = int(row["len"])

    

    return jsonify({"result": result})


@app.route('/qgrs/', methods=['POST'])
def qgrs_handler():
    data = request.json
    input_str = data.get("inputString")
    maxLen = data.get("maxLen")
    minGLen = data.get("minGLen")
    loopMin = data.get("loopMin")
    loopMax = data.get("loopMax")

    # convert window size to int and threshold to float
    maxLen = int(maxLen)
    minGLen = int(minGLen)
    loopMin = int(loopMin)
    loopMax = int(loopMax)
    input_type  = ""

    print(input_str, maxLen, minGLen, loopMin, loopMax)

    # if input starts with NR_ then it is NCBI_ID otherwise it is sequence
    if input_str.startswith("NR_"):
        input_type = "NCBI_ID"
    else:
        input_type = "seq"

    qgrs = QGRS()
    result = qgrs.get_data(input_str, input_type, maxLen, minGLen, loopMin, loopMax)

    # getting cant convert int64 to json error. so take care of it
    for row in result:
        row["numgs"] = int(row["numgs"])
        row["start"] = int(row["start"])
        row["score"] = float(row["score"])
        row["len"] = int(row["len"])

    return jsonify({"result": result})

if __name__ == "__main__":
    # allow cross origin requests and expose to outside world

    
    excel_processor_sheet_1 = ExcelSQLProcessor('./sheet_1.xlsx', 'lnc_rna')
    excel_processor_sheet_2 = ExcelSQLProcessor('./sheet_2.xlsx', 'qgrs_g4')

    excel_processor_sheet_2a = ExcelSQLProcessor('./LncRNA-interaction-partners/A.xlsx', 'lnc_rna_interaction_partners_a', False)
    excel_processor_sheet_2b = ExcelSQLProcessor('./LncRNA-interaction-partners/B.xlsx', 'lnc_rna_interaction_partners_b', False)
    excel_processor_sheet_2c = ExcelSQLProcessor('./LncRNA-interaction-partners/C.xlsx', 'lnc_rna_interaction_partners_c', False)
    excel_processor_sheet_2d = ExcelSQLProcessor('./LncRNA-interaction-partners/D.xlsx', 'lnc_rna_interaction_partners_d', False)


    CORS(app)
    app.run(debug=True, port=5000)
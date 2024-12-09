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
    conn = None
    def __init__(self, file_path, table_name, modify_column_names=True):
        self.file_path = file_path
        # read the file but do not convert true/false to boolean

    
        self.df = pd.read_excel(file_path)
        self.df = pd.read_excel(file_path, dtype=str)
        # fill missing cells with "NA"
        self.df = self.df.fillna("NA")
        self.table_name = table_name
        if modify_column_names:
            self.df.columns = [col.lower().replace(' ', '_') for col in self.df.columns]

        self.df.columns = [col.lower().replace(' ', '_') for col in self.df.columns]
        #self.df.columns = [col.lower().replace('(', '_') for col in self.df.columns]
        #self.df.columns = [col.lower().replace(')', '_') for col in self.df.columns]


        # if column has known_rbp, then print the column
        self.conn = self.conn = sqlite3.connect(':memory:', check_same_thread=False)
        self.df.to_sql(self.table_name, self.conn, index=False, if_exists='fail')

    def execute_query(self, sql_query):
        # Create a new SQLite connection for each query
        
            # Store data in 'lc_rna' table
            #self.df.to_sql(self.table_name, conn, index=False, if_exists='replace')
            query_result = pd.read_sql_query(sql_query,self.conn)
            return query_result.to_json(orient='records')




app = Flask(__name__)
excel_processor_sheet_1 = None
excel_processor_sheet_2 = None

excel_processor_sheet_1a = None
excel_processor_sheet_1b = None
excel_processor_sheet_1c = None
excel_processor_sheet_1d = None

excel_processor_sheet_2a = None
excel_processor_sheet_2b = None
excel_processor_sheet_2c = None


def process_query(excel_processor, dataset_name):
    data = request.json
    sql_query = data.get('query')

  
    if not sql_query:
        return jsonify({'error': 'No SQL query provided'}), 400
    
    try:
        result = excel_processor.execute_query(sql_query)
        result = json.loads(result)
        
        columns = []
        data = []
        if result:
            for key in result[0].keys():
                columns.append(key)
            for row in result:
                data.append(list(row.values()))
        
        ret_data = {'columns': columns, 'data': data, 'name': dataset_name}

        #print(ret_data)

        return jsonify({'data': ret_data})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/query_lnc_rna_interaction_partners_a/', methods=['POST'])
def query_lnc_rna_interaction_partners_a():
    return process_query(excel_processor_sheet_1a, 'LncRNA-protein interactions - NPInter')

@app.route('/query_lnc_rna_interaction_partners_b/', methods=['POST'])
def query_lnc_rna_interaction_partners_b():
    return process_query(excel_processor_sheet_1b, 'LncRNA-Protein Interactions - LncTarD')

@app.route('/query_lnc_rna_interaction_partners_c/', methods=['POST'])
def query_lnc_rna_interaction_partners_c():
    return process_query(excel_processor_sheet_1c, 'LncRNA-RNA Interactions - NPInter')

@app.route('/query_lnc_rna_interaction_partners_d/', methods=['POST'])
def query_lnc_rna_interaction_partners_d():
    return process_query(excel_processor_sheet_1d, 'LncRNA-RNA Interactions LncTarD')

@app.route('/query_rg4_binding_proteins_a/', methods=['POST'])
def query_rg4_binding_proteins_a():
   
    return process_query(excel_processor_sheet_2a, 'RG4BP - QUADRatlas')

@app.route('/query_rg4_binding_proteins_b/', methods=['POST'])
def query_rg4_binding_proteins_b():


    return process_query(excel_processor_sheet_2b, 'RG4BP - G4IPDB')

@app.route('/query_rg4_binding_proteins_c/', methods=['POST'])
def query_rg4_binding_proteins_c():
    return process_query(excel_processor_sheet_2c, 'RG4BP - Literature Mining')



@app.route('/query_lnc_rna/', methods=['POST'])
def query():
    data = request.json
    sql_query = data.get('query')
    #print(sql_query)
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

   # print(input_str, window_size, threshold)

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
        row["numgs"] = int(row["numg"])
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

    #print(input_str, maxLen, minGLen, loopMin, loopMax)

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

    excel_processor_sheet_1a = ExcelSQLProcessor('./LncRNA-interaction-partners/A.xlsx', 'lnc_rna_interaction_partners_a', False)
    excel_processor_sheet_1b = ExcelSQLProcessor('./LncRNA-interaction-partners/B.xlsx', 'lnc_rna_interaction_partners_b', False)
    excel_processor_sheet_1c = ExcelSQLProcessor('./LncRNA-interaction-partners/C.xlsx', 'lnc_rna_interaction_partners_c', False)
    excel_processor_sheet_1d = ExcelSQLProcessor('./LncRNA-interaction-partners/D.xlsx', 'lnc_rna_interaction_partners_d', False)

    excel_processor_sheet_2a = ExcelSQLProcessor('./RG4-binding-proteins/A.xlsx', 'rg4_binding_proteins_a', False)
    excel_processor_sheet_2b = ExcelSQLProcessor('./RG4-binding-proteins/B.xlsx', 'rg4_binding_proteins_b', False)
    excel_processor_sheet_2c = ExcelSQLProcessor('./RG4-binding-proteins/C.xlsx', 'rg4_binding_proteins_c', False)


    CORS(app)

    from waitress import serve
    #app.run(debug=False, port=5000, host = "0.0.0.0")
    serve(app, host="0.0.0.0", port  =5000)

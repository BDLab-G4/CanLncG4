import re
import requests
from bs4 import BeautifulSoup as bs
import numpy as np
import pandas as pd
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import json




class G4():
    def __init__(self):
        pass

    def get_data(self, input, window_size, threshold, input_type):

        if input_type == 'NCBI_ID':
            seq, url = self.get_fasta_and_link(input)
            result = self.get_g4hunter_data(seq, window_size, threshold)
        elif input_type == 'seq':
            result = self.get_g4hunter_data(input, window_size, threshold)
        else:
            print("Wrong input type")

        # return result 
        final_result = []       
        for row in result:
            max_numg = -1
            temp_res = {}
            for id, candidate in enumerate(row["sequence"]):
                temp, _ = self.numg_calc(candidate)
                if temp > max_numg:
                    max_numg = temp
                    temp_res["sequence"] = row["sequence"][id]
                    temp_res["start"] = row["start"][id]
                    temp_res["score"] = row["score"][id]
                    temp_res["len"] = row["len"][id]
                    temp_res["numg"] = temp

            # row  = temp_res
            final_result.append(temp_res)
            # row["numg"], _ = self.numg_calc(row["sequence"])
        
        return final_result

    def get_fasta_and_link(self, NCBI_ID):
        
        for i in range(5):
            reqUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=" + \
                NCBI_ID+"&rettype=fasta&retmode=text"
            response = requests.request("GET", reqUrl)
            if len("".join(response.text.split("\n")[1:])) > 0:
                break
            else:
                pass
                # print("Retrying...")

        return "".join(response.text.split("\n")[1:]), reqUrl

    def calculate_g4hunter_score(self, seq):
        # scores the sequence based on G's and C's
        # GGATCCCAAGGGAA => 2,2,0,0,-3,-3,-3,0,0,3,3,3,0,0 
        
        window_size = len(seq)
        count = 0
        j = 0
        temp = []
        
        while j < (window_size):
            e = seq[j]
            
            temp_count = 1
            
            if e == "G":
                for k in range(j+1, window_size):
                    if seq[k] == "G":
                        temp_count += 1
                    else:
                        j = k - 1
                        break
                else:
                    j = window_size
                temp += [min(temp_count,4) for i in range(temp_count)]
                
                
            elif e == 'C':
                for k in range(j+1, window_size):
                    if seq[k] == "C":
                        temp_count += 1
                    else:
                        j = k - 1
                        break
                else:
                    j = window_size

                temp += [-min(temp_count,4) for i in range(temp_count)]
            else:
                temp += [0]
            j+=1

        return temp

    def get_g4hunter_data(self, seq, window_size, threshold):

        sequence_hunter = {}
        seq_sqore = self.calculate_g4hunter_score(seq)

        # calculates scores for each possible window 
        # ATGGATGGATGATGAT => 0+0+2+2+0+0+2+2+0+0+1+0+0+1+0+0 = 10 => 10 / 16 = 0.625 
        # also filter the windowed sequences based on threshold score
        for i in range(len(seq)-window_size + 1):
            count = sum(seq_sqore[i:i+window_size])/window_size
            if abs(count) >= threshold:
                sequence_hunter[i] = count
        sequence_hunter[len(seq) + 1] = None # dummy value for next algo to work
                
        start = None
        last = None
        results = []
        # save maximum score sequence from each set of overlapping sequences
        for start_position in sequence_hunter:
            if start is None:
                start = start_position
                last = start_position
            elif start_position - 1 == last:
                last = start_position
            else:
                window = [sequence_hunter[i] for i in range(start, last + 1)]
                max_idxs = np.where(window == np.max(window))[0]
                max_vals = [window[i] for i in max_idxs]
                max_idxs = start + max_idxs
                max_seqs = [seq[i:i+window_size] for i in max_idxs]
                max_lens = [len(i) for i in max_seqs]
                # max_val = max(window)
                # max_idx = start + np.argmax(window)
                # max_seq = seq[max_idx:max_idx+window_size]
                results.append({"sequence": max_seqs,
                                "start": max_idxs,
                                "score": max_vals,
                                "len": max_lens})
                start = start_position
                last = start_position
        
        return results

    def numg_calc(self, seq):
        numg = None
        score = []
        i = 0

        # this loop calcs sequence score non-G: 0, consecutive Gs: cumulative score CAAGGGAGGT -> 0003020
        while i < len(seq):
            if  seq[i] == "G":
                t = 0
                while(seq[t+i]) == "G":
                    t += 1

                    if t+i>=len(seq):
                        break

                score += [t]
                i += t
            else:
                score += [0]
                i += 1
        
        main_score = score

        for i in range(4,0,-1):
            count = 0
            for j in score:
                if j == i:
                    count += 1
            if count >= 4:
                numg = i
                break
            else:
                temp = []
                j = 0
                for j in range(len(main_score)):
                    if main_score[j] >= i and i> 1:
                        temp += [i]*(main_score[j]//(i))

                    else:
                        temp += [main_score[j]]

                count = 0
                for j in temp:
                    if j == i:
                        count += 1
                if count >= 4:
                    numg = i
                    break

                # score = temp
        
        if numg is None:
            return 0, [-1]
        else:
            return numg, [0, 0, 0, 0]



class QGRS():
    def __init__(self):
        pass

    def get_data(self, input, input_type, maxLen, minGLen, loopMin, loopMax):

        if input_type == 'NCBI_ID':
            seq, url = self.get_fasta_and_link(input)
            result =  self.get_QGRS_data(seq, maxLen, minGLen, loopMin, loopMax)
        elif input_type == 'seq':
            result =  self.get_QGRS_data(input, maxLen, minGLen, loopMin, loopMax)
        else:
            print("Wrong input type")

        return result

    def remove(self, string, substrs):
        for s in substrs:
            string = string.replace(s, '')
        return string

    def get_fasta_and_link(self, NCBI_ID):
        
        for i in range(5):
            reqUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=" + \
                NCBI_ID+"&rettype=fasta&retmode=text"
            response = requests.request("GET", reqUrl)
            if len("".join(response.text.split("\n")[1:])) > 0:
                break
            else:
                pass
                # print("Retrying...")

        return "".join(response.text.split("\n")[1:]), reqUrl

    def get_QGRS_data(self, seq, maxLen, minGLen, loopMin, loopMax):

        data = {"sequence": seq}
        options = {
            "Enabled": "true",        # set params
            "QGRSmax": str(maxLen), # default: "45",
            "GGroupmin": str(minGLen), # default: "2",
            "loop_min": str(loopMin), # default: "0",
            "loop_max": str(loopMax), # default: "36"
        }

        inputURL = "https://bioinformatics.ramapo.edu/QGRS/analyze.php"
        r = requests.post(inputURL, data=data, cookies=options, verify=False)

        # parse response from server, get link for "QGRS sequences without overlaps"
        # that contains the table we're interested in
        soup = bs(r.text, 'html.parser')
        # print("".join(soup.findAll('font')[1].strings))  # to confirm search parameters
        link = soup.body.find('img', {"src": "data.gif"}).parent
        baseURL = "https://bioinformatics.ramapo.edu/QGRS/dataview.php/"
        outputURL = baseURL+link['href']

        results = []

        # visit the link and get table
        r = requests.get(outputURL, verify=False)
        soup = bs(r.text, 'html.parser')
        table = soup.find('table')

        # count number of 2G,3G,4G,5G,6G sequences
        table_rows = table.find_all('tr')[1:]
        for tr in table_rows:
            temp = {}
            start = str(tr.find_all('td')[0])
            temp["start"] = int(self.remove(start, ['<td>', '</td>']))

            length = str(tr.find_all('td')[1])
            temp["len"] = int(self.remove(length, ['<td>', '</td>']))

            seq = tr.find_all('td')[2]
            temp["sequence"] = self.remove(str(seq), ['<td>', '</td>', '<u>', '</u>', '<b>', '</b>'])
            temp_seq = t = self.remove(str(seq), ['<td>', '</td>', '</u>', '<b>', '</b>'])
            temp_idx = [i.start() for i in re.finditer('<u>', temp_seq)]
            temp["g_indices"] = [idx - 3*n for n, idx in enumerate(temp_idx)]

            temp["numgs"] = len(seq.find_all('u')[0].text)

            score = str(tr.find_all('td')[3])
            temp["score"] = int(int(self.remove(score, ['<td>', '</td>'])))
            results.append(temp)

        # if gees[5] > 0:
        #     print(f"5g sequence found, please check manually for: {NCBI_ID}")
        #     # raise Exception("5g sequence found")
        #     results["# of 5g"] = gees[5]
        # if gees[6] > 0:
        #     raise Exception("6g sequence found")
        #     results["# of 6g"] = gees[6]

        return results
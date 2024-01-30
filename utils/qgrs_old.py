import re
import requests as req
from bs4 import BeautifulSoup as bs

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
            response = req.request("GET", reqUrl)
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
        r = req.post(inputURL, data=data, cookies=options)

        # parse response from server, get link for "QGRS sequences without overlaps"
        # that contains the table we're interested in
        soup = bs(r.text, 'html.parser')
        # print("".join(soup.findAll('font')[1].strings))  # to confirm search parameters
        link = soup.body.find('img', {"src": "data.gif"}).parent
        baseURL = "https://bioinformatics.ramapo.edu/QGRS/dataview.php/"
        outputURL = baseURL+link['href']

        results = []

        # visit the link and get table
        r = req.get(outputURL)
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


if __name__ == '__main__':
    q = QGRS()
    temp = q.get_data("NR_028119.1", 'NCBI_ID', 45, 2, 0, 36)
    print(temp)
    # write to text file
    with open("qgrs.txt", "w") as f:
        for i in temp:
            f.write(str(i)+"\n")

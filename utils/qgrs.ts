import axios from "axios";
import cheerio from "cheerio";

export class QGRS {
  constructor() {}

  async get_data(
    input: any,
    input_type: any,
    maxLen: any,
    minGLen: any,
    loopMin: any,
    loopMax: any
  ) {
    let result;

    if (input_type === "NCBI_ID") {
      const { seq, url } = await this.get_fasta_and_link(input);
      result = await this.get_QGRS_data(seq, maxLen, minGLen, loopMin, loopMax);
    } else if (input_type === "seq") {
      result = await this.get_QGRS_data(
        input,
        maxLen,
        minGLen,
        loopMin,
        loopMax
      );
    } else {
      console.log("Wrong input type");
    }

    return result;
  }

  remove(str: string, substrs: string[]) {
    for (const s of substrs) {
      str = str.replace(s, "");
    }
    return str;
  }

  async get_fasta_and_link(NCBI_ID: any) {
    let seq, url, arr;
    arr = [];

    for (let i = 0; i < 5; i++) {
      const reqUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${NCBI_ID}&rettype=fasta&retmode=text`;
      const response = await axios.get(reqUrl);

      arr = response.data.split("\n").slice(1);
      if (arr.join("").length > 0) {
        break;
      }
    }

    return { seq: arr.join(""), url };
  }

  async get_QGRS_data(
    seq: any,
    maxLen: any,
    minGLen: any,
    loopMin: any,
    loopMax: any
  ) {
    const data = { sequence: seq };
    const options = {
      Enabled: "true",
      QGRSmax: maxLen.toString(),
      GGroupmin: minGLen.toString(),
      loop_min: loopMin.toString(),
      loop_max: loopMax.toString(),
    };

    const inputURL = "https://bioinformatics.ramapo.edu/QGRS/analyze.php";
    const response = await axios.post(inputURL, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: JSON.stringify(options),
      },
    });

    // const $ = cheerio.load(response.data);
    // const link = $('img[src="data.gif"]').parent();
    // const baseURL = "https://bioinformatics.ramapo.edu/QGRS/dataview.php/";
    // const outputURL = baseURL + link.attr("href");

    const html = response.data;
    // console.log(html.includes('src="data.gif"'));
    const $ = cheerio.load(html);
    const link = $("body").find('img[src="data.gif"]').parent();
    // const soup = new DOMParser().parseFromString(html, "text/html");
    // const link: any = soup.querySelector('img[src="data.gif"]')?.parentNode;
    const baseURL = "https://bioinformatics.ramapo.edu/QGRS/dataview.php/";
    // console.log(link);
    const outputURL = baseURL + link.attr("href");
    // console.log(outputURL);

    // const outputResponse = await axios.get(outputURL);
    // const outputHTML = outputResponse.data;
    // const output$ = cheerio.load(outputHTML);
    // const table = output$("table");

    const table_response = await axios.get(outputURL);
    const table_html = table_response.data;
    const table$ = cheerio.load(table_html);
    // const table_soup = new DOMParser().parseFromString(table_html, "text/html");
    // const table = table_soup.querySelector("table");
    const table = table$("table").eq(0);
    const tableRows = table.find("tr");

    const results: any[] = [];

    for (let i = 1; i < tableRows?.length!; i++) {
      const tr = tableRows.eq(i);
      const temp: {
        start?: number;
        len?: number;
        sequence?: string;
        g_indices?: number[];
        numgs?: number;
        score?: number;
      } = {};
      const start = tr.find("td").eq(0).text();
      temp["start"] = parseInt(this.remove(start, ["<td>", "</td>"]));

      const length = tr.find("td").eq(1).text();
      temp["len"] = parseInt(this.remove(length, ["<td>", "</td>"]));

      const seq = tr.find("td").eq(2);
      temp["sequence"] = this.remove(seq.html()!, [
        "<td>",
        "</td>",
        "<u>",
        "</u>",
        "<b>",
        "</b>",
      ]);
      const tempSeq = this.remove(seq.html()!, [
        "<td>",
        "</td>",
        "</u>",
        "<b>",
        "</b>",
      ]);

      const tempIdx = [...Array.from(tempSeq.matchAll(/<u>/g))].map(
        (m) => m.index
      );
      temp["g_indices"] = tempIdx.map((idx, n) => idx! - 3 * n);

      temp["numgs"] = seq.find("u").eq(0).text().length;

      const score = tr.find("td").eq(3).text();
      temp["score"] = parseInt(this.remove(score, ["<td>", "</td>"]));
      results.push(temp);
    }

    // console.log(results);
    return results;
  }
}

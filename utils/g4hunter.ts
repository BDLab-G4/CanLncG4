import axios from "axios";

class G4 {
  constructor() {}

  async get_data(
    input: string,
    window_size: number,
    threshold: number,
    input_type: string
  ) {
    let result;

    if (input_type === "NCBI_ID") {
      const { seq, url } = await this.get_fasta_and_link(input);
      // console.log("seq: ", seq);
      result = await this.get_g4hunter_data(seq!, window_size, threshold);
    } else if (input_type === "seq") {
      result = await this.get_g4hunter_data(input, window_size, threshold);
    } else {
      console.log("Wrong input type");
      return;
    }

    const new_result: any = result;
    for (const row of new_result) {
      const [numg, _] = this.numg_calc(row.sequence);
      row.numg = numg;
    }

    return new_result;
  }

  async get_fasta_and_link(NCBI_ID: string) {
    let seq, url;

    for (let i = 0; i < 5; i++) {
      const reqUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${NCBI_ID}&rettype=fasta&retmode=text`;
      const response = await axios.get(reqUrl);

      console.log(response.data);
      console.log(response.data.substring(response.data.indexOf("\n") + 1));
      if (response.data.substring(response.data.indexOf("\n") + 1).length > 0) {
        // seq = response.data.substring(response.data.indexOf("\n") + 1);
        seq = "";
        for (let j = 0; j < response.data.split("\n").slice(1).length; j++) {
          seq += response.data.split("\n").slice(1)[j];
        }
        url = reqUrl;
        break;
      }
    }

    return { seq, url };
  }

  calculate_g4hunter_score(seq: string) {
    const window_size = seq.length;
    let count = 0;
    let j = 0;
    const temp = [];

    while (j < window_size) {
      // const e = seq[j];
      let temp_count = 1;

      if (seq[j].toLowerCase().startsWith("g")) {
        let didLoopBreak = false;
        for (let k = j + 1; k < window_size; k++) {
          if (seq[k].toLowerCase().startsWith("g")) {
            temp_count += 1;
          } else {
            j = k - 1;
            didLoopBreak = true;
            break;
          }
        }

        if (!didLoopBreak) {
          j = window_size;
        }

        // j = window_size;

        for (let l = 0; l < temp_count; l++) {
          temp.push(Math.min(temp_count, 4));
        }

        // temp.push(...Array(Math.min(temp_count, 4)).fill(temp_count));
      } else if (seq[j].toLowerCase().startsWith("c")) {
        let didLoopBreak = false;
        for (let m = j + 1; m < window_size; m++) {
          if (seq[m].toLowerCase().startsWith("c")) {
            temp_count += 1;
          } else {
            j = m - 1;
            didLoopBreak = true;
            break;
          }
        }

        if (!didLoopBreak) {
          j = window_size;
        }

        // j = window_size;

        for (let l = 0; l < temp_count; l++) {
          temp.push(-1 * Math.min(temp_count, 4));
        }
      } else {
        temp.push(0);
      }

      j += 1;
    }

    return temp;
  }

  async get_g4hunter_data(seq: string, window_size: number, threshold: number) {
    const sequence_hunter: any = {};
    const seq_score = this.calculate_g4hunter_score(seq);
    // console.log("seq_score (last 4): ", seq_score[seq_score.length - 1]);

    for (let i = 0; i < seq.length - window_size + 1; i++) {
      const to_add = seq_score.slice(i, i + window_size);
      let sum = 0;
      for (let j = 0; j < to_add.length; j++) {
        sum += to_add[j];
      }
      // const count =
      //   seq_score.slice(i, i + window_size).reduce((acc, val) => acc + val, 0) /
      //   window_size;
      const count = sum / window_size;
      if (Math.abs(count) >= threshold) {
        // console.log("condition is true");
        sequence_hunter[i] = count;
      }
    }
    // console.log("sequence_hunter: ", sequence_hunter);
    sequence_hunter[seq.length + 1] = null;

    let start: any = null;
    let last = null;
    const results = [];

    for (const start_position of Object.keys(sequence_hunter)) {
      // console.log(start_position);
      if (start === null) {
        start = parseInt(start_position);
        last = start;
      } else if (parseInt(start_position) - 1 === last) {
        last = parseInt(start_position);
      } else {
        const window = [];
        for (let s = start; s < last + 1; s++) {
          window.push(sequence_hunter[s]);
        }
        const max_val = Math.max(...window);
        const max_idx = start + window.indexOf(max_val);
        const max_seq = seq.slice(max_idx, max_idx + window_size);
        results.push({
          sequence: max_seq,
          start: max_idx,
          score: max_val,
          len: max_seq.length,
        });
        start = parseInt(start_position);
        last = parseInt(start_position);
      }
    }

    return results;
  }

  numg_calc(seq: string) {
    let numg = null;
    let score = [];
    let i = 0;

    while (i < seq.length) {
      if (seq[i] === "G") {
        let t = 0;
        while (seq[t + i] === "G") {
          t += 1;

          if (t + i >= seq.length) {
            break;
          }
        }
        score.push(t);
        i += t;
      } else {
        score.push(0);
        i += 1;
      }
    }

    const main_score = [...score];

    for (let i = 4; i > 0; i--) {
      let count = 0;
      for (const j of score) {
        if (j === i) {
          count += 1;
        }
      }
      if (count >= 4) {
        numg = i;
        break;
      } else {
        const temp = [];
        for (let j = 0; j < main_score.length; j++) {
          if (main_score[j] >= i && i > 1) {
            temp.push(
              ...Array(Math.floor(main_score[j] / (i - 1))).fill(i - 1)
            );
          } else {
            temp.push(main_score[j]);
          }
        }
        score = temp;
      }
    }

    if (numg === null) {
      return [0, [-1]];
    } else {
      return [numg, [0, 0, 0, 0]];
    }
  }
}

export default G4;

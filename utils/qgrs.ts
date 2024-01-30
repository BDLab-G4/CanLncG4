import axios from "axios";
import cheerio from "cheerio";



export class QGRS {
  constructor() { }

  async get_data(
    input: any,
    input_type: any,
    maxLen: any,
    minGLen: any,
    loopMin: any,
    loopMax: any
  ) {

    let result;
    const response = await axios.post("http://13.232.164.101:5000/qgrs/", {
      inputString: input,
      maxLen: maxLen,
      minGLen: minGLen,
      loopMin: loopMin,
      loopMax: loopMax

    });

    

    
    return response.data.result;


  }


}
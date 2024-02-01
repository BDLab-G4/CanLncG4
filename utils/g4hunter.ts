import axios from "axios";

class G4 {
  constructor() {}

  async get_data(
    input: string,
    window_size: number,
    threshold: number,
    input_type: string
  ) {
    
    
    let result = await this.get_g4hunter_data(input, window_size, threshold);

    return result;

  


 
  }

 
  async get_g4hunter_data(seq: string, window_size: number, threshold: number) {

    // send post reqest to http://127.0.0.1:5000/g4/ with inputString, windowSize, threshold
    // return response.data

    // use axios to send post request
    const response = await axios.post("http://13.233.98.66:5001/g4/", {
      inputString: seq,
      windowSize: window_size,
      threshold: threshold,
    });


    console.log(response.data);

    return response.data.result;
  }


}


export default G4;

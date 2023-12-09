import { QGRS } from "@utils/qgrs";

export const POST = async (req: Request) => {
  const data = await req.json();
  const { inputString, maxLen, minGLen, loopMin, loopMax } = data;

  let result: any = [];

  if (inputString.startsWith(">")) {
    let temp = inputString.split("\n");
    let seq = "";

    for (let i = 1; i < temp.length; i++) {
      seq += temp[i];
    }

    const qgrs = new QGRS();
    result = await qgrs.get_data(seq, "seq", maxLen, minGLen, loopMin, loopMax);
  } else if (inputString.startsWith("NR")) {
    const qgrs = new QGRS();
    result = await qgrs.get_data(
      inputString,
      "NCBI_ID",
      maxLen,
      minGLen,
      loopMin,
      loopMax
    );
  } else {
    const qgrs = new QGRS();
    result = await qgrs.get_data(
      inputString,
      "seq",
      maxLen,
      minGLen,
      loopMin,
      loopMax
    );
  }

  const arr = [];

  for (let i = 0; i < result.length; i++) {
    if (result[i].numgs >= 2 && result[i].numgs <= 4) arr.push(result[i]);
  }

  // console.log(result);
  // console.log(arr);5
  for (let i = 0; i < arr.length; i++) {
    let seq: string = arr[i].sequence;
    seq = seq.replace(/<u>/g, "");
    while (seq.includes("</u>")) {
      seq = seq.replace("</u>", "");
    }
    arr[i].sequence = seq;
  }

  return Response.json({ result: arr }, { status: 200 });
};

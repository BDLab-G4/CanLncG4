import G4 from "@utils/g4hunter";

export const POST = async (req: Request) => {
  const data = await req.json();
  const {
    inputString,
    windowSize,
    threshold,
  }: { inputString: string; windowSize: number; threshold: number } = data;

  let result: [];

  try {
    if (inputString.startsWith(">")) {
      const temp = inputString.split("\n");
      let seq = "";
      for (let i = 0; i < temp.length; i++) {
        seq += temp[i];
      }

      const g4 = new G4();
      result = await g4.get_data(seq, windowSize, threshold, "seq");
    } else if (inputString.startsWith("NR")) {
      const ncbi_id = inputString;

      const g4 = new G4();
      result = await g4.get_data(ncbi_id, windowSize, threshold, "NCBI_ID");
      // console.log(result);
    } else {
      const seq = inputString;

      const g4 = new G4();
      result = await g4.get_data(seq, windowSize, threshold, "seq");
    }

    const finalResult = result.filter(
      (r: any) => r.score > 0 && r.numg >= 2 && r.numg <= 4
    );

    console.log(finalResult);

    return Response.json({ result: finalResult }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "An error occurred" }, { status: 500 });
  }
};

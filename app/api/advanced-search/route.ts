import { connect, disconnect } from "@utils/db";

export const GET = async (req: Request, res: Response) => {
  const url = new URL(req.url!);

  let lncrnaName = url.searchParams.get("lncrnaName");
  let cancerName = url.searchParams.get("cancerName");
  let expressionPattern = url.searchParams.get("expressionPattern");
  let transcriptVariants = url.searchParams.get("numOfTranscriptVariants");
  let autoCompleteType = url.searchParams.get("autoCompleteType");

  // if something is null, set it to ""
  if (lncrnaName === null) {
    lncrnaName = "";
    //dee
  }
  if (cancerName === null) {
    cancerName = "";
  }

  if (expressionPattern === null || expressionPattern === "NA") {
    expressionPattern = "";
  }



  if (autoCompleteType === null) {
    autoCompleteType = "all";
  }

  if (transcriptVariants === null) {
    transcriptVariants = "-1";
  }



  if (typeof lncrnaName !== "string" || typeof cancerName !== "string" || typeof expressionPattern !== "string") {
    return Response.json(
      { message: "Invalid query" },
      { status: 400 }
    );
  } else {
    // make them lowercase
    const lncrnaNameSearch = lncrnaName.toLowerCase();
    const cancerNameSearch = cancerName.toLowerCase();
    const expressionPatternSearch = expressionPattern.toLowerCase();
    const transcriptVariantsSearch = transcriptVariants;

    const lncrna_names = [];

    try {
      const con = await connect();


      if (autoCompleteType === "lncrna" || autoCompleteType === "all") {


        let queryString = "SELECT DISTINCT lncrna_name FROM lnc_rna WHERE 1=1";

        // start building the query string for non empty fields
        if (lncrnaNameSearch !== "") {
          queryString += `  AND LOWER(lncrna_name) LIKE '%${lncrnaNameSearch}%' `;
        }

        if (cancerNameSearch !== "") {
          queryString += `  AND LOWER(cancer_name) LIKE '%${cancerNameSearch}%' `;
        }

        if (expressionPatternSearch !== "") {
          queryString += ` AND LOWER(expression_pattern) LIKE '%${expressionPatternSearch}%' `;
        }
        //number of transcript variants is a number, check for equality
        if (!isNaN(parseInt(transcriptVariantsSearch)) && parseInt(transcriptVariantsSearch)>0) {
          queryString += `  AND num_transcript_variants = ${transcriptVariantsSearch} `;
        }


        console.log(queryString);

        // query
        const lncrna_names_result = await con.query(
          queryString, 'lnc_rna');


        for (let i = 0; i < lncrna_names_result.rows.length; i++) {
          lncrna_names.push(lncrna_names_result.rows[i].lncrna_name);

        }

        // sort the lncrna names
        lncrna_names.sort();


      }


      const cancer_names: any = [];

      if (autoCompleteType === "cancer" || autoCompleteType === "all") {

        let queryString = "SELECT DISTINCT cancer_name FROM lnc_rna WHERE 1=1";
        // ADD SOME ALWAYS TRUE CONDITION

        // start building the query string for non empty fields
        if (lncrnaNameSearch !== "") {
          queryString += ` AND LOWER(lncrna_name) LIKE '%${lncrnaNameSearch}%'`;
        }

        if (cancerNameSearch !== "") {
          queryString += ` AND LOWER(cancer_name) LIKE '%${cancerNameSearch}%'`;
        }

        if (expressionPatternSearch !== "") {
          queryString += ` AND LOWER(expression_pattern) LIKE '%${expressionPatternSearch}%'`;
        }

        //number of transcript variants is a number, check for equality
        if (!isNaN(parseInt(transcriptVariantsSearch)) && parseInt(transcriptVariantsSearch)>0) {
          queryString += ` AND num_transcript_variants = ${transcriptVariantsSearch} `;
        }

        cancer_names.sort();

        const cancer_names_result = await con.query(
          queryString, 'lnc_rna');

        for (let i = 0; i < cancer_names_result.rows.length; i++) {
          cancer_names.push(cancer_names_result.rows[i].cancer_name);

        }

        // sort the cancer names


        console.log(queryString);

      }

      const expression_patterns: any = [];

      if (autoCompleteType === "expression_pattern" || autoCompleteType === "all") {



        let queryString = "SELECT DISTINCT expression_pattern FROM lnc_rna WHERE 1=1";

        // start building the query string for non empty fields
        if (lncrnaNameSearch !== "") {
          queryString += ` AND LOWER(lncrna_name) LIKE '%${lncrnaNameSearch}%'`;
        }

        if (cancerNameSearch !== "") {
          queryString += ` AND LOWER(cancer_name) LIKE '%${cancerNameSearch}%'`;
        }

        if (expressionPatternSearch !== "") {
          queryString += ` AND LOWER(expression_pattern) LIKE '%${expressionPatternSearch}%'`;
        }

        //number of transcript variants is a number, check for equality
        if (!isNaN(parseInt(transcriptVariantsSearch)) && parseInt(transcriptVariantsSearch)>0) {
          queryString += ` AND num_transcript_variants = ${transcriptVariantsSearch} `;
        }

        console.log(queryString);
        const expression_patterns_result = await con.query(
          queryString, 'lnc_rna');



        for (let i = 0; i < expression_patterns_result.rows.length; i++) {
          expression_patterns.push(expression_patterns_result.rows[i].expression_pattern);

        }

        // sort the expression patterns
        expression_patterns.sort();




      }

      const transcript_variants: any = [];

      if (autoCompleteType === "transcript_variant" || autoCompleteType === "all") {



        let queryString = "SELECT DISTINCT num_transcript_variants FROM lnc_rna WHERE 1=1";

        // start building the query string for non empty fields
        if (lncrnaNameSearch !== "") {
          queryString += ` AND LOWER(lncrna_name) LIKE '%${lncrnaNameSearch}%'`;
        }

        if (cancerNameSearch !== "") {
          queryString += ` AND LOWER(cancer_name) LIKE '%${cancerNameSearch}%'`;
        }

        if (expressionPatternSearch !== "") {
          queryString += ` AND LOWER(expression_pattern) LIKE '%${expressionPatternSearch}%'`;
        }

        //number of transcript variants is a number, check for equality
        if (!isNaN(parseInt(transcriptVariantsSearch)) && parseInt(transcriptVariantsSearch)>0) {
          queryString += ` AND num_transcript_variants = ${transcriptVariantsSearch} `;
        }

        console.log(queryString);

        const transcript_variants_result = await con.query(
          queryString, 'lnc_rna');




        for (let i = 0; i < transcript_variants_result.rows.length; i++) {

          transcript_variants.push(transcript_variants_result.rows[i].num_transcript_variants);


        }

        // sort the transcript variants
        transcript_variants.sort(function (a:any, b:any) { return a - b });




      }









      await disconnect(con);
      return Response.json(
        { lncrna_names, cancer_names, expression_patterns, transcript_variants },
        { status: 200 }
      );
    } catch (err) {
      console.log(err);
      return Response.json(
        { message: "internal server error" },
        { status: 500 }
      );
    }
  }
};

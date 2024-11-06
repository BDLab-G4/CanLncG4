import { connect, disconnect } from "@utils/db";

export const POST = async (req: Request, res: Response) => {

  // changes


  // get searchQueryArray, tableName from the post body
  const { searchQueryArray, tableName } = await req.json();


  // check for non null values
  if (!searchQueryArray || !tableName) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  try {
    const con = await connect();

    if (tableName === 'rg4_binding_proteins_a') {


      // Create an array to store query parts
      const queryParts: string[] = [];
      // Iterate through searchQueryArray to build the query parts
      for (const query of searchQueryArray) {
        // queryParts.push(`gene_name__rgbp_ LIKE '%${query}%' OR gene_alias LIKE '%${query}%'`);
        queryParts.push(`"gene_name_(rgbp)" LIKE '%${query}%' OR "gene_alias" LIKE '%${query}%'`);
      }
      // Construct the SQL query
      const queryString = `SELECT * FROM ${tableName} WHERE ${queryParts.join(' OR ')}`;
      const result = await con.query(queryString, tableName);





      await disconnect(con);

      return Response.json(result, { status: 200 });


    }

    if (tableName === 'rg4_binding_proteins_b') {


      // Create an array to store query parts
      const queryParts: string[] = [];
      // Iterate through searchQueryArray to build the query parts
      for (const query of searchQueryArray) {
        // queryParts.push(`rna_g4_interacting_protein__rgbp__name LIKE '%${query}%' OR uniprot_entry_name LIKE '%${query}%'`);
        queryParts.push(`"rna_g4_interacting_protein_(rgbp)_name" LIKE '%${query}%' OR "uniprot_entry_name" LIKE '%${query}%'`);

      }

      // Construct the SQL query
      const queryString = `SELECT * FROM ${tableName} WHERE ${queryParts.join(' OR ')}`;



      const result = await con.query(queryString, tableName);


      console.log(result);



      await disconnect(con);

      return Response.json(result, { status: 200 });

    }

    if (tableName === 'rg4_binding_proteins_c') {

      // Create an array to store query parts
      const queryParts: string[] = [];
      // Iterate through searchQueryArray to build the query parts
      for (const query of searchQueryArray) {
        // queryParts.push(`rna_g4_binding_protein__rgbp__name LIKE '%${query}%' OR gene_name__rgbp_ LIKE '%${query}%'`);
        queryParts.push(`"rna_g4_binding_protein_(rgbp)_name" LIKE '%${query}%' OR "gene_name_(rgbp)" LIKE '%${query}%'`);
      }
      // Construct the SQL query
      const queryString = `SELECT * FROM ${tableName} WHERE ${queryParts.join(' OR ')}`;
      const result = await con.query(queryString, tableName);


      await disconnect(con);

      return Response.json(result, { status: 200 });

    }

    return Response.json({ message: "bad request" }, { status: 400 });



  } catch (err) {


    return Response.json({ message: "internal server error" }, { status: 500 });
  }
};

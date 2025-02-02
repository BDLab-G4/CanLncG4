import { connect, disconnect } from "@utils/db";

export const GET = async (req: Request, res: Response) => {
  const url = new URL(req.url!);
  const tableName = url.searchParams.get("tableName");
  const queryString = url.searchParams.get("queryString");

  // check for non null values
  if (!tableName || !queryString) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  try {
    const con = await connect();

    // NPINTER DATA
    if (tableName === "lnc_rna_interaction_partners_a" || tableName === "lnc_rna_interaction_partners_c") {

      const columns = ['interactor_name', 'aliases', 'target_name'];
      const conditions = columns.map(column => `LOWER(${column}) LIKE '%${queryString?.toLowerCase()}%'`).join(' OR ');
      const query = `SELECT * FROM ${tableName} WHERE ${conditions}`;
      const result = await con.query(query, tableName);

      await disconnect(con);
      return Response.json(result, { status: 200 });

    }
    else {

      // LNCTARD DATA
      const columns = ['regulator_name', 'aliases', 'target_name', 'regulator_aliases', 'cancer_name', 'target_aliases'];
      const conditions = columns.map(column => `LOWER(${column}) LIKE '%${queryString?.toLowerCase()}%'`).join(' OR ');
      const query = `SELECT * FROM ${tableName} WHERE ${conditions}`;
      const result = await con.query(query, tableName);

      await disconnect(con);

      return Response.json(result, { status: 200 });


    }


  } catch (err) {


    return Response.json({ message: "internal server error" }, { status: 500 });
  }
};

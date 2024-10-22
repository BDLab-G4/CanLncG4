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

    if (tableName === "lnc_rna_interaction_partners_a" || tableName === "lnc_rna_interaction_partners_c") {

      const result = await con.query(
        `SELECT * FROM ${tableName}  WHERE LOWER(interactor_name) LIKE '%${queryString?.toLowerCase()}%' OR LOWER(aliases) LIKE '%${queryString?.toLowerCase()}%'`
        , tableName);

      await disconnect(con);
      return Response.json(result, { status: 200 });

    }
    else {



      const result = await con.query(
        `SELECT * FROM ${tableName}  WHERE LOWER(regulator_name) LIKE '%${queryString?.toLowerCase()}%' OR LOWER(aliases) LIKE '%${queryString?.toLowerCase()}%'`
        , tableName);

      await disconnect(con);

      return Response.json(result, { status: 200 });


    }


  } catch (err) {


    return Response.json({ message: "internal server error" }, { status: 500 });
  }
};

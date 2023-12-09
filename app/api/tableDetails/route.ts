import { connect, disconnect } from "@utils/db";

export const GET = async (req: Request, res: Response) => {
  const url = new URL(req.url!);
  const type = url.searchParams.get("type");
  const payload = url.searchParams.get("payload");
  const cancer_type = url.searchParams.get("cancer_type");

  try {
    const con = await connect();

    const result = await con.query(`SELECT * FROM lnc_rna`);

    let rows;
    if (cancer_type) {
      rows = result.rows.filter(
        (row) => row.cancer_type === cancer_type.toLowerCase()
      );
    } else if (type === "lncrna_name") {
      rows = result.rows.filter((row) => row.lncrna_name === payload);
    } else if (type === "cancer_name") {
      rows = result.rows.filter(
        (row) => row.cancer_name.toLowerCase() === payload
      );
    } else if (type === "lncrna_alias") {
      rows = result.rows.filter((row) => row.aliases.includes(payload));
      // rows = rows.map(row=>{...row, aliases: row.aliases.join(", ")})
    } else {
      await disconnect(con);
      return Response.json(
        { message: "invalid query params" },
        { status: 400 }
      );
    }

    await disconnect(con);
    return Response.json(rows, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
};

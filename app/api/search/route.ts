import { connect, disconnect } from "@utils/db";

export const GET = async (req: Request, res: Response) => {
  const url = new URL(req.url!);
  const searchString = url.searchParams.get("searchString");

  if (!searchString || typeof searchString !== "string") {
    return Response.json(
      { message: "search term is required and must be a string" },
      { status: 400 }
    );
  } else {
    const searchQuery = searchString?.toLowerCase();
    try {
      const con = await connect();

      const lncrna_names = [];
      const lncrna_names_result = await con.query(
        `SELECT DISTINCT lncrna_name FROM lnc_rna WHERE LOWER(lncrna_name) LIKE '%${searchQuery}%'`
      );
      for (let i = 0; i < lncrna_names_result.rows.length; i++) {
        lncrna_names.push(lncrna_names_result.rows[i].lncrna_name);
      }

      const cancer_names = [];
      const cancer_names_result = await con.query(
        `SELECT DISTINCT cancer_name FROM lnc_rna WHERE LOWER(cancer_name) LIKE '%${searchQuery}%'`
      );
      for (let i = 0; i < cancer_names_result.rows.length; i++) {
        cancer_names.push(cancer_names_result.rows[i].cancer_name);
      }

      const aliases = [];
      const aliases_result = await con.query(
        `SELECT DISTINCT alias FROM (SELECT json_array_elements_text(aliases) AS alias FROM lnc_rna) AS extracted_aliases WHERE LOWER(alias) LIKE '%${searchQuery}%'`
      );
      for (let i = 0; i < aliases_result.rows.length; i++) {
        aliases.push(aliases_result.rows[i].alias);
      }

      await disconnect(con);
      return Response.json(
        { lncrna_names, cancer_names, aliases },
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

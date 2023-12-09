import { connect, disconnect } from "@utils/db";

export const GET = async (req: Request, res: Response) => {
  const url = new URL(req.url!);
  const lncrna = url.searchParams.get("lncrna");
  const cancer = url.searchParams.get("cancer");
  const expressionPattern = url.searchParams.get("expressionPattern");
  const numOfTranscriptVariants = url.searchParams.get(
    "numOfTranscriptVariants"
  );
  const isCoding = url.searchParams.get("isCoding");
  const pqs = url.searchParams.get("pqs");

  try {
    const con = await connect();
    const result = await con.query("SELECT * FROM lnc_rna");
    await disconnect(con);

    let rows = result.rows;

    if (lncrna !== null) {
      rows = rows.filter(
        (row: any) => row.lncrna_name.toLowerCase() === lncrna.toLowerCase()
      );
    }

    if (cancer !== null) {
      rows = rows.filter(
        (row: any) => row.cancer_name.toLowerCase() === cancer.toLowerCase()
      );
    }

    if (expressionPattern !== null) {
      rows = rows.filter(
        (row: any) =>
          row.expression_pattern.toLowerCase() ===
          expressionPattern.toLowerCase()
      );
    }

    if (numOfTranscriptVariants !== null) {
      rows = rows.filter(
        (row: any) =>
          parseInt(row.num_transcript_variants) ===
          parseInt(numOfTranscriptVariants)
      );
    }

    if (isCoding !== null) {
      const coding_con = await connect();
      const coding_result = await con.query(
        "SELECT lncrna_name FROM coding_lnc_rna"
      );
      const coding_rows = coding_result.rows;
      await disconnect(coding_con);

      rows = rows.filter((row: any) => {
        for (let i = 0; i < coding_rows.length; i++) {
          if (coding_rows[i].lncrna_name === row.lncrna_name) {
            return true;
          }
        }

        return false;
      });
    }

    // TODO
    if (pqs !== null) {
      const pqs_data: string[] = JSON.parse(pqs);
      if (pqs_data.includes("2g") && pqs_data.length === 1) {
        // TODO
      } else if (
        pqs_data.includes("2g") &&
        pqs_data.includes("3g") &&
        pqs_data.length === 2
      ) {
        // TODO
      } else if (
        pqs_data.includes("2g") &&
        pqs_data.includes("4g") &&
        pqs_data.length === 2
      ) {
        // TODO
      } else {
        // TODO
      }
    }

    return Response.json(rows, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
};

import { connect, disconnect } from "@utils/db";

export const GET = async (req: Request,res:Response) => {
    try {
        const con = await connect();

        const rows: {
            cancers: any[],
            lncRNAs: any[]
        } = {
            cancers: [],
            lncRNAs: []
        };
        const result = await con.query(`SELECT DISTINCT cancer_name FROM lnc_rna`);
        const lnc_result = await con.query(`SELECT DISTINCT lncrna_name FROM lnc_rna`);

        await disconnect(con);
        
        // console.log(result.rows)
        result.rows.map(row=>rows.cancers.push(row.cancer_name)) 
        lnc_result.rows.map(row=>rows.lncRNAs.push(row.lncrna_name))
        return Response.json(rows, { status: 200 });
    } catch (err) {
        console.log(err);
    return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
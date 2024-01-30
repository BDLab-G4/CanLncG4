// import { Pool } from "pg";
import axios from "axios";




let con = {

  query: async (query: string, table: string) => {


    try {
      const res = await axios.post('http://13.232.164.101:5000/query_' + table + '/', {
        query: query
      })


      if (table.includes("lnc_rna_interaction_partners") || table.includes("rg4_binding_proteins")) {



        return res.data.data

      }

      // check if return data is json. If not, parse it, otherwise return it as is

      let retData = JSON.parse(res.data.data)
      // for (let i = 0; i < retData.length; i++) {
      //   console.log(retData[i])
      // }

      return {
        rows: retData
      }

    }

    catch (err) {
      console.log("Fefe");
    }







  }
}

export const connect = async () => {
  // const con = new Pool({
  //   user: process.env.PGSQL_USER,
  //   password: process.env.PGSQL_PASSWORD,
  //   host: process.env.PGSQL_HOST,
  //   port: parseInt(process.env.PGSQL_PORT!),
  //   database: process.env.PGSQL_DATABASE,
  // });

  return con;
};

export const disconnect = async (con: any) => {
  //await con.end();
};

"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'mantine-react-table';
import { Box, Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useSearchParams } from "next/navigation";

import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { data, type Person } from './makeData';
import { useRouter } from "next/navigation";



const columns: MRT_ColumnDef<Person>[] = [
   {
    accessorKey: 'lncrna_name',
    header: 'LncRNA Name',
    size: 40,
  },
  {
    accessorKey: 'cancer_name',
    header: 'Cancer Name',
    size: 120,
  },
  {
    accessorKey: 'methods',
    header: 'Methods',
    size: 120,
  },
  // {
  //   accessorKey: 'num_transcript_variants',
  //   header: 'Company',
  //   size: 300,
  // },
  {
    accessorKey: 'pubmed_id',
    header: 'Pubmed ID',
  },
  {
    accessorKey: 'expression_pattern',
    header: 'Expression Pattern',
    size: 220,
  },
   {
    accessorKey: 'aliases',
    header: 'LncRNA Aliases',
    size: 220,
  },
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const LncTable = () => {
  
  const [data, setData] = useState([]);
const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type");
  const payload = searchParams.get("payload");

  useEffect(() => {
    // Fetch data using Axios
    axios.get("/api/tableDetails", { params: { type, payload: payload?.trim() } }).then((response) => {
      // const data = response.data;
      // const new_data = data.map(row=>{
      //   lncrna_name: row.lncrna_name,
      //   cancer_name: row.cancer_name,
      //   methods: row.methods,

      // })
      setData(response.data);
    });
  }, []);

    const handleExportRows = (rows: MRT_Row<Person>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
      
        
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export to CSV
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MantineReactTable table={table}/>;
};

export default LncTable;
"use client";



// get router


import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import axios from 'axios';
import {
  Box,
  Card,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";



const TablePage = () => {
  const [isLoading, setIsLoading] = useState(false);


  const router = useRouter();
  const searchParams = useSearchParams();

  let targetName = searchParams.get("targetname");
  let targetAliases = searchParams.get("alias")?.split("|").map(alias => alias.trim());

  // remove NA entries from the array
  targetAliases = targetAliases.filter(alias => alias !== "NA");




  const searchQueryArray:any = [];
  if (targetName) {
    searchQueryArray.push(targetName.trim());
  }
  if (targetAliases) {
    searchQueryArray.push(...targetAliases);
  }


  const Backdrop = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="loader"></div>
      <style jsx global>{`
          .loader {
              border: 6px solid #f3f3f3;
              border-top: 6px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 2s linear infinite;
          }
          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
      `}</style>
    </div>
  );




  useEffect(() => {
    // Function to toggle loading state
    const toggleLoading = (isLoading: any) => setIsLoading(isLoading);

    // Setting up interceptors
    const requestInterceptor = axios.interceptors.request.use(config => {
      toggleLoading(true);
      return config;
    }, error => {
      toggleLoading(false);
      return Promise.reject(error);
    });

    const responseInterceptor = axios.interceptors.response.use(response => {
      toggleLoading(false);
      return response;
    }, error => {
      toggleLoading(false);
      return Promise.reject(error);
    });

    // Cleanup function
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);




  const [tableData1, setTableData1] = useState({ name: 'RG4BP_QUADRatlas', columns: [], data: [] });
  const [tableData2, setTableData2] = useState({ name: 'B. RG4BP_G4IPDB', columns: [], data: [] });
  const [tableData3, setTableData3] = useState({ name: 'RG4BP_Literature mining', columns: [], data: [] });

  let [table1DataFound, setTable1DataFound] = useState(true);
  let [table2DataFound, setTable2DataFound] = useState(true);
  let [table3DataFound, setTable3DataFound] = useState(true);

  const formatColumnName = (columnName:any) => {
    let colName =  columnName
      .split('_')
      .map( (word:any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

      return colName.toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      const tableNames = ['rg4_binding_proteins_a', 'rg4_binding_proteins_b', 'rg4_binding_proteins_c'];
      const setDataFunctions = [setTableData1, setTableData2, setTableData3];
      for (let i = 0; i < tableNames.length; i++) {
        try {
          const response = await axios.post('/api/g4Interaction-search/', { searchQueryArray, tableName: tableNames[i] });
          setDataFunctions[i](response.data);

          if (response.data.data.length === 0) {
            if (i === 0) {
              setTable1DataFound(false);
            } else if (i === 1) {
              setTable2DataFound(false);
            } else if (i === 2) {
              setTable3DataFound(false);
            }
          }
        } catch (error) {
          console.error(`Error fetching data from:`, error);
        }
      }
    };

    fetchData();
  }, []); // Add dependencies if needed

  const renderTable = ({ name, columns, data }:any) => {
    if (columns.length === 0 || data.length === 0) {
      return null;
    }

    const isLinkColumn = (columnName:any) => columnName.toLowerCase().includes('link');

    const renderCellContent = (cell:any, isLink:any) => {
      if (cell && isLink && cell.trim() !== '') {
        return cell.split('\n').map((link:any, index:any) => {
          if (link.trim() === '') {
            return <div key={index}>-</div>; // Render a placeholder for empty links
          }
          return (
            <div key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>{link}</a>
            </div>
          );
        });
      }
      return cell;
    };

    return (
      <>
        <Text fontSize="xl" p={4}>{name}</Text>
        <Box overflowX="auto">
          <table style={{ minWidth: '600px', background: 'white', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columns.map((column:any) => (
                  <th key={column} style={{ padding: '8px', background: '#f2f2f2', textAlign: 'center' }}> {/* Center-align header cells */}
                    {formatColumnName(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row:any, rowIndex:any) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                  {row.map((cell:any, cellIndex:any) => (
                    <td key={cellIndex} style={{ padding: '8px', textAlign: 'center' }}> {/* Center-align data cells */}
                      <div style={{ overflowY: 'auto', maxHeight: '100px', maxWidth: '500px' }}>
                        {renderCellContent(cell, isLinkColumn(columns[cellIndex]))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </>
    );

  };



  // show loading if data is not fetched yet, and if fetched but no data found, show message that no matching data found

  return (
    <div>
      {isLoading && <Backdrop />}
      <Card overflowX="auto" sx={{ mt: 5, mx: 7 }}>
        {renderTable(tableData1)}
        {renderTable(tableData2)}
        {renderTable(tableData3)}



        {!table1DataFound && !table2DataFound && !table3DataFound && (
          <Text fontSize="xl" p={4}>No matching data found</Text>
        )}


      </Card>

    </div>
  );
};

export default TablePage;

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
import React, { useEffect, useState } from "react";

//cc

const TablePage = () => {
  const [isLoading, setIsLoading] = useState(false);


  const router = useRouter();
  const searchParams = useSearchParams();

  let targetName = searchParams.get("targetname");
  let targetAliases = searchParams.get("alias")?.split("|").map(alias => alias.trim());

  // remove NA entries from the array




  const searchQueryArray:any = [];
  if (targetName) {
    searchQueryArray.push(targetName.trim());
  }
  if (targetAliases) {
    targetAliases = targetAliases.filter(alias => alias !== "NA");
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

  const renderTable = ({ name, columns, data }) => {
    const [isCollapsed, setIsCollapsed] = useState(false); // State to manage collapse

    // Find indexes of special columns
    const knownG4BinderIndex = columns.findIndex((column) => column === 'known_g4_binder?');
    const targetNameIndex = columns.findIndex((column) => column === 'target_name');
    const targetAliasIndex = columns.findIndex((column) => column === 'target_aliases');
  
    const toggleCollapse = () => setIsCollapsed(!isCollapsed); // Function to toggle collapse

    return (
      columns.length > 0 && data.length > 0 && (
        <>
          <Text fontSize="xl" p={4} style={{cursor: 'pointer'}} onClick={toggleCollapse}>
            {name} {isCollapsed ? '+' : '-'}
          </Text>
          <Box overflowX="auto">
            {!isCollapsed && ( // Render table only if not collapsed
              <table style={{ minWidth: '600px', background: 'white', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column} style={{ padding: '8px', background: '#f2f2f2' }}>
                        {formatColumnName(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} style={{ padding: '8px', textAlign: 'left' }}>
                          <div style={{ overflowY: 'auto', maxHeight: '100px', maxWidth:'500px' }}>
                            {cellIndex === knownG4BinderIndex ? (
                              <a target="_blank" href={`/g4-interaction-details?targetname=${encodeURIComponent(row[targetNameIndex])}${targetAliasIndex !== -1 ? `&alias=${encodeURIComponent(row[targetAliasIndex])}` : ''}`} style={{ color: 'blue' }}>
                                <button style={{ backgroundColor: '#2196F3', color: 'white', padding: '8px', border: 'none', cursor: 'pointer' }}>
                                  View Details
                                </button>
                              </a>
                            ) : cell.includes('|') ? (
                              cell.split('|').map((part, index) => (
                                <React.Fragment key={index}>
                                  {index > 0 && <br />}
                                  {part}
                                </React.Fragment>
                              ))
                            ) : (
                              cell
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Box>
        </>
      )
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

"use client";
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  NumberInput,
  NumberInputField,
  Stack,
  Textarea,
  Text,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Divider,
  Td,
  Link,
  Collapse, // Import Collapse component
} from "@chakra-ui/react";

const TablePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [btnBackground, setBtnBackground] = useState("blue.500");
  const [inputString, setInputString] = useState<null | string>(null);
  const [isFirstRequestMade, setIsFirstRequestMade] = useState(false);
  const [tableData1, setTableData1] = useState({ name: 'LncRNA Interaction Partners A', columns: [], data: [] });
  const [tableData2, setTableData2] = useState({ name: 'LncRNA Interaction Partners B', columns: [], data: [] });
  const [tableData3, setTableData3] = useState({ name: 'LncRNA Interaction Partners C', columns: [], data: [] });
  const [tableData4, setTableData4] = useState({ name: 'LncRNA Interaction Partners D', columns: [], data: [] });

  // State for table visibility
  const [isTable1Open, setIsTable1Open] = useState(true);
  const [isTable2Open, setIsTable2Open] = useState(true);
  const [isTable3Open, setIsTable3Open] = useState(true);
  const [isTable4Open, setIsTable4Open] = useState(true);

  const formatColumnName = (columnName: any) => {
    let val = columnName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    // return fully uppercase column names
    return val.toUpperCase();
  };

  const fetchAndSetData = async (tableName: any, setData: any) => {
    try {
      const response = await axios.get(`/api/g4Interaction?queryString=${inputString}&tableName=${tableName}`);
      setIsFirstRequestMade(true);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching data from:`, error);
    }
  };

  const handleButtonClick = () => {
    const tableNames = ['lnc_rna_interaction_partners_a', 'lnc_rna_interaction_partners_b', 'lnc_rna_interaction_partners_c', 'lnc_rna_interaction_partners_d'];
    const tableDisplayNames = ['LncRNA Interaction Partners A', 'LncRNA Interaction Partners B', 'LncRNA Interaction Partners C', 'LncRNA Interaction Partners D'];
    const setDataFunctions = [setTableData1, setTableData2, setTableData3, setTableData4];
    tableNames.forEach((tableName, index) => fetchAndSetData(tableName, setDataFunctions[index]));
  };

  const renderTable = ({ name, columns, data }) => {
    // Find indexes of special columns
    const knownG4BinderIndex = columns.findIndex((column) => column === 'known_g4_binder?');
    const targetNameIndex = columns.findIndex((column) => column === 'target_name');
    const targetAliasIndex = columns.findIndex((column) => column === 'target_aliases');

    return (
      columns.length > 0 && data.length > 0 && (
        <>
          {/* Add Collapse component and onClick handler */}
          <Collapse in={name === 'LncRNA Interaction Partners A' ? isTable1Open : 
                       name === 'LncRNA Interaction Partners B' ? isTable2Open : 
                       name === 'LncRNA Interaction Partners C' ? isTable3Open : isTable4Open}>
            <Text 
              fontSize="xl" 
              p={4} 
              onClick={() => {
                if (name === 'LncRNA Interaction Partners A') setIsTable1Open(!isTable1Open);
                else if (name === 'LncRNA Interaction Partners B') setIsTable2Open(!isTable2Open);
                else if (name === 'LncRNA Interaction Partners C') setIsTable3Open(!isTable3Open);
                else setIsTable4Open(!isTable4Open);
              }}
            >
              {name}
            </Text>
            <Box overflowX="auto">
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
                          <div style={{ overflowY: 'auto', maxHeight: '100px', maxWidth: '500px' }}>
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
            </Box>
          </Collapse>
        </>
      )
    );
  };

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25, ml: 2, mb: 0 }}>
          LncRNA - G4 Interacting Partner
        </CardHeader>
      </Card>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardBody>
          <Stack direction="row" spacing={20}>
            <Textarea
              resize="none"
              width="40%"
              height="100px"
              placeholder="Enter LncRNA"
              value={inputString === null ? "" : inputString}
              onChange={(e) => setInputString(e.target.value)}
              sx={{ ml: 50, mt: 2 }}
            />
            <Button
              variant="solid"
              bg={btnBackground}
              sx={{
                height: 100,
                width: 120,
                color: "#ffffff",
                _hover: {},
                _active: {},
                ml: 20,
                mt: 2,
              }}
              onMouseEnter={() => setBtnBackground("blue.700")}
              onMouseLeave={() => setBtnBackground("blue.500")}
              isDisabled={false}
              onClick={async () => { await handleButtonClick(); }}
            >
              Search
            </Button>
          </Stack>
        </CardBody>
      </Card>
      {/* Wrap all tables in a Box with horizontal scrolling */}
      <Box overflowX="auto" sx={{ mt: 5, mx: 7 }}>
        {renderTable(tableData1)}
        {renderTable(tableData2)}
        {renderTable(tableData3)}
        {renderTable(tableData4)}
        {/*if no results, display "No results found"*/}
        { isFirstRequestMade && tableData1.data.length === 0 && tableData2.data.length === 0 && tableData3.data.length === 0 && tableData4.data.length === 0 && (
          <Text fontSize="xl" p={4}>No results found</Text>
        )}
      </Box>
    </>
  );
};

export default TablePage;
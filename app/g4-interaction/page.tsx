"use client";
import React, { useState, useRef, useEffect } from 'react';
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
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Collapse,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";




const TablePage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [btnBackground, setBtnBackground] = useState("blue.500");
  const [inputString, setInputString] = useState<null | string>(null);

  const [isFirstRequestMade, setIsFirstRequestMade] = useState(false);

  const [table1Collapsed, setTable1Collapsed] = useState(true);
  const [table2Collapsed, setTable2Collapsed] = useState(true);
  const [table3Collapsed, setTable3Collapsed] = useState(true);
  const [table4Collapsed, setTable4Collapsed] = useState(true);



  const [tableData1, setTableData1] = useState({ name: 'LncRNA-protein interactions - NPInter', columns: [], data: [] });
  const [tableData2, setTableData2] = useState({ name: 'LncRNA-Protein Interactions - LncTarD', columns: [], data: [] });
  const [tableData3, setTableData3] = useState({ name: 'LncRNA-RNA Interactions - NPInter', columns: [], data: [] });
  const [tableData4, setTableData4] = useState({ name: 'LncRNA-RNA Interactions LncTarD', columns: [], data: [] });


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



  const columnsWithDropdown = ['npinter_interaction_id', 'interactor_name', 'interactor_type', 'interactor_id', 'target_name', 'target_id', 'interaction_mechanism', 'interaction_level', 'interaction_class', 'experimental_method_for_interaction_identification', 'tissue/cell', 'data_source', 'regulation_id', 'regulator_name', 'regulator_type', 'regulator_ensemble_id', 'target_name', 'target_type', "target_ensemble_id", 'regulatory_mechanism', 'level_of_regulator', 'cancer_name', 'influenced_function', 'regulator_expression_pattern', 'experimental_method_for_lncrna_expresssion', 'experimental_method_for_lncrna_target_identification', 'cancer_stem_cell',];





  // Function to filter data based on selected filters
  const filterData = (columns, data, filters) => {

    // console.log(filters);


    const filteredData = data.filter((row) => {
      let shouldInclude = true;

      columns.forEach((column, index) => {
        if (filters[column]) {
          if (!filters[column][row[index]]) {
            shouldInclude = false;
          }
        }
      });

      return shouldInclude;
    });

    return filteredData;
  };






  const handleMouseMove = (event) => {
    const tableElement = event.currentTarget; // Get the table element directly
    const tableWidth = tableElement.offsetWidth;
    const mouseX = event.clientX - tableElement.getBoundingClientRect().left;

    if (mouseX < 100) {
      // Mouse is near the left edge, scroll left
      tableElement.scrollLeft -= 50;
      tableElement.style.cursor = 'w-resize'; // Change cursor to left scroll arrow
    } else if (mouseX > tableWidth - 100) {
      tableElement.style.cursor = 'e-resize'; // Change cursor to right scroll arrow
      // Mouse is near the right edge, scroll right
      tableElement.scrollLeft += 50;
    }
    else {
      tableElement.style.cursor = 'default'; // Reset cursor to default
    }
  };



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



  const [filters1, setFilters1] = useState({});
  const [filters2, setFilters2] = useState({});
  const [filters3, setFilters3] = useState({});
  const [filters4, setFilters4] = useState({});


  const updateFiltersForTable = (tableData, setFiltersFunction) => {
    const { columns, data } = tableData;
    const filterStructure = {};

    columns.forEach((column, index) => {
      const uniqueValues = {}
      data.forEach((row) => {
        const value = row[index];
        uniqueValues[value] = true
      });
      filterStructure[column] = uniqueValues
    });

    setFiltersFunction(filterStructure);
  };




  useEffect(() => {
    updateFiltersForTable(tableData1, setFilters1);
    console.log(filters1)
  }, [tableData1]);

  useEffect(() => {
    updateFiltersForTable(tableData2, setFilters2);
  }, [tableData2]);


  useEffect(() => {
    updateFiltersForTable(tableData3, setFilters3);
  }, [tableData3]);


  useEffect(() => {
    updateFiltersForTable(tableData4, setFilters4);
  }, [tableData4]);






  const handleButtonClick = () => {
    const tableNames = ['lnc_rna_interaction_partners_a', 'lnc_rna_interaction_partners_b', 'lnc_rna_interaction_partners_c', 'lnc_rna_interaction_partners_d'];
    //const tableDisplayNames = ['LncRNA Interaction Partners A', 'LncRNA Interaction Partners B', 'LncRNA Interaction Partners C', 'LncRNA Interaction Partners D'];
    const setDataFunctions = [setTableData1, setTableData2, setTableData3, setTableData4];

    tableNames.forEach((tableName, index) => fetchAndSetData(tableName, setDataFunctions[index]));
  };


  interface TableProps {
    name: string;
    columns: string[];
    data: any[][];
  }


  const renderTable = ({ name, columns, data }: TableProps, filters: any, setFiltersCurrent: (filters: any) => void) => {
    // Find indexes of special columns
    const knownG4BinderIndex = columns.findIndex((column) => column === 'known_g4_binder?');
    const targetNameIndex = columns.findIndex((column) => column === 'target_name');
    const targetAliasIndex = columns.findIndex((column) => column === 'target_aliases');

    let isCollapsed = false;
    if (name === 'LncRNA-protein interactions - NPInter') {
      isCollapsed = table1Collapsed;
    } else if (name === 'LncRNA-Protein Interactions - LncTarD') {
      isCollapsed = table2Collapsed;
    } else if (name === 'LncRNA-RNA Interactions - NPInter') {
      isCollapsed = table3Collapsed;
    } else if (name === 'LncRNA-RNA Interactions LncTarD') {
      isCollapsed = table4Collapsed;
    }

    const arrowIcon = isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />;
    //

    return (
      columns.length > 0 && data.length > 0 && (
        <>
          <Text fontSize="2xl" fontWeight="bold" p={4}  _hover={{ cursor: "pointer" }} onClick={() => {
            if (name === 'LncRNA-protein interactions - NPInter') setTable1Collapsed(!table1Collapsed);
            else if (name === 'LncRNA-Protein Interactions - LncTarD') setTable2Collapsed(!table2Collapsed);
            else if (name === 'LncRNA-RNA Interactions - NPInter') setTable3Collapsed(!table3Collapsed);
            else if (name === 'LncRNA-RNA Interactions LncTarD') setTable4Collapsed(!table4Collapsed);
          }}>
            {name} <Icon ml={2}>{arrowIcon}</Icon>
          </Text>

          {/* Use Collapse component for animation */}
          <Collapse in={!isCollapsed} animateOpacity>
            <Box overflowX="auto" sx={{ mt: 5, mx: 7 }} onMouseMove={handleMouseMove}>
              <table style={{ minWidth: '600px', background: 'white', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {columns.map((column, columnIndex) => (
                      <th key={column} style={{ padding: '8px', background: '#f2f2f2' }}>
                        {columnsWithDropdown.includes(column) ? (
                          <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}

                              bg={filters[column] == null || Object.values(filters[column]).every(value => value) ? 'white' : 'lightcoral'}>
                              {formatColumnName(column)}
                            </MenuButton>
                            <MenuList>
                              {/* Efficiently render unique values from filters */}
                              {filters[column] && (Object.keys(filters[column]).map((uniqueValue) => (
                                <MenuItem key={uniqueValue}>
                                  <Checkbox
                                    isChecked={filters[column][uniqueValue]}
                                    onChange={(e) => {
                                      // Create a shallow copy of the filters object
                                      const filtersCopy = { ...filters };

                                      // Change the value for the specific column and uniqueValue to what's intended, e.g., toggle the boolean
                                      filtersCopy[column][uniqueValue] = !filtersCopy[column][uniqueValue];

                                      // Set the updated copy as the new state
                                      setFiltersCurrent(filtersCopy);
                                    }}
                                  >
                                    {uniqueValue}
                                  </Checkbox>
                                </MenuItem>
                              )))}
                            </MenuList>
                          </Menu>
                        ) : (
                          <Menu>
                            <MenuButton as={Button}
                              bg={'white'}>
                              {formatColumnName(column)}
                            </MenuButton>
                          </Menu>


                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filterData(columns, data, filters).map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} style={{ padding: '8px', textAlign: 'left' }}>
                          <div style={{ overflowY: 'auto', maxHeight: '100px', maxWidth: '500px' }}>
                            {cellIndex === knownG4BinderIndex ? (
                              <a
                                target="_blank"
                                href={`/g4-interaction-details?targetname=${encodeURIComponent(
                                  row[targetNameIndex]
                                )}${targetAliasIndex !== -1 ? `&alias=${encodeURIComponent(row[targetAliasIndex])}` : ''}`}
                                style={{ color: 'blue' }}
                              >
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
          <style jsx>{`
        .chakra-collapse {
          transition: all 0.5s ease-in-out;
        }
      `}</style>

        </>
      )
    );
  };



  return (

    <div>
      {isLoading && <Backdrop />}

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
          {renderTable(tableData1, filters1, setFilters1)}
          {renderTable(tableData2, filters2, setFilters2)}
          {renderTable(tableData3, filters3, setFilters3)}
          {renderTable(tableData4, filters4, setFilters4)}
          {/*if no results, display "No results found"*/}
          {isFirstRequestMade && tableData1.data.length === 0 && tableData2.data.length === 0 && tableData3.data.length === 0 && tableData4.data.length === 0 && (
            <Text fontSize="xl" p={4}>No results found</Text>
          )}
        </Box>
      </>
    </div>
  );
};

export default TablePage;


"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Menu,
  MenuButton,
  Box,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLinkIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const LncTable = () => {
  const Backdrop = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const formatColumnName = (column) => {

    let name = column.split('_').map((word) => word.toUpperCase()).join(' ');

    if (name == "LNCRNA NAME") {
      name = "LncRNA NAME";
    }
    else if (name == "G4 PREDICTION") {
      name = "G4-PREDICTION";
    }
    else if (name == "SUB CELLULAR LOCALIZATION") {
      name = "SUBCELLULAR LOCALIZATION";
    }


    return name;

  }

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

  const cancer_type = searchParams.get("cancer_type");
  const type = searchParams.get("type");
  const payload = searchParams.get("payload");
  const filterCancer = searchParams.get("filter_cancer");
  const filterExpression = searchParams.get("filter_expression");
  const filterTranscript = searchParams.get("filter_transcript");

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering logic starts here
  const [filters, setFilters] = useState({});

  const filterColumns = {
    LNCRNA_NAME: false,
    cancer_type: true,
    expression_pattern: true,
    //num_transcript_variants:true,
    METHODS: false,
    PUBMED_ID: false,
    G4_PREDICTION: false,
    SUB_CELLULAR_LOCALIZATION: false,
    ALIASES: false
  }

  const filterData = (data, filters) => {
    const filteredData = data.filter((row) => {
      let shouldInclude = true;
      Object.keys(filters).forEach((column) => {
        if (filters[column] && !filters[column][row[column]]) {
          shouldInclude = false;
        }
      });
      return shouldInclude;
    });
    return filteredData;
  };

  const updateFilters = () => {
    const filterStructure = {};
    if (data) {
      data.forEach((row) => {
        Object.keys(row).forEach((column) => {
          if (!filterStructure[column]) {
            filterStructure[column] = {};
          }
          filterStructure[column][row[column]] = true;
        });
      });
    }
    setFilters(filterStructure);
  };

  useEffect(() => {
    updateFilters();
  }, [data]);
  // Filtering logic ends here

  useEffect(() => {
    // Function to toggle loading state
    const toggleLoading = (isLoading) => setIsLoading(isLoading);

    // Setting up interceptors
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        toggleLoading(true);
        return config;
      },
      (error) => {
        toggleLoading(false);
        return Promise.reject(error);
      }
    );
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        toggleLoading(false);
        return response;
      },
      (error) => {
        toggleLoading(false);
        return Promise.reject(error);
      }
    );

    // Cleanup function
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    axios
      .get("/api/tableDetails", {
        params: cancer_type
          ? { cancer_type }
          : { type, payload: payload?.trim() },
      })
      .then((res) => {
        // filter the data
        if (filterCancer) {
          res.data = res.data.filter(
            (row) => row.cancer_name === filterCancer
          );
        }
        if (filterExpression) {
          res.data = res.data.filter(
            (row) => row.expression_pattern === filterExpression
          );
        }
        if (filterTranscript) {
          res.data = res.data.filter(
            (row) => row.num_transcript_variants === filterTranscript
          );
        }
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred");
      });
  }, []);

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  const downloadCSV = () => {
    const filteredData = filterData(data, filters);
    const csvData = convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {isLoading && <Backdrop />}
      <>
       
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardHeader sx={{ fontSize: 25, mt: 0, ml: 2, mb: 0, textAlign: "center" }}>
            Search Results
          </CardHeader>
          <CardBody>
            {!data ? (
              <>Loading...</>
            ) : (
              <Box overflowX="auto" sx={{ mt: 0, mx: 0 }} onMouseMove={handleMouseMove}>


                {filterData(data, filters).length > 0 && (
                  <Box textAlign="center" mt={0} mb={5}>
                    <Button onClick={downloadCSV} colorScheme="blue">
                      Download CSV
                    </Button>
                  </Box>
                )}

                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {Object.keys(filterColumns).map((column) => (
                        <Th key={column} style={{ padding: '8px', background: '#f2f2f2', textAlign: 'center' }}>
                          {filters[column] ? (
                            <Menu>
                              <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon />}
                                bg={
                                  filters[column] == null ||
                                    Object.values(filters[column]).every((value) => value)
                                    ? "white"
                                    : "lightcoral"
                                }
                                sx={{
                                  wordBreak: 'break-all', // Break words if necessary
                                  fontSize: '12px',
                                }}
                              >
                                {formatColumnName(column)}
                              </MenuButton>
                              <MenuList>
                                {filters[column] &&
                                  Object.keys(filters[column]).map((uniqueValue) => (
                                    <MenuItem key={uniqueValue}>
                                      <Checkbox
                                        isChecked={filters[column][uniqueValue]}
                                        onChange={(e) => {
                                          const filtersCopy = { ...filters };
                                          filtersCopy[column][uniqueValue] =
                                            !filtersCopy[column][uniqueValue];
                                          setFilters(filtersCopy);
                                        }}
                                      >
                                        {uniqueValue}
                                      </Checkbox>
                                    </MenuItem>
                                  ))}
                              </MenuList>
                            </Menu>
                          ) : (
                            <Menu>
                              <MenuButton
                                as={Button}
                                sx={{
                                  wordBreak: 'break-all', // Break words if necessary
                                  fontSize: '12px',
                                }}
                                bg={
                                  filters[column] == null ||
                                    Object.values(filters[column]).every((value) => value)
                                    ? "white"
                                    : "lightcoral"
                                }
                              >
                                {formatColumnName(column)}
                              </MenuButton>
                            </Menu>
                          )}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filterData(data, filters).map((row) => {
                      let aliases = row.aliases.split("; ").join(", ");
                      // Remove the last comma if present
                      if (aliases.endsWith(", ")) {
                        aliases = aliases.slice(0, -2);
                      }
                      return (
                        <Tr key={row.lncrna_name + row.cancer_name + row.pubmed_id}>
                          <Td sx={{ textAlign: 'center' }}>{row.lncrna_name}</Td>
                          <Td sx={{ textAlign: 'center' }}>{row.cancer_name}</Td>
                          <Td sx={{ textAlign: 'center' }}>{row.expression_pattern}</Td>
                          <Td sx={{ textAlign: 'center' }}>{row.methods}</Td>
                          <Td sx={{ textAlign: 'center' }}>
                            <Link
                              href={`https://pubmed.ncbi.nlm.nih.gov/${row.pubmed_id}/`}
                              target="_blank"
                              isExternal
                            >
                              {row.pubmed_id} <ExternalLinkIcon sx={{ ml: 2 }} />
                            </Link>
                          </Td>
                          <Td sx={{ textAlign: 'center' }}>
                            <Button
                              bg="blue.500"
                              sx={{
                                width: "100px",
                                mx: 3,
                                _hover: {},
                                _active: {},
                                color: "#ffffff",
                              }}
                              onClick={() =>
                                router.push(
                                  `/g4prediction?lncrna_name=${encodeURIComponent(
                                    row.lncrna_name
                                  )}`
                                )
                              }
                            >
                              Details
                            </Button>
                          </Td>
                          <Td sx={{ textAlign: 'center' }}>
                            <Button
                              bg="blue.500"
                              sx={{
                                width: "100px",
                                mx: 3,
                                _hover: {},
                                _active: {},
                                color: "#ffffff",
                              }}
                              onClick={() =>
                                router.push(
                                  `/sub-cellular-graphs?lncrna_name=${encodeURIComponent(
                                    row.lncrna_name
                                  )}`
                                )
                              }
                            >
                              Details
                            </Button>
                          </Td>
                          <Td sx={{ textAlign: 'center' }}>{aliases}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>

              </Box>
            )}
          </CardBody>
        </Card>
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardBody sx={{ textAlign: "center" }}>
            Data curated from Lnc2Cancer 3.0 (
            <Link
              href="https://bio-bigdata.hrbmu.edu.cn/lnc2cancer"
              target="_blank"
              isExternal
            >
              https://bio-bigdata.hrbmu.edu.cn/lnc2cancer
              <ExternalLinkIcon sx={{ ml: 2 }} />
            </Link>
            ) and GeneCards (
            <Link href="https://www.genecards.org/" target="_blank" isExternal>
              https://www.genecards.org/
              <ExternalLinkIcon sx={{ ml: 2 }} />
            </Link>
            )
          </CardBody>
        </Card>
      </>
    </div>
  );
};

export default LncTable;

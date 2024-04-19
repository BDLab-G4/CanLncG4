"use client";
import { useState, useEffect } from "react";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { ExternalLinkIcon, ChevronDownIcon } from "@chakra-ui/icons";

const G4Hunter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [btnBackground, setBtnBackground] = useState("blue.500");
  const [inputString, setInputString] = useState<null | string>(null);
  const [windowSize, setWindowSize] = useState<null | number>(45);
  const [thresholdString, setThresholdString] = useState("2");
  const [threshold, setThreshold] = useState(2);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [rows, setRows] = useState<any>(null);

  // Backdrop Component
  // Backdrop Component with Circular Loading Animation
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

  useEffect(() => {
    // Function to toggle loading state
    const toggleLoading = (isLoading: any) => setIsLoading(isLoading);

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
    if (
      inputString !== null &&
      windowSize !== null &&
      windowSize >= 10 &&
      windowSize <= 100 &&
      threshold >= 0.1 &&
      threshold <= 4
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }

    if (thresholdString !== null && !isNaN(parseFloat(thresholdString))) {
      setThreshold(parseFloat(thresholdString));
    }
  }, [inputString, windowSize, threshold, thresholdString]);

  const handleAnalyzeClick = async () => {
    setFetched(false);
    setLoading(true);
    await axios
      .post("/api/g4hunter", { inputString, windowSize, threshold })
      .then((res) => {
        setSummary({
          total: 0,
          two: 0,
          three: 0,
          four: 0,
        });
        const data = res.data.result;
        console.log(data);
        setRows((_prev: any) => {
          return [
            ...data.map((ele: any, idx: number) => {
              if (ele.numg === 2) {
                setSummary((prev: any) => ({
                  ...prev,
                  total: prev.total + 1,
                  two: prev.two + 1,
                }));
              } else if (ele.numg === 3) {
                setSummary((prev: any) => ({
                  ...prev,
                  total: prev.total + 1,
                  three: prev.three + 1,
                }));
              } else if (ele.numg === 4) {
                setSummary((prev: any) => ({
                  ...prev,
                  total: prev.total + 1,
                  four: prev.four + 1,
                }));
              }
              let x = "",
                broke = false;
              for (let i = 0; i < ele.sequence.length; i++) {
                if (
                  ele.sequence[i] === "G" &&
                  (ele.sequence[i - 1] === "G" ||
                    ele.sequence[i + 1] === "G")
                ) {
                  x += "g";
                } else {
                  x += ele["sequence"][i];
                }
                if (i == 50) {
                  // x += "  "
                }
              }
              return {
                ...ele,
                id: idx + 1,
                sequence: x,
                score: Math.round(ele.score * 100) / 100,
                numg: ele.numg + "G",
              };
            }),
          ];
        });
        setLoading(false);
        setFetched(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // Filtering logic starts here
  const [filters, setFilters] = useState({});

  const formatColumnName = (column) => {
    if (column == "numgs") {
      return "TYPE OF G-QUADRAPLEX";
    }
    let name = column.split("_").map((word) => word.toUpperCase()).join(" ");
    return name;
  };

  const filterColumns = {
    Position: true,
    len: true,
    numgs: true,
    "G-Score": true,
    sequence: false, // You might not need filtering for Sequence
  };

  const filterData = (data, filters) => {
    const filteredData = data.filter((row) => {
      let shouldInclude = true;
      Object.keys(filters).forEach((column) => {
        if (
          filters[column] &&
          !filters[column][row[column]] // Assuming your data structure
        ) {
          shouldInclude = false;
        }
      });
      return shouldInclude;
    });
    return filteredData;
  };

  const updateFilters = () => {
    const filterStructure = {};
    if (rows) {
      rows.forEach((row) => {
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
  }, [rows]);

  // Filtering logic ends here

  return (
    <div>
      {isLoading && <Backdrop />}
      <>
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardHeader sx={{ fontSize: 25, ml: 2, mb: 0 }}>
            G4Hunter Tool
          </CardHeader>

        </Card>
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardBody>
            <Stack direction="row" spacing={20}>
              <Textarea
                resize="none"
                width="40%"
                height="100px"
                placeholder="Sequence / Fasta / NCBI ID"
                value={inputString === null ? "" : inputString}
                onChange={(e) => setInputString(e.target.value)}
                sx={{ ml: 50, mt: 2 }}
              />
              <Box>
                <Stack direction="row">
                  <Text sx={{ mt: 2, mr: 2, fontSize: 18 }}>Window size:</Text>
                  <Button
                    disabled={windowSize === null || windowSize < 10}
                    onClick={() => setWindowSize((size) => size! - 1)}
                    bg="blue.500"
                    sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                  >
                    -
                  </Button>
                  <NumberInput
                    name="windowSize"
                    sx={{ width: "100px" }}
                    value={windowSize !== null ? windowSize : undefined}
                    onChange={(value) =>
                      setWindowSize(
                        !isNaN(parseInt(value)) ? parseInt(value) : null
                      )
                    }
                  >
                    <NumberInputField
                      min={10}
                      max={100}
                      sx={{ textAlign: "center", pl: 5 }}
                    />
                  </NumberInput>
                  <Button
                    disabled={windowSize === null || windowSize > 100}
                    onClick={() => setWindowSize((size) => size! + 1)}
                    bg="blue.500"
                    sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                  >
                    +
                  </Button>
                </Stack>
                {windowSize !== null && (windowSize < 10 || windowSize > 100) ? (
                  <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                    Please enter a window size between 10 and 100
                  </Text>
                ) : null}
                <Stack direction="row" sx={{ mt: 2 }}>
                  <Text sx={{ mt: 4, mr: 2, fontSize: 18 }}>Threshold:</Text>
                  <Stack direction="column" sx={{ mt: 2 }}>
                    <NumberInput
                      name="threshold"
                      sx={{ width: "150px" }}
                      value={thresholdString}
                      onChange={(value) => setThresholdString(value)}
                      precision={1}
                    >
                      <NumberInputField
                        min={10}
                        max={100}
                        sx={{ textAlign: "center" }}
                      />
                    </NumberInput>
                    <Slider
                      value={threshold}
                      defaultValue={2}
                      onChange={(value) => {
                        setThreshold(value);
                        setThresholdString(value.toString());
                      }}
                      sx={{ width: "150px" }}
                      min={0.1}
                      max={4}
                      step={0.1}
                      onMouseEnter={() => setIsTooltipOpen(true)}
                      onMouseLeave={() => setIsTooltipOpen(false)}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        placement="top"
                        isOpen={isTooltipOpen}
                        label={`${threshold}`}
                      >
                        <SliderThumb />
                      </Tooltip>
                    </Slider>
                  </Stack>
                </Stack>
                {isNaN(parseFloat(thresholdString)) ||
                  parseFloat(thresholdString) < 0.1 ||
                  parseFloat(thresholdString) > 4 ? (
                  <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                    Please enter a threshold between 0.1 and 4.0
                  </Text>
                ) : null}
              </Box>
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
                isDisabled={btnDisabled}
                onClick={async () => await handleAnalyzeClick()}
              >
                Analyze
              </Button>
            </Stack>
          </CardBody>
        </Card>
        {!loading && fetched ? (
          <Card sx={{ mt: 5, mx: 7, mb: 5 }}>
            <CardHeader sx={{ fontSize: 25 }}>Results</CardHeader>
            {rows.length > 0 ? (
              <CardBody>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th sx={{ textAlign: "center" }}>
                          Total no. of PQS
                        </Th>
                        <Th sx={{ textAlign: "center" }}>No. of 2G PQS</Th>
                        <Th sx={{ textAlign: "center" }}>No. of 3G PQS</Th>
                        <Th sx={{ textAlign: "center" }}>No. of 4G PQS</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td sx={{ textAlign: "center" }}>{summary.total / 2}</Td>
                        <Td sx={{ textAlign: "center" }}>{summary.two / 2}</Td>
                        <Td sx={{ textAlign: "center" }}>{summary.three / 2}</Td>
                        <Td sx={{ textAlign: "center" }}>{summary.four / 2}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer sx={{ mt: 10 }}>
                  <Table>
                    <Thead>
                      <Tr>
                        {Object.keys(filterColumns).map((column) => (
                          <Th
                            key={column}
                            style={{
                              padding: "8px",
                              background: "#f2f2f2",
                              textAlign: "center",
                            }}
                          >
                            {filters[column] ? (
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  rightIcon={<ChevronDownIcon />}
                                  bg={
                                    filters[column] == null ||
                                      Object.values(filters[column]).every(
                                        (value) => value
                                      )
                                      ? "white"
                                      : "lightcoral"
                                  }
                                  sx={{
                                    wordBreak: "break-all", // Break words if necessary
                                    fontSize: "12px",
                                  }}
                                >
                                  {formatColumnName(column)}
                                </MenuButton>
                                <MenuList>
                                  {filters[column] &&
                                    Object.keys(filters[column]).map(
                                      (uniqueValue) => (
                                        <MenuItem key={uniqueValue}>
                                          <Checkbox
                                            isChecked={
                                              filters[column][uniqueValue]
                                            }
                                            onChange={(e) => {
                                              const filtersCopy = { ...filters };
                                              filtersCopy[column][
                                                uniqueValue
                                              ] = !filtersCopy[column][
                                              uniqueValue
                                              ];
                                              setFilters(filtersCopy);
                                            }}
                                          >
                                            {uniqueValue + "G"}
                                          </Checkbox>
                                        </MenuItem>
                                      )
                                    )}
                                </MenuList>
                              </Menu>
                            ) : (
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  sx={{
                                    wordBreak: "break-all", // Break words if necessary
                                    fontSize: "12px",
                                  }}
                                  bg={
                                    filters[column] == null ||
                                      Object.values(filters[column]).every(
                                        (value) => value
                                      )
                                      ? "white"
                                      : "lightcoral"
                                  }
                                >
                                  {column}
                                </MenuButton>
                              </Menu>
                            )}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filterData(rows, filters).map(
                        (
                          row: {
                            len: number;
                            numg: number;
                            score: number;
                            sequence: string;
                            start: number;
                          }
                        ) => {
                          console.log(row);
                          return (
                            <Tr>
                              <Td sx={{ textAlign: "center" }}>
                                {row.start}
                              </Td>
                              <Td sx={{ textAlign: "center" }}>
                                {row.len}
                              </Td>
                              <Td sx={{ textAlign: "center" }}>
                                {row.numg}
                              </Td>
                              <Td sx={{ textAlign: "center" }}>
                                {row.score.toPrecision(3)}
                              </Td>
                              <Td sx={{ textAlign: 'center' }}> <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Added this Box */} <Stack direction="row" spacing={0.5}> {row.sequence.split("").map((char) => char === char.toLowerCase() ? (<Text sx={{ color: "#0000ff", fontWeight: "100px", }} > {char.toUpperCase()} </Text>) : (<Text>{char}</Text>))} </Stack> </Box> {/* Added this Box */} </Td>
                            </Tr>
                          );
                        }
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            ) : (
              <CardBody>No rows</CardBody>
            )}
          </Card>
        ) : null}
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardBody sx={{ textAlign: "center" }}>
            Data curated from G4Hunter (
            <Link
              href="https://bioinformatics.ibp.cz/#/analyse/quadruplex"
              target="_blank"
              isExternal
            >
              https://bioinformatics.ibp.cz/#/analyse/quadruplex
              <ExternalLinkIcon sx={{ ml: 2 }} />
            </Link>
            )
          </CardBody>
        </Card>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </>
    </div>
  );
};

export default G4Hunter;
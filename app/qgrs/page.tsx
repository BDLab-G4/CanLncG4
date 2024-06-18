"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Textarea,
  Button,
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  Tooltip,
  RangeSliderThumb,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Select,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ExternalLinkIcon, ChevronDownIcon } from "@chakra-ui/icons";

const QGRS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputString, setInputString] = useState<string | null>(null);
  const [maxLen, setMaxLen] = useState<number | null>(45);
  const [minGLen, setMinGLen] = useState<number>(2);
  const [loopMin, setLoopMin] = useState(0);
  const [loopMax, setLoopMax] = useState(36);
  const [loopMinString, setLoopMinString] = useState("0");
  const [loopMaxString, setLoopMaxString] = useState("36");
  const [btnBackground, setBtnBackground] = useState("blue.500");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    two: 0,
    three: 0,
    four: 0,
  });
  const [rows, setRows] = useState<any>(null);

  const formatColumnName = (column) => {
    if (column == "numgs") {
      return "TYPE OF G-QUADRAPLEX";
    }
    let name = column.split("_").map((word) => word.toUpperCase()).join(" ");
    return name;
  };

  const [filters, setFilters] = useState({});
  const filterColumns = {
    POSITION: true,
    LENGTH: true,
    numgs: true,
    "G-SCORE": true,
    SEQUENCE: false,
  };

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
    if (rows) {
      rows.forEach((row) => {
        Object.keys(row).forEach((column) => {
          if (filterColumns[column]) {
            if (!filterStructure[column]) {
              filterStructure[column] = {};
            }
            filterStructure[column][row[column]] = true;
          }
        });
      });
    }
    setFilters(filterStructure);
  };

  useEffect(() => {
    updateFilters();
  }, [rows]);

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
    const toggleLoading = (isLoading) => setIsLoading(isLoading);
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
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (
      inputString !== null &&
      inputString !== "" &&
      maxLen !== null &&
      maxLen >= 10 &&
      maxLen <= 45 &&
      loopMin < loopMax &&
      loopMin >= 0 &&
      loopMin <= 36 &&
      loopMax >= 0 &&
      loopMax <= 36
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [inputString, maxLen, loopMin, loopMax]);

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setFetched(false);
    setSummary({
      total: 0,
      two: 0,
      three: 0,
      four: 0,
    });
    setRows([]);
    await axios
      .post("/api/qgrs", {
        inputString,
        maxLen,
        minGLen,
        loopMin,
        loopMax,
      })
      .then((res) => {
        const data = res.data.result;
        const updatedRows = data.map((ele: any, idx: number) => {
          if (ele.numgs === 2) {
            setSummary((prev) => ({
              ...prev,
              total: prev.total + 1,
              two: prev.two + 1,
            }));
          } else if (ele.numgs === 3) {
            setSummary((prev) => ({
              ...prev,
              total: prev.total + 1,
              three: prev.three + 1,
            }));
          } else if (ele.numgs === 4) {
            setSummary((prev) => ({
              ...prev,
              total: prev.total + 1,
              four: prev.four + 1,
            }));
          }
          let x = "";
          let constant = 0;
          for (let i = 0; i < ele.sequence.length; i++) {
            if (
              ele.g_indices.includes(i - constant) &&
              ele.sequence[i] == "G"
            ) {
              x += "g";
              constant += 1;
              if (constant === ele.numgs) {
                constant = 0;
              }
            } else {
              x += ele["sequence"][i];
              constant = 0;
            }
          }
          return {
            ...ele,
            id: idx + 1,
            sequence: x,
            numgs: ele.numgs + "G",
          };
        });
        setRows(updatedRows);
        setFetched(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setFetched(false);
      });
  };

  const downloadCSV = () => {
    if (!rows || rows.length === 0) return;

    const headers = ["Position", "Length", "Type of G-Quadraplex", "G-Score", "Sequence"];
    const csvData = rows.map((row) =>
      `${row.start},${row.len},${row.numgs},${row.score},${row.sequence.toUpperCase()}`
    );

    const csvContent = [
      headers.join(","),
      ...csvData
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `qgrs_${inputString}_${maxLen}_${minGLen}_${loopMin}_${loopMax}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {isLoading && <Backdrop />}
      <>
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardHeader sx={{ fontSize: 25, ml: 2, mb: 0 }}>QGRS Mapper</CardHeader>
        </Card>
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardBody>
            <Stack direction="row" spacing={10}>
              <Textarea
                resize="none"
                width="40%"
                height="150px"
                placeholder="Sequence / Fasta / NCBI ID"
                value={inputString === null ? "" : inputString}
                onChange={(e) => setInputString(e.target.value)}
                sx={{ ml: 50, mt: 2 }}
              />
              <Box>
                <Stack direction="row">
                  <Text sx={{ mt: 2, mr: 2, fontSize: 18 }}>Max Length:</Text>
                  <Button
                    disabled={maxLen === null || maxLen < 10}
                    onClick={() => setMaxLen((len) => len! - 1)}
                    bg="blue.500"
                    sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                  >
                    -
                  </Button>
                  <NumberInput
                    name="maxLen"
                    sx={{ width: "80px" }}
                    value={maxLen !== null ? maxLen : undefined}
                    onChange={(value) =>
                      setMaxLen(!isNaN(parseInt(value)) ? parseInt(value) : null)
                    }
                  >
                    <NumberInputField
                      min={10}
                      max={45}
                      sx={{ textAlign: "center", pl: 5 }}
                    />
                  </NumberInput>
                  <Button
                    disabled={maxLen === null || maxLen > 45}
                    onClick={() => setMaxLen((len) => len! + 1)}
                    bg="blue.500"
                    sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                  >
                    +
                  </Button>
                </Stack>
                {maxLen !== null && (maxLen < 10 || maxLen > 45) ? (
                  <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                    Please enter a max length between 10 and 45
                  </Text>
                ) : null}
                <Stack direction="row" sx={{ mt: 2 }}>
                  <Text sx={{ mt: 2, mr: 2, fontSize: 18 }}>Min G-group:</Text>
                  <Select
                    value={minGLen.toString()}
                    onChange={(e) => setMinGLen(parseInt(e.target.value))}
                    width="100px"
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </Select>
                </Stack>
                <Stack direction="row" sx={{ mt: 2 }}>
                  <Text sx={{ mt: 4, mr: 2, fontSize: 18 }}>Loop size:</Text>
                  <Stack direction="column" sx={{ mt: 2 }}>
                    <Stack direction="row">
                      <NumberInput
                        name="loopMin"
                        sx={{ width: "70px" }}
                        value={loopMinString}
                        onChange={(value) => setLoopMinString(value)}
                      >
                        <NumberInputField
                          min={0}
                          max={36}
                          sx={{ textAlign: "center" }}
                        />
                      </NumberInput>
                      <Text sx={{ mt: 2 }}>to</Text>
                      <NumberInput
                        name="loopMax"
                        sx={{ width: "70px" }}
                        value={loopMaxString}
                        onChange={(value) => setLoopMaxString(value)}
                      >
                        <NumberInputField
                          min={0}
                          max={36}
                          sx={{ textAlign: "center" }}
                        />
                      </NumberInput>
                    </Stack>
                    <RangeSlider
                      value={[loopMin, loopMax]}
                      defaultValue={[0, 36]}
                      onChange={(value) => {
                        setLoopMin(value[0]);
                        setLoopMax(value[1]);
                        setLoopMinString(value[0].toString());
                        setLoopMaxString(value[1].toString());
                      }}
                      sx={{ width: "200px" }}
                      min={0}
                      max={36}
                      step={1}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </Stack>
                </Stack>
                {isNaN(parseInt(loopMinString)) ||
                  isNaN(parseInt(loopMaxString)) ||
                  parseInt(loopMinString) > parseInt(loopMaxString) ? (
                  <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                    Please enter a valid loop size.
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
                  ml: 50,
                  mt: 7,
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
          <Card sx={{ mt: 5, mx: 7 }}>
            <CardHeader sx={{ fontSize: 25 }}>Results</CardHeader>
            {rows.length > 0 ? (
              <CardBody>
                <Button
                  colorScheme="blue"
                  onClick={downloadCSV}
                  sx={{ mb: 4 }}
                >
                  Download CSV
                </Button>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th sx={{ textAlign: "center" }}>Total no. of PQS</Th>
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
                                    wordBreak: 'break-all',
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
                                    wordBreak: 'break-all',
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
                      {filterData(rows, filters).map(
                        (row: {
                          start: number;
                          len: number;
                          sequence: string;
                          g_indices: number[];
                          numgs: string;
                          score: number;
                        }) => {
                          return (
                            <Tr key={row.start}>
                              <Td sx={{ textAlign: 'center' }}>{row.start}</Td>
                              <Td sx={{ textAlign: 'center' }}>{row.len}</Td>
                              <Td sx={{ textAlign: 'center' }}>{row.numgs}</Td>
                              <Td sx={{ textAlign: 'center' }}>{row.score}</Td>
                              <Td sx={{ textAlign: 'center' }}> <Box sx={{ display: 'flex', justifyContent: 'center' }}> <Stack direction="row" spacing={0.5}> {row.sequence.split("").map((char, i) => char === char.toLowerCase() ? (<Text key={i} sx={{ color: "#0000ff", fontWeight: "100px", }} > {char.toUpperCase()} </Text>) : (<Text key={i}>{char}</Text>))} </Stack> </Box> </Td>
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
            Data curated from QGRS Mapper (
            <Link
              href="https://bioinformatics.ramapo.edu/QGRS/index.php"
              target="_blank"
              isExternal
            >
              https://bioinformatics.ramapo.edu/QGRS/index.php
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
      </>
    </div>
  );
};

export default QGRS;

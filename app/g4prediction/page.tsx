"use client";


import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Link,
  CheckboxGroup,
  Checkbox,
  Button,
  IconButton,
  Stack,
  Box,
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Text,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLinkIcon, ChevronDownIcon } from "@chakra-ui/icons";

const G4Prediction = () => {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const lncrnaName = searchParams.get("lncrna_name");
  const [totalTranscriptVariants, setTotalTranscriptVariants] = useState(0);
  const [tableData, setTableData] = useState<any>(null);
  const [firstSearch, setFirstSearch] = useState<string | null>(null);
  const [secondSearch, setSecondSearch] = useState<string | null>(null);
  const [firstSearchResult, setFirstSearchResult] = useState<{
    type: string;
    result: any[];
  } | null>(null);
  const [secondSearchResult, setSecondSearchResult] = useState<{
    type: string;

    result: any[];
  } | null>(null);
  const [firstSearchResultSummary, setFirstSearchResultSummary] = useState<{
    total: number;
    two: number;
    three: number;
    four: number;
  }>({
    total: 0,
    two: 0,
    three: 0,
    four: 0,
  });
  const [secondSearchResultSummary, setSecondSearchResultSummary] = useState<{
    total: number;
    two: number;
    three: number;
    four: number;
  }>({
    total: 0,
    two: 0,
    three: 0,
    four: 0,
  });
  const [G4Options, setG4Options] = useState<{
    windowSize: number | "";
    threshold: number;
    thresholdString: string;
  }>({
    windowSize: 45,
    threshold: 0.9,
    thresholdString: "0.9",
  });
  const [QGRSOptions, setQGRSOptions] = useState<{
    maxLen: number | "";
    minGLen: number;
    loopMin: number;
    loopMax: number;
    loopMinString: string;
    loopMaxString: string;
  }>({
    maxLen: 45,
    minGLen: 2,
    loopMin: 0,
    loopMax: 36,
    loopMinString: "0",
    loopMaxString: "36",
  });

  // Filtering logic starts here
  const [filters1, setFilters1] = useState({});
  const [filters2, setFilters2] = useState({});
  const filterColumns = {
    Position: false,
    Length: false,
    numgs: true,
    "G-Score": false,
    Sequence: false,
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

  const formatCheckBoxVals = (val) => {

    // check if val contains "g" or "G"
    if (val.includes("g") || val.includes("G")) {
      return val
    }
    else {
      return val + "G"
    }


  }

  const updateFilters = () => {

    let filterStructure = {};
    if (firstSearchResult) {
      firstSearchResult.result.forEach((row) => {
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
    setFilters1(filterStructure);
    filterStructure = {};
    if (secondSearchResult) {
      secondSearchResult.result.forEach((row) => {
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
    setFilters2(filterStructure);

  };


  const calculateSummaryQGRS = (data: any[]) => {
    let summary = {
      total: 0,
      two: 0,
      three: 0,
      four: 0,
    };

    let rows = data.map((ele: any, idx: number) => {
      if (ele.numgs === 2) {
        summary.total += 1;
        summary.two += 1;
      } else if (ele.numgs === 3) {
        summary.total += 1;
        summary.three += 1;
      } else if (ele.numgs === 4) {
        summary.total += 1;
        summary.four += 1;
      }
      let x = "";
      let constant = 0;
      for (let i = 0; i < ele.sequence.length; i++) {
        if (
          ele.g_indices.includes(i - constant) &&
          ele.sequence[i] === "G"
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

    return { summary, rows };
  };


  const calculateSummaryG4 = (data: any[]) => {

    
    let summary = {
      total: 0,
      two: 0,
      three: 0,
      four: 0,
    };

    let rows = data.map((ele: any, idx: number) => {
      if (ele.numg === 2) {
        
        summary.total += 1;
        summary.two += 1;
      } else if (ele.numg === 3) {
        summary.total += 1;
        summary.three += 1;
      } else if (ele.numg === 4) {
        summary.total += 1;
        summary.four += 1;
      }
      let x = "";
      for (let i = 0; i < ele.sequence.length; i++) {
        if (
          ele.sequence[i] === "G" &&
          (ele.sequence[i - 1] === "G" || ele.sequence[i + 1] === "G")
        ) {
          x += "g";
        } else {
          x += ele["sequence"][i];
        }
      }
      return {
        ...ele,
        id: idx + 1,
        sequence: x.toUpperCase(),
        score: Math.round(ele.score * 100) / 100,
        numg: ele.numg + "G",
      };
    });

    return { summary, rows };
  };

  useEffect(() => {
    updateFilters();
  }, [firstSearchResult, secondSearchResult]);

  // Filtering logic ends here

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

  const formatColumnName = (column) => {
    if (column == "numgs") {
      return "TYPE OF G-QUADRAPLEX";
    }
    let name = column.split("_").map((word) => word.toUpperCase()).join(" ");

    if (name =="LNCRNA NAME"){
      name = "LncRNA Name";
    }
    
    return name;
  };

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
      .get(`/api/g4prediction`, { params: { lncrnaName } })
      .then((res) => {
        setTableData(res.data);
        let total_variants = 0;
        res.data.map((row: {
          lncrna_name: string;
          num_transcript_variants: number;
          ncbi_access_num: string;
        }) =>
        (total_variants =
          row.num_transcript_variants > total_variants
            ? row.num_transcript_variants
            : total_variants)
        );
        setTotalTranscriptVariants(total_variants);
      })
      .catch((err) => {
        console.log(err);
        setTableData([]);
      });
  }, []);

  useEffect(() => {
    // if (firstSearch === null && secondSearch !== null) {
    //   setFirstSearch(secondSearch);
    //   setFirstSearchResult(secondSearchResult)
    //   setSecondSearch(null);
    //   setSecondSearchResult(null);
    // }

    if (!firstSearch && firstSearchResult !== null) {
      setFirstSearchResult(null);
    }

    if (!secondSearch && secondSearchResult !== null) {
      setSecondSearchResult(null);
    }

    if (firstSearch && firstSearchResult === null) {
      // call api
    }

    if (secondSearch && secondSearchResult === null) {
      // call api
    }
  }, [firstSearch, secondSearch, firstSearchResult, secondSearchResult]);

  console.log(firstSearch, secondSearch);

  const handleMouseMove = (event) => {
    const tableElement = event.currentTarget; // Get the table element directly
    const tableWidth = tableElement.offsetWidth;
    const mouseX = event.clientX - tableElement.getBoundingClientRect().left;
    if (mouseX < 100) {
      // Mouse is near the left edge, scroll left
      tableElement.scrollLeft -= 50;
      tableElement.style.cursor = "w-resize"; // Change cursor to left scroll arrow
    } else if (mouseX > tableWidth - 100) {
      tableElement.style.cursor = "e-resize"; // Change cursor to right scroll arrow
      // Mouse is near the right edge, scroll right
      tableElement.scrollLeft += 50;
    } else {
      tableElement.style.cursor = "default"; // Reset cursor to default
    }
  };


  const downloadTopResults = (data: any[], type: string) => {
    const csv = data.map((row) =>
      Object.values(row)
        .map((value) => (value === null ? "" : value))
        .join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${lncrnaName}_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const downloadG4OrQGRSMainData = (data: any[], type: string) => {


    if (!data || data.length === 0) return;

    const headers = ["Position", "Length", "Type of G-Quadraplex", "G-Score", "Sequence"];
    const csvData = data.map((row) =>
      `${row.start},${row.len},${row.numgs},${row.score},${row.sequence.toUpperCase()}`
    );

    const csvContent = [
      headers.join(","),
      ...csvData
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${lncrnaName}_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {isLoading && <Backdrop />}
      <>
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardHeader sx={{ fontSize: 25, mt: 2, ml: 2, mb: 0 }}>
            {lncrnaName}
          </CardHeader>
          <CardBody>
            Total no. of transcript variants (lncRNAs):{" "}
            {totalTranscriptVariants}
          </CardBody>
        </Card>

        {tableData !== null && tableData.length > 0 ? (
          <Card sx={{ mt: 5, mx: 7 }}>
            <CardBody>
              <Button
                variant="solid"
                bg="blue.500"
                sx={{
                  color: "#ffffff",
                  _hover: {},
                  _active: {},
                  mt: 2,
                  ml: 2,
                  width: "200px",
                }}
                onClick={() =>
                  downloadTopResults(
                    tableData,
                    "g4_prediction_search_results"
                  )
                }
              >
                Download CSV
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th><Th sx={{ textAlign: "center", textTransform: "none" }}>LncRNA NAME</Th></Th>
                      <Th sx={{ textAlign: "center" }}>Transcript variants</Th>
                      <Th sx={{ textAlign: "center" }}>NCBI Accession ID</Th>
                      <Th sx={{ textAlign: "center" }}>QGRS Mapper</Th>
                      <Th sx={{ textAlign: "center" }}>G4 Hunter</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tableData.map(
                      (row: {
                        lncrna_name: string;
                        num_transcript_variants: number;
                        ncbi_access_num: string;
                      }) => {
                        return (
                          <Tr>
                            <Td sx={{ textAlign: "center" }}>{row.lncrna_name}</Td>
                            <Td sx={{ textAlign: "center" }}>
                              {row.num_transcript_variants}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              <Link
                                href={`https://www.ncbi.nlm.nih.gov/nuccore/${row.ncbi_access_num}`}
                                target="_blank"
                                isExternal
                              >
                                {row.ncbi_access_num}
                                <ExternalLinkIcon sx={{ ml: 2 }} />
                              </Link>
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearch !== `qgrs_${row.ncbi_access_num}` &&
                                secondSearch !== `qgrs_${row.ncbi_access_num}` ? (
                                <Button
                                  bg="blue.500"
                                  id={`qgrs_${row.ncbi_access_num}`}
                                  sx={{
                                    _hover: {},
                                    _active: {},
                                    color: "#ffffff",
                                    width: "100px",
                                  }}
                                  onClick={async (_e) => {
                                    if (firstSearch === null) {
                                      setFirstSearch(
                                        `qgrs_${row.ncbi_access_num}`
                                      );
                                      await axios
                                        .post("/api/qgrs", {
                                          inputString: row.ncbi_access_num,
                                          maxLen: QGRSOptions.maxLen,
                                          minGLen: QGRSOptions.minGLen,
                                          loopMin: QGRSOptions.loopMin,
                                          loopMax: QGRSOptions.loopMax,
                                        })
                                        .then((res) => {
                                          const data = res.data.result;

                                          const { summary, rows } = calculateSummaryQGRS(res.data.result);
                                          setFirstSearchResultSummary(summary);
                                          setFirstSearchResult({ "type": "qgrs", "result": rows });


                                        });
                                    } else {
                                      setSecondSearch(
                                        `qgrs_${row.ncbi_access_num}`
                                      );
                                      await axios
                                        .post("/api/qgrs", {
                                          inputString: row.ncbi_access_num,
                                          maxLen: QGRSOptions.maxLen,
                                          minGLen: QGRSOptions.minGLen,
                                          loopMin: QGRSOptions.loopMin,
                                          loopMax: QGRSOptions.loopMax,
                                        })
                                        .then((res) => {
                                          const data = res.data.result;

                                          const { summary, rows } = calculateSummaryQGRS(res.data.result);
                                          setSecondSearchResultSummary(summary);
                                          setSecondSearchResult({ "type": "qgrs", "result": rows });
                                        });
                                    }
                                  }}
                                >
                                  View
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  colorScheme="red"
                                  sx={{ width: "100px" }}
                                  onClick={(_e) =>
                                    firstSearch ===
                                      `qgrs_${row.ncbi_access_num}`
                                      ? setFirstSearch(null)
                                      : setSecondSearch(null)
                                  }
                                >
                                  Clear
                                </Button>
                              )}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearch !== `g4_${row.ncbi_access_num}` &&
                                secondSearch !== `g4_${row.ncbi_access_num}` ? (
                                <Button
                                  bg="blue.500"
                                  id={`g4_${row.ncbi_access_num}`}
                                  sx={{
                                    _hover: {},
                                    _active: {},
                                    color: "#ffffff",
                                    width: "100px",
                                  }}
                                  isDisabled={
                                    firstSearch ===
                                    `g4_${row.ncbi_access_num}` ||
                                    secondSearch ===
                                    `g4_${row.ncbi_access_num}`
                                  }
                                  onClick={async (_e) => {
                                    if (firstSearch === null) {
                                      setFirstSearch(
                                        `g4_${row.ncbi_access_num}`
                                      );
                                      await axios
                                        .post("/api/g4hunter", {
                                          inputString: row.ncbi_access_num,
                                          windowSize: G4Options.windowSize,
                                          threshold: G4Options.threshold,
                                        })
                                        .then((res) => {
                                          

                                          const data = res.data.result;

                                          const { summary, rows } = calculateSummaryG4(res.data.result);
                                          setFirstSearchResultSummary(summary);
                                          setFirstSearchResult({ "type": "g4", "result": rows });
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        });
                                    } else {
                                      setSecondSearch(
                                        `g4_${row.ncbi_access_num}`
                                      );
                                      await axios
                                        .post("/api/g4hunter", {
                                          inputString: row.ncbi_access_num,
                                          windowSize: G4Options.windowSize,
                                          threshold: G4Options.threshold,
                                        })
                                        .then((res) => {
                                        

                                          const data = res.data.result;

                                          const { summary, rows } = calculateSummaryG4(res.data.result);
                                          setSecondSearchResultSummary(summary);
                                          setSecondSearchResult({ "type": "g4", "result": rows });
                                        })
                                        .catch((err) => {
                                          console.log(err);
                                        });
                                    }
                                  }}
                                >
                                  View
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  colorScheme="red"
                                  sx={{ width: "100px" }}
                                  onClick={(_e) =>
                                    firstSearch ===
                                      `g4_${row.ncbi_access_num}`
                                      ? setFirstSearch(null)
                                      : setSecondSearch(null)
                                  }
                                >
                                  Clear
                                </Button>
                              )}
                            </Td>
                          </Tr>
                        );
                      }
                    )}
                  </Tbody>
                </Table>
              </TableContainer>


              <CardBody sx={{ textAlign: "center" }}>
                Data curated from NCBI Nucleotide (
                <Link
                  href="https://www.ncbi.nlm.nih.gov/nucleotide"
                  target="_blank"
                  isExternal
                >
                  https://www.ncbi.nlm.nih.gov/nucleotide
                  <ExternalLinkIcon sx={{ ml: 2 }} />
                </Link>



                )




              </CardBody>


            </CardBody>
          </Card>
        ) : null}

        {firstSearchResult !== null && secondSearchResult === null ? (
          <Card sx={{ mt: 5, mx: 7, mb: 5 }}>
            <CardBody>

              {firstSearchResult.type === "qgrs" ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Stack
                      direction="column"
                      sx={{ alignItems: "center", width: "100%" }}
                    >
                      <Text sx={{ mr: 2, fontSize: 18 }}>Max length</Text>

                      <Stack direction="row">
                        <Button
                          disabled={
                            QGRSOptions.maxLen === "" || QGRSOptions.maxLen <= 10
                          }
                          onClick={() =>
                            setQGRSOptions((prevOptions) => {
                              if (prevOptions.maxLen !== "") {
                                return {
                                  ...prevOptions,
                                  maxLen: prevOptions.maxLen - 1,
                                };
                              } else {
                                return {
                                  ...prevOptions,
                                  maxLen: prevOptions.maxLen,
                                };
                              }
                            })
                          }
                          bg="blue.500"
                          sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                        >
                          -
                        </Button>

                        <NumberInput
                          name="maxLen"
                          sx={{ width: "80px" }}
                          value={
                            QGRSOptions.maxLen !== null
                              ? QGRSOptions.maxLen
                              : undefined
                          }
                          onChange={(value) =>
                            setQGRSOptions((prevOptions) => ({
                              ...prevOptions,
                              maxLen: !isNaN(parseInt(value))
                                ? parseInt(value)
                                : "",
                            }))
                          }
                        >
                          <NumberInputField
                            min={10}
                            max={45}
                            sx={{ textAlign: "center", pl: 5 }}
                          />
                        </NumberInput>

                        <Button
                          disabled={
                            QGRSOptions.maxLen !== "" && QGRSOptions.maxLen >= 45
                          }
                          onClick={() =>
                            setQGRSOptions((prevOptions) => {
                              if (prevOptions.maxLen !== "") {
                                return {
                                  ...prevOptions,
                                  maxLen: prevOptions.maxLen + 1,
                                };
                              } else {
                                return {
                                  ...prevOptions,
                                  maxLen: prevOptions.maxLen,
                                };
                              }
                            })
                          }
                          bg="blue.500"
                          sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                        >
                          +
                        </Button>
                      </Stack>
                      {QGRSOptions.maxLen !== "" &&
                        (QGRSOptions.maxLen < 10 || QGRSOptions.maxLen > 45) ? (
                        <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                          Please enter a Max length between 10 and 45
                        </Text>
                      ) : null}
                    </Stack>

                    <Stack
                      direction="column"
                      sx={{ alignItems: "center", width: "100%" }}
                    >
                      <Text sx={{ mr: 2, fontSize: 18 }}>Min G-group</Text>

                      <Select
                        value={QGRSOptions.minGLen.toString()}
                        onChange={(e) =>
                          setQGRSOptions((prevOptions) => ({
                            ...prevOptions,
                            minGLen: parseInt(e.target.value),
                          }))
                        }
                        width="100px"
                      >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </Select>
                    </Stack>

                    <Stack
                      direction="column"
                      sx={{ alignItems: "center", width: "100%", mt: 5 }}
                    >
                      <Text sx={{ mr: 2, fontSize: 18 }}>Loop size</Text>

                      <Stack direction="column" sx={{ mr: 5 }}>
                        <Stack direction="row">
                          <NumberInput
                            name="loopMin"
                            sx={{ width: "70px" }}
                            value={QGRSOptions.loopMinString}
                            onChange={(value) =>
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                loopMinString: value,
                              }))
                            }
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
                            value={QGRSOptions.loopMaxString}
                            onChange={(value) =>
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                loopMaxString: value,
                              }))
                            }
                          >
                            <NumberInputField
                              min={0}
                              max={36}
                              sx={{ textAlign: "center" }}
                            />
                          </NumberInput>
                        </Stack>

                        <RangeSlider
                          value={[QGRSOptions.loopMin, QGRSOptions.loopMax]}
                          defaultValue={[0, 36]}
                          onChange={(value) => {
                            setQGRSOptions((prevOptions) => ({
                              ...prevOptions,
                              loopMin: value[0],
                              loopMax: value[1],
                              loopMinString: value[0].toString(),
                              loopMaxString: value[1].toString(),
                            }));
                          }}
                          sx={{ width: "180px" }}
                          min={0}
                          max={36}
                          step={1}
                        // onMouseEnter={() => setIsTooltipOpen(true)}
                        // onMouseLeave={() => setIsTooltipOpen(false)}
                        >
                          <RangeSliderTrack>
                            <RangeSliderFilledTrack />
                          </RangeSliderTrack>
                          {/* <Tooltip
                          hasArrow
                          placement="top"
                          isOpen={isTooltipOpen}
                          label={`${threshold}`}
                        >
                          <RangeSliderThumb index={0} />
                          <RangeSliderThumb index={1} />
                        </Tooltip> */}
                          <RangeSliderThumb index={0} />
                          <RangeSliderThumb index={1} />
                        </RangeSlider>
                      </Stack>
                    </Stack>

                    {isNaN(parseInt(QGRSOptions.loopMinString)) ||
                      isNaN(parseInt(QGRSOptions.loopMaxString)) ||
                      parseInt(QGRSOptions.loopMinString) >
                      parseInt(QGRSOptions.loopMaxString) ? (
                      <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                        Please enter a valid loop size.
                      </Text>
                    ) : null}
                  </Box>

                  <Button
                    variant="solid"
                    bg="blue.500"
                    sx={{
                      color: "#ffffff",
                      _hover: {},
                      _active: {},
                      mt: 7,
                      mr: 8,
                      ml: "400px",
                      width: "630px",
                    }}
                    onClick={async () => {
                      await axios
                        .post("/api/qgrs", {
                          inputString: firstSearch?.slice(5),
                          maxLen: QGRSOptions.maxLen,
                          minGLen: QGRSOptions.minGLen,
                          loopMin: QGRSOptions.loopMin,
                          loopMax: QGRSOptions.loopMax,
                        })
                        .then((res) => {
                          const data = res.data.result;

                         

                          const { summary, rows } = calculateSummaryQGRS(res.data.result);
                          setFirstSearchResultSummary(summary);
                          setFirstSearchResult({ "type": "qgrs", "result": rows });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    Analyse
                  </Button>

                  <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        mt: 2,
                        ml: 2,
                        width: "200px",
                      }}
                      onClick={() =>
                        downloadG4OrQGRSMainData(
                          filterData(firstSearchResult.result, filters1),
                          firstSearchResult.type
                        )
                      }
                    >
                      Download CSV
                    </Button>
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
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.total}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.two}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.three}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.four}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>


                  </Box>

                  <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">

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
                              {filters1[column] ? (
                                <Menu>
                                  <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    bg={
                                      filters1[column] == null ||
                                        Object.values(filters1[column]).every(
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
                                    {filters1[column] &&
                                      Object.keys(filters1[column]).map((uniqueValue) => (
                                        <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                          <Checkbox
                                            isChecked={filters1[column][uniqueValue]}
                                            onChange={(e) => {
                                              const filtersCopy = { ...filters1 };
                                              filtersCopy[column][uniqueValue] =
                                                !filtersCopy[column][uniqueValue];
                                              setFilters1(filtersCopy);
                                            }}
                                          >
                                            {formatCheckBoxVals(uniqueValue)}
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
                                      wordBreak: "break-all", // Break words if necessary
                                      fontSize: "12px",
                                    }}
                                    bg={
                                      filters1[column] == null ||
                                        Object.values(filters1[column]).every(
                                          (value) => value
                                        )
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
                        {filterData(firstSearchResult.result, filters1).map(
                          (row: {
                            start: number;
                            len: number;
                            sequence: string;
                            g_indices: number[];
                            numgs: string;
                            score: number;
                          }) => {
                            // let score = 0;
                            // row.g_indices.map((value) => (score += value));
                            return (
                              <Tr>
                                <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                <Td sx={{ textAlign: "center" }}>{(row.numgs + "G").replace("GG", "G")}</Td>
                                <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                <Td sx={{ textAlign: "center" }}>
                                  <Stack direction="row" spacing={0.5}>
                                    {row.sequence.split("").map((char) =>
                                      char === char.toLowerCase() ? (
                                        <Text
                                          sx={{
                                            color: "#0000ff",
                                            fontWeight: "100px",
                                          }}
                                        >
                                          {char.toUpperCase()}
                                        </Text>
                                      ) : (
                                        <Text>{char}</Text>
                                      )
                                    )}
                                  </Stack>
                                </Td>
                              </Tr>
                            );
                          }
                        )}
                      </Tbody>
                    </Table>
                  </Box>
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
                </>
              ) : (
                <>
                  <Box>
                    <Stack direction="row" sx={{ mx: 10, mt: 5 }}>
                      <Stack
                        direction="column"
                        sx={{ width: "100%", alignItems: "center" }}
                      >
                        <Text sx={{ fontSize: 18 }}>Window size</Text>

                        <Stack direction="row">
                          <Button
                            // isDisabled={
                            //   G4Options.windowSize === "" ||
                            //   G4Options.windowSize <= 10
                            // }
                            onClick={() =>
                              setG4Options((prevOptions) => {
                                if (prevOptions.windowSize !== "") {
                                  return {
                                    ...prevOptions,
                                    windowSize: prevOptions.windowSize - 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    windowSize: prevOptions.windowSize,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            -
                          </Button>

                          <NumberInput
                            name="windowSize"
                            sx={{ width: "80px" }}
                            value={
                              G4Options.windowSize !== null
                                ? G4Options.windowSize
                                : undefined
                            }
                            onChange={(value) =>
                              setG4Options((prevOptions) => ({
                                ...prevOptions,
                                windowSize: !isNaN(parseInt(value))
                                  ? parseInt(value)
                                  : "",
                              }))
                            }
                          >
                            <NumberInputField
                              min={10}
                              max={100}
                              sx={{ textAlign: "center", pl: 5 }}
                            />
                          </NumberInput>

                          <Button
                            // isDisabled={
                            //   G4Options.windowSize === "" ||
                            //   G4Options.windowSize >= 10
                            // }
                            onClick={() =>
                              setG4Options((prevOptions) => {
                                if (prevOptions.windowSize !== "") {
                                  return {
                                    ...prevOptions,
                                    windowSize: prevOptions.windowSize + 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    windowSize: prevOptions.windowSize,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            +
                          </Button>
                        </Stack>
                        {G4Options.windowSize !== "" &&
                          (G4Options.windowSize < 10 ||
                            G4Options.windowSize > 100) ? (
                          <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                            Please enter a window size between 10 and 100
                          </Text>
                        ) : null}
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ width: "100%", alignItems: "center" }}
                      >
                        <Text sx={{ fontSize: 18 }}>Threshold:</Text>

                        <Stack direction="column">
                          <NumberInput
                            name="threshold"
                            sx={{ width: "150px" }}
                            value={G4Options.thresholdString}
                            onChange={(value) =>
                              setG4Options((prevOptions) => ({
                                ...prevOptions,
                                thresholdString: value,
                              }))
                            }
                            precision={1}
                          >
                            <NumberInputField
                              min={10}
                              max={100}
                              sx={{ textAlign: "center" }}
                            />
                          </NumberInput>
                          <Slider
                            value={G4Options.threshold}
                            defaultValue={0.9}
                            onChange={(value) => {
                              setG4Options((prevOptions) => ({
                                ...prevOptions,
                                threshold: value,
                                thresholdString: value.toString(),
                              }));
                            }}
                            sx={{ width: "150px" }}
                            min={0.1}
                            max={4}
                            step={0.1}
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                          </Slider>
                        </Stack>
                      </Stack>

                      {isNaN(parseFloat(G4Options.thresholdString)) ||
                        parseFloat(G4Options.thresholdString) < 0.1 ||
                        parseFloat(G4Options.thresholdString) > 4 ? (
                        <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                          Please enter a threshold between 0.1 and 4.0
                        </Text>
                      ) : null}
                    </Stack>
                  </Box>


                  <Button
                    variant="solid"
                    bg="blue.500"
                    sx={{
                      color: "#ffffff",
                      _hover: {},
                      _active: {},
                      ml: "450px",
                      mt: "25px",
                      width: "530px",
                    }}
                    // onClick={async () => await handleAnalyseClick()}


                    onClick={async (_e) => {
                      await axios
                        .post("/api/g4hunter", {
                          inputString: firstSearch?.slice(3),
                          windowSize: G4Options.windowSize,
                          threshold: G4Options.threshold,
                        })
                        .then((res) => {
                        

                          const data = res.data.result;

                          const { summary, rows } = calculateSummaryG4(res.data.result);
                          setFirstSearchResultSummary(summary);
                          setFirstSearchResult({"type": "g4", "result": rows});



                        })
                        .catch((err) => {
                          console.log(err);
                        });

                    }}





                  >
                    Analyse
                  </Button>

                  <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        mt: 2,
                        ml: 2,
                        width: "200px",
                      }}
                      onClick={() =>
                        downloadG4OrQGRSMainData(
                          filterData(firstSearchResult.result, filters1),
                          firstSearchResult.type
                        )
                      }
                    >
                      Download CSV
                    </Button>
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
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.total}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.two}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.three}
                          </Td>
                          <Td sx={{ textAlign: "center" }}>
                            {firstSearchResultSummary.four}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>

                  <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                              {filters1[column] ? (
                                <Menu>
                                  <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    bg={
                                      filters1[column] == null ||
                                        Object.values(filters1[column]).every(
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
                                    {filters1[column] &&
                                      Object.keys(filters1[column]).map((uniqueValue) => (
                                        <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                          <Checkbox
                                            isChecked={filters1[column][uniqueValue]}
                                            onChange={(e) => {
                                              const filtersCopy = { ...filters1 };
                                              filtersCopy[column][uniqueValue] =
                                                !filtersCopy[column][uniqueValue];
                                              setFilters1(filtersCopy);
                                            }}
                                          >
                                            {formatCheckBoxVals(uniqueValue)}
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
                                      wordBreak: "break-all", // Break words if necessary
                                      fontSize: "12px",
                                    }}
                                    bg={
                                      filters1[column] == null ||
                                        Object.values(filters1[column]).every(
                                          (value) => value
                                        )
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
                        {filterData(firstSearchResult.result, filters1).map(
                          (row: {
                            start: number;
                            len: number;
                            sequence: string;
                            g_indices: number[];
                            numgs: string;
                            score: number;
                          }) => {
                            // let score = 0;
                            // row.g_indices.map((value) => (score += value));
                            return (
                              <Tr>
                                <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                <Td sx={{ textAlign: "center" }}>{(row.numgs + "G").replace("GG", "G")}</Td>
                                <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                <Td sx={{ textAlign: "center" }}>
                                  <Stack direction="row" spacing={0.5}>
                                    {row.sequence.split("").map((char) =>
                                      char === char.toLowerCase() ? (
                                        <Text
                                          sx={{
                                            color: "#0000ff",
                                            fontWeight: "100px",
                                          }}
                                        >
                                          {char.toUpperCase()}
                                        </Text>
                                      ) : (
                                        <Text>{char}</Text>
                                      )
                                    )}
                                  </Stack>
                                </Td>
                              </Tr>
                            );
                          }
                        )}
                      </Tbody>
                    </Table>
                  </Box>


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

                </>
              )}
            </CardBody>
          </Card>
        ) : secondSearchResult !== null && firstSearchResult === null ? (
          <Card sx={{ mt: 5, mx: 7, mb: 5 }}>
            <CardBody>
              <CardBody>
                {secondSearchResult.type === "qgrs" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%" }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Max length</Text>

                        <Stack direction="row">
                          <Button
                            disabled={
                              QGRSOptions.maxLen === "" || QGRSOptions.maxLen <= 10
                            }
                            onClick={() =>
                              setQGRSOptions((prevOptions) => {
                                if (prevOptions.maxLen !== "") {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen - 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            -
                          </Button>

                          <NumberInput
                            name="maxLen"
                            sx={{ width: "80px" }}
                            value={
                              QGRSOptions.maxLen !== null
                                ? QGRSOptions.maxLen
                                : undefined
                            }
                            onChange={(value) =>
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                maxLen: !isNaN(parseInt(value))
                                  ? parseInt(value)
                                  : "",
                              }))
                            }
                          >
                            <NumberInputField
                              min={10}
                              max={45}
                              sx={{ textAlign: "center", pl: 5 }}
                            />
                          </NumberInput>

                          <Button
                            disabled={
                              QGRSOptions.maxLen !== "" && QGRSOptions.maxLen >= 45
                            }
                            onClick={() =>
                              setQGRSOptions((prevOptions) => {
                                if (prevOptions.maxLen !== "") {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen + 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            +
                          </Button>
                        </Stack>
                        {QGRSOptions.maxLen !== "" &&
                          (QGRSOptions.maxLen < 10 || QGRSOptions.maxLen > 45) ? (
                          <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                            Please enter a Max length between 10 and 45
                          </Text>
                        ) : null}
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%" }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Min G-group</Text>

                        <Select
                          value={QGRSOptions.minGLen.toString()}
                          onChange={(e) =>
                            setQGRSOptions((prevOptions) => ({
                              ...prevOptions,
                              minGLen: parseInt(e.target.value),
                            }))
                          }
                          width="100px"
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </Select>
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%", mt: 5 }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Loop size</Text>

                        <Stack direction="column" sx={{ mr: 5 }}>
                          <Stack direction="row">
                            <NumberInput
                              name="loopMin"
                              sx={{ width: "70px" }}
                              value={QGRSOptions.loopMinString}
                              onChange={(value) =>
                                setQGRSOptions((prevOptions) => ({
                                  ...prevOptions,
                                  loopMinString: value,
                                }))
                              }
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
                              value={QGRSOptions.loopMaxString}
                              onChange={(value) =>
                                setQGRSOptions((prevOptions) => ({
                                  ...prevOptions,
                                  loopMaxString: value,
                                }))
                              }
                            >
                              <NumberInputField
                                min={0}
                                max={36}
                                sx={{ textAlign: "center" }}
                              />
                            </NumberInput>
                          </Stack>

                          <RangeSlider
                            value={[QGRSOptions.loopMin, QGRSOptions.loopMax]}
                            defaultValue={[0, 36]}
                            onChange={(value) => {
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                loopMin: value[0],
                                loopMax: value[1],
                                loopMinString: value[0].toString(),
                                loopMaxString: value[1].toString(),
                              }));
                            }}
                            sx={{ width: "180px" }}
                            min={0}
                            max={36}
                            step={1}
                          // onMouseEnter={() => setIsTooltipOpen(true)}
                          // onMouseLeave={() => setIsTooltipOpen(false)}
                          >
                            <RangeSliderTrack>
                              <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            {/* <Tooltip
                          hasArrow
                          placement="top"
                          isOpen={isTooltipOpen}
                          label={`${threshold}`}
                        >
                          <RangeSliderThumb index={0} />
                          <RangeSliderThumb index={1} />
                        </Tooltip> */}
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                          </RangeSlider>
                        </Stack>
                      </Stack>

                      {isNaN(parseInt(QGRSOptions.loopMinString)) ||
                        isNaN(parseInt(QGRSOptions.loopMaxString)) ||
                        parseInt(QGRSOptions.loopMinString) >
                        parseInt(QGRSOptions.loopMaxString) ? (
                        <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                          Please enter a valid loop size.
                        </Text>
                      ) : null}
                    </Box>

                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        mt: 7,
                        mr: 8,
                        ml: "400px",
                        width: "630px",
                      }}
                      onClick={async () => {
                        await axios
                          .post("/api/qgrs", {
                            inputString: secondSearch?.slice(5),
                            maxLen: QGRSOptions.maxLen,
                            minGLen: QGRSOptions.minGLen,
                            loopMin: QGRSOptions.loopMin,
                            loopMax: QGRSOptions.loopMax,
                          })
                          .then((res) => {
                            const data = res.data.result;

                           

                            const { summary, rows } = calculateSummaryQGRS(res.data.result);
                            setSecondSearchResultSummary(summary);
                            setSecondSearchResult({"type": "qgrs", "result": rows});
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      Analyse
                    </Button>

                    <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                      <Button
                        variant="solid"
                        bg="blue.500"
                        sx={{
                          color: "#ffffff",
                          _hover: {},
                          _active: {},
                          mt: 2,
                          ml: 2,
                          width: "200px",
                        }}
                        onClick={() =>
                          downloadG4OrQGRSMainData(
                            filterData(secondSearchResult.result, filters2),
                            secondSearchResult.type
                          )
                        }
                      >
                        Download CSV
                      </Button>

                      <Table>
                        <Thead>
                          <Tr>
                            <Th sx={{ textAlign: "center" }}>Total no. of PQSfffffffffff</Th>
                            <Th sx={{ textAlign: "center" }}>No. of 2G PQS</Th>
                            <Th sx={{ textAlign: "center" }}>No. of 3G PQS</Th>
                            <Th sx={{ textAlign: "center" }}>No. of 4G PQS</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.total}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.two}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.three}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.four}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>

                    <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                                {filters2[column] ? (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
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
                                      {filters2[column] &&
                                        Object.keys(filters2[column]).map((uniqueValue) => (
                                          <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                            <Checkbox
                                              isChecked={filters2[column][uniqueValue]}
                                              onChange={(e) => {
                                                const filtersCopy = { ...filters2 };
                                                filtersCopy[column][uniqueValue] =
                                                  !filtersCopy[column][uniqueValue];
                                                setFilters2(filtersCopy);
                                              }}
                                            >
                                              {formatCheckBoxVals(uniqueValue)}
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
                                        wordBreak: "break-all", // Break words if necessary
                                        fontSize: "12px",
                                      }}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
                                            (value) => value
                                          )
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
                          {filterData(secondSearchResult.result, filters2).map(
                            (row: {
                              start: number;
                              len: number;
                              sequence: string;
                              g_indices: number[];
                              numgs: string;
                              score: number;
                            }) => {
                              // let score = 0;
                              // row.g_indices.map((value) => (score += value));
                              return (
                                <Tr>
                                  <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                  <Td sx={{ textAlign: "center" }}>{(row.numgs + "G").replace("GG", "G")}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <Stack direction="row" spacing={0.5}>
                                      {row.sequence.split("").map((char) =>
                                        char === char.toLowerCase() ? (
                                          <Text
                                            sx={{
                                              color: "#0000ff",
                                              fontWeight: "100px",
                                            }}
                                          >
                                            {char.toUpperCase()}
                                          </Text>
                                        ) : (
                                          <Text>{char}</Text>
                                        )
                                      )}
                                    </Stack>
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                        </Tbody>
                      </Table>


                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Stack direction="row" sx={{ mx: 10, mt: 5 }}>
                        <Stack
                          direction="column"
                          sx={{ width: "100%", alignItems: "center" }}
                        >
                          <Text sx={{ fontSize: 18 }}>Window size</Text>

                          <Stack direction="row">
                            <Button
                              // isDisabled={
                              //   G4Options.windowSize === "" ||
                              //   G4Options.windowSize <= 10
                              // }
                              onClick={() =>
                                setG4Options((prevOptions) => {
                                  if (prevOptions.windowSize !== "") {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize - 1,
                                    };
                                  } else {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize,
                                    };
                                  }
                                })
                              }
                              bg="blue.500"
                              sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                            >
                              -
                            </Button>

                            <NumberInput
                              name="windowSize"
                              sx={{ width: "80px" }}
                              value={
                                G4Options.windowSize !== null
                                  ? G4Options.windowSize
                                  : undefined
                              }
                              onChange={(value) =>
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  windowSize: !isNaN(parseInt(value))
                                    ? parseInt(value)
                                    : "",
                                }))
                              }
                            >
                              <NumberInputField
                                min={10}
                                max={100}
                                sx={{ textAlign: "center", pl: 5 }}
                              />
                            </NumberInput>

                            <Button
                              // isDisabled={
                              //   G4Options.windowSize === "" ||
                              //   G4Options.windowSize >= 10
                              // }
                              onClick={() =>
                                setG4Options((prevOptions) => {
                                  if (prevOptions.windowSize !== "") {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize + 1,
                                    };
                                  } else {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize,
                                    };
                                  }
                                })
                              }
                              bg="blue.500"
                              sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                            >
                              +
                            </Button>
                          </Stack>
                          {G4Options.windowSize !== "" &&
                            (G4Options.windowSize < 10 ||
                              G4Options.windowSize > 100) ? (
                            <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                              Please enter a window size between 10 and 100
                            </Text>
                          ) : null}
                        </Stack>

                        <Stack
                          direction="column"
                          sx={{ width: "100%", alignItems: "center" }}
                        >
                          <Text sx={{ fontSize: 18 }}>Threshold:</Text>

                          <Stack direction="column">
                            <NumberInput
                              name="threshold"
                              sx={{ width: "150px" }}
                              value={G4Options.thresholdString}
                              onChange={(value) =>
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  thresholdString: value,
                                }))
                              }
                              precision={1}
                            >
                              <NumberInputField
                                min={10}
                                max={100}
                                sx={{ textAlign: "center" }}
                              />
                            </NumberInput>
                            <Slider
                              value={G4Options.threshold}
                              defaultValue={0.9}
                              onChange={(value) => {
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  threshold: value,
                                  thresholdString: value.toString(),
                                }));
                              }}
                              sx={{ width: "150px" }}
                              min={0.1}
                              max={4}
                              step={0.1}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          </Stack>
                        </Stack>

                        {isNaN(parseFloat(G4Options.thresholdString)) ||
                          parseFloat(G4Options.thresholdString) < 0.1 ||
                          parseFloat(G4Options.thresholdString) > 4 ? (
                          <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                            Please enter a threshold between 0.1 and 4.0
                          </Text>
                        ) : null}
                      </Stack>
                    </Box>

                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        ml: "0",
                        mt: "25px",
                        width: "100%",
                      }}
                    // onClick={async () => await handleAnalyseClick()}
                    >
                      Analyse
                    </Button>

                    <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                      <Button
                        variant="solid"
                        bg="blue.500"
                        sx={{
                          color: "#ffffff",
                          _hover: {},
                          _active: {},
                          mt: 2,
                          ml: 2,
                          width: "200px",
                        }}
                        onClick={() =>
                          downloadG4OrQGRSMainData(
                            filterData(secondSearchResult.result, filters2),
                            secondSearchResult.type
                          )
                        }
                      >
                        Download CSV
                      </Button>
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
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.total}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.two}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.three}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.four}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>

                    <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                                {filters2[column] ? (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
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
                                      {filters2[column] &&
                                        Object.keys(filters2[column]).map((uniqueValue) => (
                                          <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                            <Checkbox
                                              isChecked={filters2[column][uniqueValue]}
                                              onChange={(e) => {
                                                const filtersCopy = { ...filters2 };
                                                filtersCopy[column][uniqueValue] =
                                                  !filtersCopy[column][uniqueValue];
                                                setFilters2(filtersCopy);
                                              }}
                                            >
                                              {formatCheckBoxVals(uniqueValue)}
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
                                        wordBreak: "break-all", // Break words if necessary
                                        fontSize: "12px",
                                      }}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
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
                          {filterData(secondSearchResult.result, filters2).map(
                            (row: {
                              start: number;
                              len: number;
                              sequence: string;
                              g_indices: number[];
                              numgs: string;
                              score: number;
                            }) => {
                              // let score = 0;
                              // row.g_indices.map((value) => (score += value));
                              return (
                                <Tr>
                                  <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                  <Td sx={{ textAlign: "center" }}>{(row.numgs + "G").replace("GG", "G")}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <Stack direction="row" spacing={0.5}>
                                      {row.sequence.split("").map((char) =>
                                        char === char.toLowerCase() ? (
                                          <Text
                                            sx={{
                                              color: "#0000ff",
                                              fontWeight: "100px",
                                            }}
                                          >
                                            {char.toUpperCase()}
                                          </Text>
                                        ) : (
                                          <Text>{char}</Text>
                                        )
                                      )}
                                    </Stack>
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                        </Tbody>
                      </Table>


                    </Box>
                  </>
                )}
              </CardBody>
            </CardBody>
          </Card>
        ) : null}

        {firstSearchResult !== null && secondSearchResult !== null ? (
          <Stack direction="row" sx={{ mt: 5, mx: 7 }} spacing={5}>
            <Card sx={{ width: "100%", mb: 5 }}>
              <CardBody>
                {firstSearchResult.type === "qgrs" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%" }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Max length</Text>

                        <Stack direction="row">
                          <Button
                            disabled={
                              QGRSOptions.maxLen === "" ||
                              QGRSOptions.maxLen <= 10
                            }
                            onClick={() =>
                              setQGRSOptions((prevOptions) => {
                                if (prevOptions.maxLen !== "") {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen - 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            -
                          </Button>

                          <NumberInput
                            name="maxLen"
                            sx={{ width: "80px" }}
                            value={
                              QGRSOptions.maxLen !== null
                                ? QGRSOptions.maxLen
                                : undefined
                            }
                            onChange={(value) =>
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                maxLen: !isNaN(parseInt(value))
                                  ? parseInt(value)
                                  : "",
                              }))
                            }
                          >
                            <NumberInputField
                              min={10}
                              max={45}
                              sx={{ textAlign: "center", pl: 5 }}
                            />
                          </NumberInput>

                          <Button
                            disabled={
                              QGRSOptions.maxLen !== "" &&
                              QGRSOptions.maxLen >= 45
                            }
                            onClick={() =>
                              setQGRSOptions((prevOptions) => {
                                if (prevOptions.maxLen !== "") {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen + 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            +
                          </Button>
                        </Stack>
                        {QGRSOptions.maxLen !== "" &&
                          (QGRSOptions.maxLen < 10 || QGRSOptions.maxLen > 45) ? (
                          <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                            Please enter a Max length between 10 and 45
                          </Text>
                        ) : null}
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%" }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Min G-group</Text>

                        <Select
                          value={QGRSOptions.minGLen.toString()}
                          onChange={(e) =>
                            setQGRSOptions((prevOptions) => ({
                              ...prevOptions,
                              minGLen: parseInt(e.target.value),
                            }))
                          }
                          width="100px"
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </Select>
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%", mt: 5 }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Loop size</Text>

                        <Stack direction="column" sx={{ mr: 5 }}>
                          <Stack direction="row">
                            <NumberInput
                              name="loopMin"
                              sx={{ width: "70px" }}
                              value={QGRSOptions.loopMinString}
                              onChange={(value) =>
                                setQGRSOptions((prevOptions) => ({
                                  ...prevOptions,
                                  loopMinString: value,
                                }))
                              }
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
                              value={QGRSOptions.loopMaxString}
                              onChange={(value) =>
                                setQGRSOptions((prevOptions) => ({
                                  ...prevOptions,
                                  loopMaxString: value,
                                }))
                              }
                            >
                              <NumberInputField
                                min={0}
                                max={36}
                                sx={{ textAlign: "center" }}
                              />
                            </NumberInput>
                          </Stack>

                          <RangeSlider
                            value={[QGRSOptions.loopMin, QGRSOptions.loopMax]}
                            defaultValue={[0, 36]}
                            onChange={(value) => {
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                loopMin: value[0],
                                loopMax: value[1],
                                loopMinString: value[0].toString(),
                                loopMaxString: value[1].toString(),
                              }));
                            }}
                            sx={{ width: "180px" }}
                            min={0}
                            max={36}
                            step={1}
                          // onMouseEnter={() => setIsTooltipOpen(true)}
                          // onMouseLeave={() => setIsTooltipOpen(false)}
                          >
                            <RangeSliderTrack>
                              <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            {/* <Tooltip
                          hasArrow
                          placement="top"
                          isOpen={isTooltipOpen}
                          label={`${threshold}`}
                        >
                          <RangeSliderThumb index={0} />
                          <RangeSliderThumb index={1} />
                        </Tooltip> */}
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                          </RangeSlider>
                        </Stack>
                      </Stack>

                      {isNaN(parseInt(QGRSOptions.loopMinString)) ||
                        isNaN(parseInt(QGRSOptions.loopMaxString)) ||
                        parseInt(QGRSOptions.loopMinString) >
                        parseInt(QGRSOptions.loopMaxString) ? (
                        <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                          Please enter a valid loop size.
                        </Text>
                      ) : null}
                    </Box>

                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        mt: 7,
                        mx: 0,
                        width: "100%",
                      }}
                      onClick={async () => {
                        await axios
                          .post("/api/qgrs", {
                            inputString: firstSearch?.slice(5),
                            maxLen: QGRSOptions.maxLen,
                            minGLen: QGRSOptions.minGLen,
                            loopMin: QGRSOptions.loopMin,
                            loopMax: QGRSOptions.loopMax,
                          })
                          .then((res) => {
                            const data = res.data.result;

                            const { summary, rows } = calculateSummaryQGRS(res.data.result);
                            setFirstSearchResultSummary(summary);
                            setFirstSearchResult({"type": "qgrs", "result": rows});


                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      Analyse
                    </Button>

                    <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                      <Button
                        variant="solid"
                        bg="blue.500"
                        sx={{
                          color: "#ffffff",
                          _hover: {},
                          _active: {},
                          mt: 2,
                          ml: 2,
                          width: "200px",
                        }}
                        onClick={() =>
                          downloadG4OrQGRSMainData(
                            filterData(firstSearchResult.result, filters1),
                            firstSearchResult.type
                          )
                        }
                      >
                        Download CSV
                      </Button>
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
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.total}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.two}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.three}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.four}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>

                    <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                                {filters1[column] ? (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      bg={
                                        filters1[column] == null ||
                                          Object.values(filters1[column]).every(
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
                                      {filters1[column] &&
                                        Object.keys(filters1[column]).map((uniqueValue) => (
                                          <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                            <Checkbox
                                              isChecked={filters1[column][uniqueValue]}
                                              onChange={(e) => {
                                                const filtersCopy = { ...filters1 };
                                                filtersCopy[column][uniqueValue] =
                                                  !filtersCopy[column][uniqueValue];
                                                setFilters1(filtersCopy);
                                              }}
                                            >
                                              {formatCheckBoxVals(uniqueValue)}
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
                                        wordBreak: "break-all", // Break words if necessary
                                        fontSize: "12px",
                                      }}
                                      bg={
                                        filters1[column] == null ||
                                          Object.values(filters1[column]).every(
                                            (value) => value
                                          )
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
                          {filterData(firstSearchResult.result, filters1).map(
                            (row: {
                              start: number;
                              len: number;
                              sequence: string;
                              g_indices: number[];
                              numgs: string;
                              score: number;
                            }) => {
                              // let score = 0;
                              // row.g_indices.map((value) => (score += value));
                              return (
                                <Tr>
                                  <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                  <Td sx={{ textAlign: "center" }}>{((row.numgs + "G").replace("GG", "G")).replace("GG", "G")}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <Stack direction="row" spacing={0.5}>
                                      {row.sequence.split("").map((char) =>
                                        char === char.toLowerCase() ? (
                                          <Text
                                            sx={{
                                              color: "#0000ff",
                                              fontWeight: "100px",
                                            }}
                                          >
                                            {char.toUpperCase()}
                                          </Text>
                                        ) : (
                                          <Text>{char}</Text>
                                        )
                                      )}
                                    </Stack>
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                        </Tbody>
                      </Table>

                      <CardBody sx={{ textAlign: "center" }}>
                        Data curated from QGRS Mapper(
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
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Stack direction="row" sx={{ mx: 10, mt: 5 }}>
                        <Stack
                          direction="column"
                          sx={{ width: "100%", alignItems: "center" }}
                        >
                          <Text sx={{ fontSize: 18 }}>Window size</Text>

                          <Stack direction="row">
                            <Button
                              // isDisabled={
                              //   G4Options.windowSize === "" ||
                              //   G4Options.windowSize <= 10
                              // }
                              onClick={() =>
                                setG4Options((prevOptions) => {
                                  if (prevOptions.windowSize !== "") {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize - 1,
                                    };
                                  } else {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize,
                                    };
                                  }
                                })
                              }
                              bg="blue.500"
                              sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                            >
                              -
                            </Button>

                            <NumberInput
                              name="windowSize"
                              sx={{ width: "80px" }}
                              value={
                                G4Options.windowSize !== null
                                  ? G4Options.windowSize
                                  : undefined
                              }
                              onChange={(value) =>
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  windowSize: !isNaN(parseInt(value))
                                    ? parseInt(value)
                                    : "",
                                }))
                              }
                            >
                              <NumberInputField
                                min={10}
                                max={100}
                                sx={{ textAlign: "center", pl: 5 }}
                              />
                            </NumberInput>

                            <Button
                              // isDisabled={
                              //   G4Options.windowSize === "" ||
                              //   G4Options.windowSize >= 10
                              // }
                              onClick={() =>
                                setG4Options((prevOptions) => {
                                  if (prevOptions.windowSize !== "") {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize + 1,
                                    };
                                  } else {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize,
                                    };
                                  }
                                })
                              }
                              bg="blue.500"
                              sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                            >
                              +
                            </Button>
                          </Stack>
                          {G4Options.windowSize !== "" &&
                            (G4Options.windowSize < 10 ||
                              G4Options.windowSize > 100) ? (
                            <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                              Please enter a window size between 10 and 100
                            </Text>
                          ) : null}
                        </Stack>

                        <Stack
                          direction="column"
                          sx={{ width: "100%", alignItems: "center" }}
                        >
                          <Text sx={{ fontSize: 18 }}>Threshold:</Text>

                          <Stack direction="column">
                            <NumberInput
                              name="threshold"
                              sx={{ width: "150px" }}
                              value={G4Options.thresholdString}
                              onChange={(value) =>
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  thresholdString: value,
                                }))
                              }
                              precision={1}
                            >
                              <NumberInputField
                                min={10}
                                max={100}
                                sx={{ textAlign: "center" }}
                              />
                            </NumberInput>
                            <Slider
                              value={G4Options.threshold}
                              defaultValue={0.9}
                              onChange={(value) => {
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  threshold: value,
                                  thresholdString: value.toString(),
                                }));
                              }}
                              sx={{ width: "150px" }}
                              min={0.1}
                              max={4}
                              step={0.1}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          </Stack>
                        </Stack>

                        {isNaN(parseFloat(G4Options.thresholdString)) ||
                          parseFloat(G4Options.thresholdString) < 0.1 ||
                          parseFloat(G4Options.thresholdString) > 4 ? (
                          <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                            Please enter a threshold between 0.1 and 4.0
                          </Text>
                        ) : null}
                      </Stack>
                    </Box>


                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        ml: 0,
                        mt: "25px",
                        width: "100%",
                      }}
                      // onClick={async () => await handleAnalyseClick()}


                      onClick={async (_e) => {
                        await axios
                          .post("/api/g4hunter", {
                            inputString: firstSearch?.slice(3),
                            windowSize: G4Options.windowSize,
                            threshold: G4Options.threshold,
                          })
                          .then((res) => {
                            

                            const data = res.data.result;

                            const { summary, rows } = calculateSummaryG4(res.data.result);
                            setFirstSearchResultSummary(summary);
                            setFirstSearchResult({"type": "g4", "result": rows});
                          })
                          .catch((err) => {
                            console.log(err);
                          });

                      }}

                    >
                      Analyse
                    </Button>

                    <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                      <Button
                        variant="solid"
                        bg="blue.500"
                        sx={{
                          color: "#ffffff",
                          _hover: {},
                          _active: {},
                          mt: 2,
                          ml: 2,
                          width: "200px",
                        }}
                        onClick={() =>
                          downloadG4OrQGRSMainData(
                            filterData(firstSearchResult.result, filters1),
                            firstSearchResult.type
                          )
                        }
                      >
                        Download CSV
                      </Button>
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
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.total}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.two}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.three}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {firstSearchResultSummary.four}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>

                    <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                                {filters1[column] ? (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      bg={
                                        filters1[column] == null ||
                                          Object.values(filters1[column]).every(
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
                                      {filters1[column] &&
                                        Object.keys(filters1[column]).map((uniqueValue) => (
                                          <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                            <Checkbox
                                              isChecked={filters1[column][uniqueValue]}
                                              onChange={(e) => {
                                                const filtersCopy = { ...filters1 };
                                                filtersCopy[column][uniqueValue] =
                                                  !filtersCopy[column][uniqueValue];
                                                setFilters1(filtersCopy);
                                              }}
                                            >
                                              {formatCheckBoxVals(uniqueValue)}
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
                                        wordBreak: "break-all", // Break words if necessary
                                        fontSize: "12px",
                                      }}
                                      bg={
                                        filters1[column] == null ||
                                          Object.values(filters1[column]).every(
                                            (value) => value
                                          )
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
                          {filterData(firstSearchResult.result, filters1).map(
                            (row: {
                              start: number;
                              len: number;
                              sequence: string;
                              g_indices: number[];
                              numgs: string;
                              score: number;
                            }) => {
                              // let score = 0;
                              // row.g_indices.map((value) => (score += value));
                              return (
                                <Tr>
                                  <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                  <Td sx={{ textAlign: "center" }}>{((row.numgs + "G").replace("GG", "G")).replace("GG", "G")}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <Stack direction="row" spacing={0.5}>
                                      {row.sequence.split("").map((char) =>
                                        char === char.toLowerCase() ? (
                                          <Text
                                            sx={{
                                              color: "#0000ff",
                                              fontWeight: "100px",
                                            }}
                                          >
                                            {char.toUpperCase()}
                                          </Text>
                                        ) : (
                                          <Text>{char}</Text>
                                        )
                                      )}
                                    </Stack>
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                        </Tbody>
                      </Table>


                      <CardBody sx={{ textAlign: "center" }}>
                        Data curated from G4Hunter(
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

                    </Box>
                  </>
                )}
              </CardBody>
            </Card>
            <Card sx={{ width: "100%", mb: 5 }}>
              <CardBody>
                {secondSearchResult.type === "qgrs" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%" }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Max length</Text>

                        <Stack direction="row">
                          <Button
                            disabled={
                              QGRSOptions.maxLen === "" ||
                              QGRSOptions.maxLen <= 10
                            }
                            onClick={() =>
                              setQGRSOptions((prevOptions) => {
                                if (prevOptions.maxLen !== "") {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen - 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            -
                          </Button>

                          <NumberInput
                            name="maxLen"
                            sx={{ width: "80px" }}
                            value={
                              QGRSOptions.maxLen !== null
                                ? QGRSOptions.maxLen
                                : undefined
                            }
                            onChange={(value) =>
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                maxLen: !isNaN(parseInt(value))
                                  ? parseInt(value)
                                  : "",
                              }))
                            }
                          >
                            <NumberInputField
                              min={10}
                              max={45}
                              sx={{ textAlign: "center", pl: 5 }}
                            />
                          </NumberInput>

                          <Button
                            disabled={
                              QGRSOptions.maxLen !== "" &&
                              QGRSOptions.maxLen >= 45
                            }
                            onClick={() =>
                              setQGRSOptions((prevOptions) => {
                                if (prevOptions.maxLen !== "") {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen + 1,
                                  };
                                } else {
                                  return {
                                    ...prevOptions,
                                    maxLen: prevOptions.maxLen,
                                  };
                                }
                              })
                            }
                            bg="blue.500"
                            sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                          >
                            +
                          </Button>
                        </Stack>
                        {QGRSOptions.maxLen !== "" &&
                          (QGRSOptions.maxLen < 10 || QGRSOptions.maxLen > 45) ? (
                          <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                            Please enter a Max length between 10 and 45
                          </Text>
                        ) : null}
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%" }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Min G-group</Text>

                        <Select
                          value={QGRSOptions.minGLen.toString()}
                          onChange={(e) =>
                            setQGRSOptions((prevOptions) => ({
                              ...prevOptions,
                              minGLen: parseInt(e.target.value),
                            }))
                          }
                          width="100px"
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </Select>
                      </Stack>

                      <Stack
                        direction="column"
                        sx={{ alignItems: "center", width: "100%", mt: 5 }}
                      >
                        <Text sx={{ mr: 2, fontSize: 18 }}>Loop size</Text>

                        <Stack direction="column" sx={{ mr: 5 }}>
                          <Stack direction="row">
                            <NumberInput
                              name="loopMin"
                              sx={{ width: "70px" }}
                              value={QGRSOptions.loopMinString}
                              onChange={(value) =>
                                setQGRSOptions((prevOptions) => ({
                                  ...prevOptions,
                                  loopMinString: value,
                                }))
                              }
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
                              value={QGRSOptions.loopMaxString}
                              onChange={(value) =>
                                setQGRSOptions((prevOptions) => ({
                                  ...prevOptions,
                                  loopMaxString: value,
                                }))
                              }
                            >
                              <NumberInputField
                                min={0}
                                max={36}
                                sx={{ textAlign: "center" }}
                              />
                            </NumberInput>
                          </Stack>

                          <RangeSlider
                            value={[QGRSOptions.loopMin, QGRSOptions.loopMax]}
                            defaultValue={[0, 36]}
                            onChange={(value) => {
                              setQGRSOptions((prevOptions) => ({
                                ...prevOptions,
                                loopMin: value[0],
                                loopMax: value[1],
                                loopMinString: value[0].toString(),
                                loopMaxString: value[1].toString(),
                              }));
                            }}
                            sx={{ width: "180px" }}
                            min={0}
                            max={36}
                            step={1}
                          // onMouseEnter={() => setIsTooltipOpen(true)}
                          // onMouseLeave={() => setIsTooltipOpen(false)}
                          >
                            <RangeSliderTrack>
                              <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            {/* <Tooltip
                      hasArrow
                      placement="top"
                      isOpen={isTooltipOpen}
                      label={`${threshold}`}
                    >
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </Tooltip> */}
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                          </RangeSlider>
                        </Stack>
                      </Stack>

                      {isNaN(parseInt(QGRSOptions.loopMinString)) ||
                        isNaN(parseInt(QGRSOptions.loopMaxString)) ||
                        parseInt(QGRSOptions.loopMinString) >
                        parseInt(QGRSOptions.loopMaxString) ? (
                        <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                          Please enter a valid loop size.
                        </Text>
                      ) : null}
                    </Box>

                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        mt: 7,
                        mx: 0,
                        width: "100%",
                      }}
                      onClick={async () => {
                        await axios
                          .post("/api/qgrs", {
                            inputString: secondSearch?.slice(5),
                            maxLen: QGRSOptions.maxLen,
                            minGLen: QGRSOptions.minGLen,
                            loopMin: QGRSOptions.loopMin,
                            loopMax: QGRSOptions.loopMax,
                          })
                          .then((res) => {
                            const data = res.data.result;

                          

                            const { summary, rows } = calculateSummaryQGRS(res.data.result);
                            setSecondSearchResultSummary(summary);
                            setSecondSearchResult({"type": "qgrs", "result": rows});
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      Analyse
                    </Button>

                    <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                      <Button
                        variant="solid"
                        bg="blue.500"
                        sx={{
                          color: "#ffffff",
                          _hover: {},
                          _active: {},
                          mt: 2,
                          ml: 2,
                          width: "200px",
                        }}
                        onClick={() =>
                          downloadG4OrQGRSMainData(
                            filterData(secondSearchResult.result, filters2),
                            secondSearchResult.type
                          )
                        }
                      >
                        Download CSV
                      </Button>
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
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.total}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.two}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.three}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.four}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>

                    <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                                {filters2[column] ? (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
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
                                      {filters2[column] &&
                                        Object.keys(filters2[column]).map((uniqueValue) => (
                                          <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                            <Checkbox
                                              isChecked={filters2[column][uniqueValue]}
                                              onChange={(e) => {
                                                const filtersCopy = { ...filters2 };
                                                filtersCopy[column][uniqueValue] =
                                                  !filtersCopy[column][uniqueValue];
                                                setFilters2(filtersCopy);
                                              }}
                                            >
                                              {formatCheckBoxVals(uniqueValue)}
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
                                        wordBreak: "break-all", // Break words if necessary
                                        fontSize: "12px",
                                      }}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
                                            (value) => value
                                          )
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
                          {filterData(secondSearchResult.result, filters2).map(
                            (row: {
                              start: number;
                              len: number;
                              sequence: string;
                              g_indices: number[];
                              numgs: string;
                              score: number;
                            }) => {
                              // let score = 0;
                              // row.g_indices.map((value) => (score += value));
                              return (
                                <Tr>
                                  <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                  <Td sx={{ textAlign: "center" }}>{((row.numgs + "G").replace("GG", "G")).replace("GG", "G")}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <Stack direction="row" spacing={0.5}>
                                      {row.sequence.split("").map((char) =>
                                        char === char.toLowerCase() ? (
                                          <Text
                                            sx={{
                                              color: "#0000ff",
                                              fontWeight: "100px",
                                            }}
                                          >
                                            {char.toUpperCase()}
                                          </Text>
                                        ) : (
                                          <Text>{char}</Text>
                                        )
                                      )}
                                    </Stack>
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                        </Tbody>
                      </Table>


                      <CardBody sx={{ textAlign: "center" }}>
                        Data curated from QGRS Mapper(
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

                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Stack direction="row" sx={{ mx: 10, mt: 5 }}>
                        <Stack
                          direction="column"
                          sx={{ width: "100%", alignItems: "center" }}
                        >
                          <Text sx={{ fontSize: 18 }}>Window size</Text>

                          <Stack direction="row">
                            <Button
                              // isDisabled={
                              //   G4Options.windowSize === "" ||
                              //   G4Options.windowSize <= 10
                              // }
                              onClick={() =>
                                setG4Options((prevOptions) => {
                                  if (prevOptions.windowSize !== "") {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize - 1,
                                    };
                                  } else {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize,
                                    };
                                  }
                                })
                              }
                              bg="blue.500"
                              sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                            >
                              -
                            </Button>

                            <NumberInput
                              name="windowSize"
                              sx={{ width: "80px" }}
                              value={
                                G4Options.windowSize !== null
                                  ? G4Options.windowSize
                                  : undefined
                              }
                              onChange={(value) =>
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  windowSize: !isNaN(parseInt(value))
                                    ? parseInt(value)
                                    : "",
                                }))
                              }
                            >
                              <NumberInputField
                                min={10}
                                max={100}
                                sx={{ textAlign: "center", pl: 5 }}
                              />
                            </NumberInput>

                            <Button
                              // isDisabled={
                              //   G4Options.windowSize === "" ||
                              //   G4Options.windowSize >= 10
                              // }
                              onClick={() =>
                                setG4Options((prevOptions) => {
                                  if (prevOptions.windowSize !== "") {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize + 1,
                                    };
                                  } else {
                                    return {
                                      ...prevOptions,
                                      windowSize: prevOptions.windowSize,
                                    };
                                  }
                                })
                              }
                              bg="blue.500"
                              sx={{ _hover: {}, _active: {}, color: "#ffffff" }}
                            >
                              +
                            </Button>
                          </Stack>
                          {G4Options.windowSize !== "" &&
                            (G4Options.windowSize < 10 ||
                              G4Options.windowSize > 100) ? (
                            <Text sx={{ color: "crimson", mt: 2, ml: 1 }}>
                              Please enter a window size between 10 and 100
                            </Text>
                          ) : null}
                        </Stack>

                        <Stack
                          direction="column"
                          sx={{ width: "100%", alignItems: "center" }}
                        >
                          <Text sx={{ fontSize: 18 }}>Threshold:</Text>

                          <Stack direction="column">
                            <NumberInput
                              name="threshold"
                              sx={{ width: "150px" }}
                              value={G4Options.thresholdString}
                              onChange={(value) =>
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  thresholdString: value,
                                }))
                              }
                              precision={1}
                            >
                              <NumberInputField
                                min={10}
                                max={100}
                                sx={{ textAlign: "center" }}
                              />
                            </NumberInput>
                            <Slider
                              value={G4Options.threshold}
                              defaultValue={0.9}
                              onChange={(value) => {
                                setG4Options((prevOptions) => ({
                                  ...prevOptions,
                                  threshold: value,
                                  thresholdString: value.toString(),
                                }));
                              }}
                              sx={{ width: "150px" }}
                              min={0.1}
                              max={4}
                              step={0.1}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          </Stack>
                        </Stack>

                        {isNaN(parseFloat(G4Options.thresholdString)) ||
                          parseFloat(G4Options.thresholdString) < 0.1 ||
                          parseFloat(G4Options.thresholdString) > 4 ? (
                          <Text sx={{ color: "crimson", mt: 2, fontSize: 16 }}>
                            Please enter a threshold between 0.1 and 4.0
                          </Text>
                        ) : null}
                      </Stack>
                    </Box>

                    <Button
                      variant="solid"
                      bg="blue.500"
                      sx={{
                        color: "#ffffff",
                        _hover: {},
                        _active: {},
                        ml: 0,
                        mt: "25px",
                        width: "100%",
                      }}
                      //  onClick={async () => alert("Coming Soon!")}

                      onClick={async (_e) => {
                        await axios
                          .post("/api/g4hunter", {
                            inputString: secondSearch?.slice(3),
                            windowSize: G4Options.windowSize,
                            threshold: G4Options.threshold,
                          })
                          .then((res) => {
                            

                            const data = res.data.result;

                            const { summary, rows } = calculateSummaryG4(res.data.result);
                            setSecondSearchResultSummary(summary);
                            setSecondSearchResult({"type": "g4", "result": rows});
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      Analyse
                    </Button>

                    <Box sx={{ mt: 10 }} onMouseMove={handleMouseMove} overflowX="auto">
                      <Button
                        variant="solid"
                        bg="blue.500"
                        sx={{
                          color: "#ffffff",
                          _hover: {},
                          _active: {},
                          mt: 2,
                          ml: 2,
                          width: "200px",
                        }}
                        onClick={() =>
                          downloadG4OrQGRSMainData(
                            filterData(secondSearchResult.result, filters2),
                            secondSearchResult.type
                          )
                        }
                      >
                        Download CSV
                      </Button>
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
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.total}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.two}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.three}
                            </Td>
                            <Td sx={{ textAlign: "center" }}>
                              {secondSearchResultSummary.four}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Box>

                    <Box sx={{ mt: 5 }} onMouseMove={handleMouseMove} overflowX="auto">
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
                                {filters2[column] ? (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
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
                                      {filters2[column] &&
                                        Object.keys(filters2[column]).map((uniqueValue) => (
                                          <MenuItem key={formatCheckBoxVals(uniqueValue)}>
                                            <Checkbox
                                              isChecked={filters2[column][uniqueValue]}
                                              onChange={(e) => {
                                                const filtersCopy = { ...filters2 };
                                                filtersCopy[column][uniqueValue] =
                                                  !filtersCopy[column][uniqueValue];
                                                setFilters2(filtersCopy);
                                              }}
                                            >
                                              {formatCheckBoxVals(uniqueValue)}
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
                                        wordBreak: "break-all", // Break words if necessary
                                        fontSize: "12px",
                                      }}
                                      bg={
                                        filters2[column] == null ||
                                          Object.values(filters2[column]).every(
                                            (value) => value
                                          )
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
                          {filterData(secondSearchResult.result, filters2).map(
                            (row: {
                              start: number;
                              len: number;
                              sequence: string;
                              g_indices: number[];
                              numgs: string;
                              score: number;
                            }) => {
                              // let score = 0;
                              // row.g_indices.map((value) => (score += value));
                              return (
                                <Tr>
                                  <Td sx={{ textAlign: "center" }}>{row.start}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.len}</Td>
                                  <Td sx={{ textAlign: "center" }}>{(row.numgs + "G").replace("GG", "G")}</Td>
                                  <Td sx={{ textAlign: "center" }}>{row.score}</Td>
                                  <Td sx={{ textAlign: "center" }}>
                                    <Stack direction="row" spacing={0.5}>
                                      {row.sequence.split("").map((char) =>
                                        char === char.toLowerCase() ? (
                                          <Text
                                            sx={{
                                              color: "#0000ff",
                                              fontWeight: "100px",
                                            }}
                                          >
                                            {char.toUpperCase()}
                                          </Text>
                                        ) : (
                                          <Text>{char}</Text>
                                        )
                                      )}
                                    </Stack>
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                        </Tbody>
                      </Table>


                      <CardBody sx={{ textAlign: "center" }}>
                        Data curated from G4Hunter <br></br>(
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

                    </Box>
                  </>
                )}
              </CardBody>
            </Card>
          </Stack>
        ) : null}
      </>

      {/* Add this part below the existing code, within the main <div> */}
      {firstSearchResult !== null || secondSearchResult !== null ? (
        <Box overflowX="auto" sx={{ mx: 7 }} onMouseMove={handleMouseMove}>
        </Box>
      ) : null}
    </div>
  );
};

export default G4Prediction;
"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const G4Prediction = () => {
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
    threshold: 2,
    thresholdString: "2",
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

  useEffect(() => {
    axios
      .get(`/api/g4prediction`, { params: { lncrnaName } })
      .then((res) => {setTableData(res.data)
        let total_variants = 0;
      res.data.map((row: {
        lncrna_name: string;
        num_transcript_variants: number;
        ncbi_access_num: string;})=>total_variants = row.num_transcript_variants > total_variants ? row.num_transcript_variants : total_variants
      )
      setTotalTranscriptVariants(total_variants)})
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

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25, mt: 2, ml: 2, mb: 0 }}>
          {lncrnaName}
        </CardHeader>
        <CardBody>
          Total no. of transcript variants (lncRNAs): {totalTranscriptVariants}
        </CardBody>
      </Card>

      {tableData !== null && tableData.length > 0 ? (
        <Card sx={{ mt: 5, mx: 7 }}>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>LncRNA Name</Th>
                    <Th sx={{ textAlign: "center" }}>Transcript variants</Th>
                    <Th sx={{ textAlign: "center" }}>NCBI Reference ID</Th>
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
                      return <Tr>
                        <Td>{row.lncrna_name}</Td>
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
                                  setFirstSearch(`qgrs_${row.ncbi_access_num}`);
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

                                      setFirstSearchResult(
                                        (prevResult: any) => {
                                          return {
                                            type: "qgrs",
                                            result: [
                                              ...data.map(
                                                (ele: any, idx: number) => {
                                                  if (ele.numgs === 2) {
                                                    setFirstSearchResultSummary(
                                                      (prev) => ({
                                                        ...prev,

                                                        total: prev.total + 1,
                                                        two: prev.two + 1,
                                                      })
                                                    );
                                                  } else if (ele.numgs === 3) {
                                                    setFirstSearchResultSummary(
                                                      (prev) => ({
                                                        ...prev,

                                                        total: prev.total + 1,
                                                        three: prev.three + 1,
                                                      })
                                                    );
                                                  } else if (ele.numgs === 4) {
                                                    setFirstSearchResultSummary(
                                                      (prev) => ({
                                                        ...prev,

                                                        total: prev.total + 1,
                                                        four: prev.four + 1,
                                                      })
                                                    );
                                                  }

                                                  let x = "",
                                                    broke = false,
                                                    constant = 0;

                                                  for (
                                                    let i = 0;
                                                    i < ele.sequence.length;
                                                    i++
                                                  ) {
                                                    if (
                                                      ele.g_indices.includes(
                                                        i - constant
                                                      ) &&
                                                      ele.sequence[i] == "G"
                                                    ) {
                                                      x += "g";
                                                      constant += 1;
                                                      if (
                                                        constant === ele.numgs
                                                      ) {
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
                                                }
                                              ),
                                            ],
                                          };
                                        }
                                      );
                                    });
                                } else {
                                  setSecondSearch(`qgrs_${row.ncbi_access_num}`);
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

                                      setSecondSearchResult(
                                        (prevResult: any) => {
                                          return {
                                            type: "qgrs",
                                            result: [
                                              ...data.map(
                                                (ele: any, idx: number) => {
                                                  if (ele.numgs === 2) {
                                                    setSecondSearchResultSummary(
                                                      (prev) => ({
                                                        ...prev,

                                                        total: prev.total + 1,
                                                        two: prev.two + 1,
                                                      })
                                                    );
                                                  } else if (ele.numgs === 3) {
                                                    setSecondSearchResultSummary(
                                                      (prev) => ({
                                                        ...prev,

                                                        total: prev.total + 1,
                                                        three: prev.three + 1,
                                                      })
                                                    );
                                                  } else if (ele.numgs === 4) {
                                                    setSecondSearchResultSummary(
                                                      (prev) => ({
                                                        ...prev,

                                                        total: prev.total + 1,
                                                        four: prev.four + 1,
                                                      })
                                                    );
                                                  }

                                                  let x = "",
                                                    broke = false,
                                                    constant = 0;

                                                  for (
                                                    let i = 0;
                                                    i < ele.sequence.length;
                                                    i++
                                                  ) {
                                                    if (
                                                      ele.g_indices.includes(
                                                        i - constant
                                                      ) &&
                                                      ele.sequence[i] == "G"
                                                    ) {
                                                      x += "g";
                                                      constant += 1;
                                                      if (
                                                        constant === ele.numgs
                                                      ) {
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
                                                }
                                              ),
                                            ],
                                          };
                                        }
                                      );
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
                                firstSearch === `qgrs_${row.ncbi_access_num}`
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
                                firstSearch === `g4_${row.ncbi_access_num}` ||
                                secondSearch === `g4_${row.ncbi_access_num}`
                              }
                              onClick={async (_e) => {
                                if (firstSearch === null) {
                                  setFirstSearch(`g4_${row.ncbi_access_num}`);
                                  await axios
                                    .post("/api/g4hunter", {
                                      inputString: row.ncbi_access_num,
                                      windowSize: G4Options.windowSize,
                                      threshold: G4Options.threshold,
                                    })
                                    .then((res) => {
                                      setFirstSearchResultSummary({
                                        total: 0,
                                        two: 0,
                                        three: 0,
                                        four: 0,
                                      });

                                      const data = res.data.result;

                                      setFirstSearchResult((_prev: any) => {
                                        return {
                                          type: "g4",
                                          result: [
                                            ...data.map(
                                              (ele: any, idx: number) => {
                                                if (ele.numg === 2) {
                                                  setFirstSearchResultSummary(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      total: prev.total + 1,
                                                      two: prev.two + 1,
                                                    })
                                                  );
                                                } else if (ele.numg === 3) {
                                                  setFirstSearchResultSummary(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      total: prev.total + 1,
                                                      three: prev.three + 1,
                                                    })
                                                  );
                                                } else if (ele.numg === 4) {
                                                  setFirstSearchResultSummary(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      total: prev.total + 1,
                                                      four: prev.four + 1,
                                                    })
                                                  );
                                                }

                                                let x = "",
                                                  broke = false;

                                                for (
                                                  let i = 0;
                                                  i < ele.sequence.length;
                                                  i++
                                                ) {
                                                  if (
                                                    ele.sequence[i] === "G" &&
                                                    (ele.sequence[i - 1] ===
                                                      "G" ||
                                                      ele.sequence[i + 1] ===
                                                        "G")
                                                  ) {
                                                    x += "g";
                                                  } else {
                                                    x += ele["sequence"][i];
                                                  }
                                                  if (i == 50) {
                                                    // x += "  "
                                                  }
                                                }

                                                return {
                                                  ...ele,
                                                  id: idx + 1,
                                                  sequence: x,
                                                  score:
                                                    Math.round(
                                                      ele.score * 100
                                                    ) / 100,
                                                  numg: ele.numg + "G",
                                                };
                                              }
                                            ),
                                          ],
                                        };
                                      });
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                    });
                                } else {
                                  setSecondSearch(`g4_${row.ncbi_access_num}`);
                                  await axios
                                    .post("/api/g4hunter", {
                                      inputString: row.ncbi_access_num,
                                      windowSize: G4Options.windowSize,
                                      threshold: G4Options.threshold,
                                    })
                                    .then((res) => {
                                      setSecondSearchResultSummary({
                                        total: 0,
                                        two: 0,
                                        three: 0,
                                        four: 0,
                                      });

                                      const data = res.data.result;

                                      setSecondSearchResult((_prev: any) => {
                                        return {
                                          type: "g4",
                                          result: [
                                            ...data.map(
                                              (ele: any, idx: number) => {
                                                if (ele.numg === 2) {
                                                  setSecondSearchResultSummary(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      total: prev.total + 1,
                                                      two: prev.two + 1,
                                                    })
                                                  );
                                                } else if (ele.numg === 3) {
                                                  setSecondSearchResultSummary(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      total: prev.total + 1,
                                                      three: prev.three + 1,
                                                    })
                                                  );
                                                } else if (ele.numg === 4) {
                                                  setSecondSearchResultSummary(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      total: prev.total + 1,
                                                      four: prev.four + 1,
                                                    })
                                                  );
                                                }

                                                let x = "",
                                                  broke = false;

                                                for (
                                                  let i = 0;
                                                  i < ele.sequence.length;
                                                  i++
                                                ) {
                                                  if (
                                                    ele.sequence[i] === "G" &&
                                                    (ele.sequence[i - 1] ===
                                                      "G" ||
                                                      ele.sequence[i + 1] ===
                                                        "G")
                                                  ) {
                                                    x += "g";
                                                  } else {
                                                    x += ele["sequence"][i];
                                                  }
                                                  if (i == 50) {
                                                    // x += "  "
                                                  }
                                                }

                                                return {
                                                  ...ele,
                                                  id: idx + 1,
                                                  sequence: x,
                                                  score:
                                                    Math.round(
                                                      ele.score * 100
                                                    ) / 100,
                                                  numg: ele.numg + "G",
                                                };
                                              }
                                            ),
                                          ],
                                        };
                                      });
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
                                firstSearch === `g4_${row.ncbi_access_num}`
                                  ? setFirstSearch(null)
                                  : setSecondSearch(null)
                              }
                            >
                              Clear
                            </Button>
                          )}
                        </Td>
                      </Tr>
}
                  )}
                </Tbody>
              </Table>
            </TableContainer>
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
                    <Text sx={{ mr: 2, fontSize: 18 }}>Max Length</Text>

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
                        Please enter a max length between 10 and 45
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

                        setFirstSearchResultSummary({
                          total: 0,
                          two: 0,
                          three: 0,
                          four: 0,
                        });

                        setFirstSearchResult((prevResult: any) => {
                          return {
                            type: "qgrs",
                            result: [
                              ...data.map((ele: any, idx: number) => {
                                if (ele.numgs === 2) {
                                  setFirstSearchResultSummary((prev) => ({
                                    ...prev,

                                    total: prev.total + 1,
                                    two: prev.two + 1,
                                  }));
                                } else if (ele.numgs === 3) {
                                  setFirstSearchResultSummary((prev) => ({
                                    ...prev,

                                    total: prev.total + 1,
                                    three: prev.three + 1,
                                  }));
                                } else if (ele.numgs === 4) {
                                  setFirstSearchResultSummary((prev) => ({
                                    ...prev,

                                    total: prev.total + 1,
                                    four: prev.four + 1,
                                  }));
                                }

                                let x = "",
                                  broke = false,
                                  constant = 0;

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
                              }),
                            ],
                          };
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Analyze
                </Button>

                <TableContainer sx={{ mt: 10 }}>
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
                </TableContainer>

                <TableContainer sx={{ mt: 5 }}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Position</Th>
                        <Th>Length</Th>
                        <Th>Type of G-Quadraplex</Th>
                        <Th>G-Score</Th>
                        <Th>Sequence</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {firstSearchResult.result.map(
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
                              <Td>{row.start}</Td>
                              <Td>{row.len}</Td>
                              <Td>{row.numgs}</Td>
                              <Td>{row.score}</Td>
                              <Td>
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
                </TableContainer>
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
                          defaultValue={2}
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
                  // onClick={async () => await handleAnalyzeClick()}
                >
                  Analyze
                </Button>

                <TableContainer sx={{ mt: 10 }}>
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
                </TableContainer>

                <TableContainer sx={{ mt: 5 }}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Position</Th>
                        <Th>Length</Th>
                        <Th>Type of G-Quadraplex</Th>
                        <Th>G-Score</Th>
                        <Th>Sequence</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {firstSearchResult.result.map(
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
                              <Td>{row.start}</Td>
                              <Td>{row.len}</Td>
                              <Td>{row.numgs}</Td>
                              <Td>{row.score}</Td>
                              <Td>
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
                </TableContainer>
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
                    <Text sx={{ mr: 2, fontSize: 18 }}>Max Length</Text>

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
                        Please enter a max length between 10 and 45
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

                        setSecondSearchResultSummary({
                          total: 0,
                          two: 0,
                          three: 0,
                          four: 0,
                        });

                        setSecondSearchResult((prevResult: any) => {
                          return {
                            type: "qgrs",
                            result: [
                              ...data.map((ele: any, idx: number) => {
                                if (ele.numgs === 2) {
                                  setSecondSearchResultSummary((prev) => ({
                                    ...prev,

                                    total: prev.total + 1,
                                    two: prev.two + 1,
                                  }));
                                } else if (ele.numgs === 3) {
                                  setSecondSearchResultSummary((prev) => ({
                                    ...prev,

                                    total: prev.total + 1,
                                    three: prev.three + 1,
                                  }));
                                } else if (ele.numgs === 4) {
                                  setSecondSearchResultSummary((prev) => ({
                                    ...prev,

                                    total: prev.total + 1,
                                    four: prev.four + 1,
                                  }));
                                }

                                let x = "",
                                  broke = false,
                                  constant = 0;

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
                              }),
                            ],
                          };
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Analyze
                </Button>

                <TableContainer sx={{ mt: 10 }}>
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
                </TableContainer>

                <TableContainer sx={{ mt: 5 }}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Position</Th>
                        <Th>Length</Th>
                        <Th>Type of G-Quadraplex</Th>
                        <Th>G-Score</Th>
                        <Th>Sequence</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {secondSearchResult.result.map(
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
                              <Td>{row.start}</Td>
                              <Td>{row.len}</Td>
                              <Td>{row.numgs}</Td>
                              <Td>{row.score}</Td>
                              <Td>
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
                </TableContainer>
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
                          defaultValue={2}
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
                  // onClick={async () => await handleAnalyzeClick()}
                >
                  Analyze
                </Button>

                <TableContainer sx={{ mt: 10 }}>
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
                </TableContainer>

                <TableContainer sx={{ mt: 5 }}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Position</Th>
                        <Th>Length</Th>
                        <Th>Type of G-Quadraplex</Th>
                        <Th>G-Score</Th>
                        <Th>Sequence</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {secondSearchResult.result.map(
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
                              <Td>{row.start}</Td>
                              <Td>{row.len}</Td>
                              <Td>{row.numgs}</Td>
                              <Td>{row.score}</Td>
                              <Td>
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
                </TableContainer>
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
                      <Text sx={{ mr: 2, fontSize: 18 }}>Max Length</Text>

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
                          Please enter a max length between 10 and 45
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
                      mx: 8,
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

                          setFirstSearchResultSummary({
                            total: 0,
                            two: 0,
                            three: 0,
                            four: 0,
                          });

                          setFirstSearchResult((prevResult: any) => {
                            return {
                              type: "qgrs",
                              result: [
                                ...data.map((ele: any, idx: number) => {
                                  if (ele.numgs === 2) {
                                    setFirstSearchResultSummary((prev) => ({
                                      ...prev,

                                      total: prev.total + 1,
                                      two: prev.two + 1,
                                    }));
                                  } else if (ele.numgs === 3) {
                                    setFirstSearchResultSummary((prev) => ({
                                      ...prev,

                                      total: prev.total + 1,
                                      three: prev.three + 1,
                                    }));
                                  } else if (ele.numgs === 4) {
                                    setFirstSearchResultSummary((prev) => ({
                                      ...prev,

                                      total: prev.total + 1,
                                      four: prev.four + 1,
                                    }));
                                  }

                                  let x = "",
                                    broke = false,
                                    constant = 0;

                                  for (
                                    let i = 0;
                                    i < ele.sequence.length;
                                    i++
                                  ) {
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
                                }),
                              ],
                            };
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    Analyze
                  </Button>

                  <TableContainer sx={{ mt: 10 }}>
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
                  </TableContainer>

                  <TableContainer sx={{ mt: 5 }}>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Position</Th>
                          <Th>Length</Th>
                          <Th>Type of G-Quadraplex</Th>
                          <Th>G-Score</Th>
                          <Th>Sequence</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {firstSearchResult.result.map(
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
                                <Td>{row.start}</Td>
                                <Td>{row.len}</Td>
                                <Td>{row.numgs}</Td>
                                <Td>{row.score}</Td>
                                <Td>
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
                  </TableContainer>
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
                            defaultValue={2}
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
                      ml: 20,
                      mt: "25px",
                      width: "530px",
                    }}
                    // onClick={async () => await handleAnalyzeClick()}
                  >
                    Analyze
                  </Button>

                  <TableContainer sx={{ mt: 10 }}>
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
                  </TableContainer>

                  <TableContainer sx={{ mt: 5 }}>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Position</Th>
                          <Th>Length</Th>
                          <Th>Type of G-Quadraplex</Th>
                          <Th>G-Score</Th>
                          <Th>Sequence</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {firstSearchResult.result.map(
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
                                <Td>{row.start}</Td>
                                <Td>{row.len}</Td>
                                <Td>{row.numgs}</Td>
                                <Td>{row.score}</Td>
                                <Td>
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
                  </TableContainer>
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
                      <Text sx={{ mr: 2, fontSize: 18 }}>Max Length</Text>

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
                          Please enter a max length between 10 and 45
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
                      mx: 8,
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

                          setSecondSearchResultSummary({
                            total: 0,
                            two: 0,
                            three: 0,
                            four: 0,
                          });

                          setSecondSearchResult((prevResult: any) => {
                            return {
                              type: "qgrs",
                              result: [
                                ...data.map((ele: any, idx: number) => {
                                  if (ele.numgs === 2) {
                                    setSecondSearchResultSummary((prev) => ({
                                      ...prev,

                                      total: prev.total + 1,
                                      two: prev.two + 1,
                                    }));
                                  } else if (ele.numgs === 3) {
                                    setSecondSearchResultSummary((prev) => ({
                                      ...prev,

                                      total: prev.total + 1,
                                      three: prev.three + 1,
                                    }));
                                  } else if (ele.numgs === 4) {
                                    setSecondSearchResultSummary((prev) => ({
                                      ...prev,

                                      total: prev.total + 1,
                                      four: prev.four + 1,
                                    }));
                                  }

                                  let x = "",
                                    broke = false,
                                    constant = 0;

                                  for (
                                    let i = 0;
                                    i < ele.sequence.length;
                                    i++
                                  ) {
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
                                }),
                              ],
                            };
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    Analyze
                  </Button>

                  <TableContainer sx={{ mt: 10 }}>
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
                  </TableContainer>

                  <TableContainer sx={{ mt: 5 }}>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Position</Th>
                          <Th>Length</Th>
                          <Th>Type of G-Quadraplex</Th>
                          <Th>G-Score</Th>
                          <Th>Sequence</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {secondSearchResult.result.map(
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
                                <Td>{row.start}</Td>
                                <Td>{row.len}</Td>
                                <Td>{row.numgs}</Td>
                                <Td>{row.score}</Td>
                                <Td>
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
                  </TableContainer>
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
                            defaultValue={2}
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
                      ml: 20,
                      mt: "25px",
                      width: "530px",
                    }}
                    // onClick={async () => await handleAnalyzeClick()}
                  >
                    Analyze
                  </Button>

                  <TableContainer sx={{ mt: 10 }}>
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
                  </TableContainer>

                  <TableContainer sx={{ mt: 5 }}>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Position</Th>
                          <Th>Length</Th>
                          <Th>Type of G-Quadraplex</Th>
                          <Th>G-Score</Th>
                          <Th>Sequence</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {secondSearchResult.result.map(
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
                                <Td>{row.start}</Td>
                                <Td>{row.len}</Td>
                                <Td>{row.numgs}</Td>
                                <Td>{row.score}</Td>
                                <Td>
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
                  </TableContainer>
                </>
              )}
            </CardBody>
          </Card>
        </Stack>
      ) : null}
    </>
  );
};

export default G4Prediction;

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
  Link
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import {ExternalLinkIcon} from "@chakra-ui/icons"

const QGRS = () => {
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

        setRows((_prev: any[]) => {
          return [
            ...data.map((ele: any, idx: number) => {
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
          ];
        });

        setFetched(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setFetched(false);
      });
  };

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25, ml: 2, mb: 0 }}>QGRS Mapper</CardHeader>

        {/* <CardBody>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. At eos,
          beatae ipsum illo, aut voluptas deleniti, rerum id nesciunt facilis
          molestiae! Quidem asperiores cupiditate, magni non facilis ad eaque!
          Fugit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Similique dicta quod vitae dolore, commodi voluptatibus quaerat
          perferendis, tempora veritatis, laboriosam architecto! Quis, numquam
          at. Quidem enim nam dolores voluptatibus libero.
        </CardBody> */}
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
                      <Td sx={{ textAlign: "center" }}>{summary.total}</Td>
                      <Td sx={{ textAlign: "center" }}>{summary.two}</Td>
                      <Td sx={{ textAlign: "center" }}>{summary.three}</Td>
                      <Td sx={{ textAlign: "center" }}>{summary.four}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <TableContainer sx={{ mt: 10 }}>
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
                    {rows.map(
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
            </CardBody>
          ) : (
            <CardBody>No rows</CardBody>
          )}
        </Card>
      ) : null}
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardBody sx={{textAlign:"center"}}>
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
      <br /><br /><br /><br /><br /><br /><br /><br /><br />
    </>
  );
};

export default QGRS;

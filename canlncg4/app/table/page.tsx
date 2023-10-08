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
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const LncTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cancer_type = searchParams.get("cancer_type");
  const type = searchParams.get("type");
  const payload = searchParams.get("payload");

  const [data, setData] = useState<
    | {
        lncrna_name: string;
        cancer_name: string;
        methods: string;
        num_transcript_variants: string | number;
        pubmed_id: string;
        expression_pattern: string;
        aliases: string[];
      }[]
    | null
  >(null);

  useEffect(() => {
    axios
      .get("/api/tableDetails", {
        params: cancer_type
          ? { cancer_type }
          : { type, payload: payload?.trim() },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred");
      });
  }, []);

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25, mt: 2, ml: 2, mb: 0 }}>
          Search Results
        </CardHeader>
        <CardBody>
          {!data ? (
            <>Loading...</>
          ) : (
            <TableContainer whiteSpace="normal">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>LncRNA Name</Th>
                    <Th>Cancer Name</Th>
                    <Th>Expression Pattern</Th>
                    <Th sx={{ maxWidth: "200px" }}>Methods</Th>
                    <Th>Pubmed ID</Th>
                    <Th>G4 Prediction</Th>
                    <Th>Sub cellular{"\n"}localization</Th>
                    <Th
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordWrap: "break-word",
                        width: "100px",
                      }}
                    >
                      LncRNA Aliases
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((row) => {
                    let aliases = "";
                    let methods = "";
                    let x = 1;
                    let y = 1;
                    for (const method of row.methods.split(",")) {
                      methods += method.trim() + ", ";
                      if (x % 3 === 0) {
                        methods += "\n";
                      }
                      x += 1;
                    }

                    for (const alias of row.aliases) {
                      aliases += alias.trim() + ", ";
                      if (x % 3 === 0) {
                        aliases += "\n";
                      }
                      y += 1;
                    }

                    aliases = aliases.trim();
                    aliases = aliases.slice(0, aliases.length - 2);

                    return (
                      <Tr
                        key={row.lncrna_name + row.cancer_name + row.pubmed_id}
                      >
                        <Td>{row.lncrna_name}</Td>
                        <Td>{row.cancer_name}</Td>
                        <Td>{row.expression_pattern}</Td>
                        <Td>{row.methods}</Td>
                        <Td>
                          <Link
                            href={`https://pubmed.ncbi.nlm.nih.gov/${row.pubmed_id}/`}
                            target="_blank"
                            isExternal
                          >
                            {row.pubmed_id}
                            <ExternalLinkIcon sx={{ ml: 2 }} />
                          </Link>
                        </Td>
                        <Td>
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
                        <Td>
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
                        <Td
                          sx={{
                            // overflow: "hidden",
                            // textOverflow: "ellipsis",
                            wordWrap: "normal",
                            maxWidth: "200px",
                          }}
                        >
                          {aliases}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
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
            https://www.genecards.org
            <ExternalLinkIcon sx={{ ml: 2 }} />
          </Link>
          )
        </CardBody>
      </Card>
    </>
  );
};

export default LncTable;

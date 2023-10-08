"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Divider,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Button,
  Stack,
  Box,
  StackDivider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  LinkBox,
  LinkOverlay,
  Link,
} from "@chakra-ui/react";
// import { Search2Icon } from "@chakra-ui/icons";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@styles/home.module.css";

const Home = () => {
  const [searchString, setSearchString] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    lncrna_names: string[];
    cancer_names: string[];
    aliases: string[];
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (searchString.length >= 3) {
      setSearchLoading(true);
      axios
        .get("/api/search", { params: { searchString } })
        .then((res) => {
          const data = res.data;
          const lncrna_names = data.lncrna_names;
          const cancer_names = [];
          for (let i = 0; i < data.cancer_names.length; i++) {
            cancer_names.push(data.cancer_names[i].toLowerCase());
          }
          const aliases = data.aliases;

          setSearchLoading(false);
          setSearchResult({
            lncrna_names,
            cancer_names: Array.from(new Set(cancer_names)),
            aliases,
          });
        })
        .catch((err) => {
          setSearchLoading(false);
          setSearchResult(null);
          console.log(err);
          alert("An error occurred");
        });
    } else if (searchString === "") {
      setSearchResult(null);
    }
  }, [searchString]);

  return (
    <>
      <style jsx>{`
        path:hover {
          background-color: #00ffff !important;
          opacity: 0.3 !important;
          cursor: pointer;
        }
      `}</style>

      <Card
        sx={{
          mt: 5,
          mx: 7,
          height: 200,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: 0,
        }}
      >
        <Image
          style={{
            display: "block",
            marginTop: 0,
            marginBottom: 0,
            marginRight: 30,
          }}
          src="/logo_rectangle_new.png"
          alt="logo"
          // layout="fill"
          // objectFit="cover"
          width={760}
          height={540}
        />
      </Card>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>
          Welcome to the <span style={{ color: "#fc0000" }}>C</span>an
          <span style={{ color: "#fc0000" }}>L</span>nc
          <span style={{ color: "#fc0000" }}>G4</span> database
        </CardHeader>

        <Divider sx={{ mx: 5, width: "70%" }} />

        <CardBody>
          CanLncG4, an intricately curated repository, compiles experimentally
          validated associations between long non-coding RNAs (lncRNAs) and
          diverse human cancers, and their G4-forming potential. This resource
          utilizes meticulous meta-analyses of data from reputable databases and
          specialized tools, such as Lnc2cancer3.0, GeneCards, QGRS mapper,
          G4Hunter, LncATLAS, NPInter v4.0, LncTarD, G4IPDB, and QUADRatlas.
          CanLncG4 documents 17,666 entries establishing correlations between
          6,408 human lncRNAs (inclusive of transcript variants) and 15 distinct
          types of human cancer. The database furnishes a comprehensive G4
          prediction analysis for each transcript variant, categorizing the
          anticipated G4 types (2G, 3G, and 4G). Moreover, integrated standalone
          G4 prediction tools empower users to critically assess, categorize and
          compare G4 predictions for any given sequence. CanLncG4 also affords
          insights into the subcellular localization of catalogued lncRNAs
          across diverse cell lines and undertakes an exhaustive meta-analysis
          of interaction partners (RNA and Protein) linked to lncRNAs based on
          the most recent available data. Additionally, the database imparts
          information concerning the established G4 binding capabilities of
          proteins that interact with the catalogued lncRNAs. The development of
          CanLncG4 endeavours to standardize the assimilation of information
          regarding the G4-forming potential of dysregulated lncRNAs in human
          cancers, offering invaluable insights into both lncRNA interactions
          and G4-associated proteins.
          <Stack direction="row">
            <InputGroup sx={{ mt: 2.5 }}>
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch style={{ color: "#555555", fontSize: 20 }} />
              </InputLeftElement>
              <Input
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                sx={{ pl: 9, width: "85%" }}
                placeholder="Enter LncRNA name or cancer name..."
              />
            </InputGroup>
            <Link href="/advanced-search" sx={{ width: "20%", mt: 4 }}>
              <u>Advanced search</u>
            </Link>
          </Stack>
          <Text sx={{ mt: 2 }}>
            Example: LncRNA name: "
            <Link
              color="blue.500"
              href="/table?type=lncrna_name&payload=MALAT1"
            >
              <b>MALAT1</b>
            </Link>
            " or Cancer name: "
            <Link
              color="blue.500"
              href="/table?type=cancer_name&payload=colorectal%20cancer"
            >
              <b>Colorectal Cancer</b>
            </Link>
            "
          </Text>
          {searchString.length > 0 && searchString.length < 3 ? (
            <Text sx={{ mt: 2, ml: 5 }}>
              Please enter 3 characters or more to autocomplete.
            </Text>
          ) : null}
        </CardBody>
      </Card>

      {searchString.length >= 3 ? (
        <Card sx={{ mt: 3, mx: 7 }}>
          <CardHeader sx={{ fontSize: 20 }}>Search Results</CardHeader>
          <CardBody>
            {searchLoading ? (
              <>Loading</>
            ) : searchResult?.lncrna_names.length === 0 &&
              searchResult?.cancer_names.length === 0 &&
              searchResult?.aliases.length === 0 ? (
              <>Your search yielded no results.</>
            ) : (
              <Accordion allowToggle>
                {(searchResult?.lncrna_names &&
                  searchResult.lncrna_names?.length > 0) ||
                (searchResult?.aliases && searchResult.aliases?.length > 0) ? (
                  <AccordionItem
                    sx={{
                      border: "2px solid #dedede",
                      borderRadius: 7,
                      mb: 2,
                    }}
                  >
                    <AccordionButton
                      sx={{
                        backgroundColor: "#dedede",
                        _hover: { backgroundColor: "#dedede" },
                        borderTopRadius: 5,
                      }}
                    >
                      <Box flex={1} textAlign="left" fontSize={20}>
                        <b>LncRNA Names</b> (click to expand)
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel>
                      <Text sx={{ mt: 2 }}>
                        Select an option to see more details.
                      </Text>

                      <Divider sx={{ my: 2, width: "70%" }} />
                      <Stack sx={{ mt: 2, width: "60%", ml: 2 }}>
                        {searchResult.lncrna_names &&
                          searchResult.lncrna_names.map((name) => (
                            <Button
                              variant="ghost"
                              sx={{
                                fontSize: 16,
                                fontWeight: 400,
                              }}
                              key={name}
                              width="100%"
                              justifyContent="flex-start"
                              onClick={() =>
                                router.push(
                                  `/table?type=${encodeURIComponent(
                                    "lncrna_name"
                                  )}&payload=${encodeURIComponent(name)}`
                                )
                              }
                            >
                              {name}
                            </Button>
                          ))}
                        {searchResult?.aliases &&
                          searchResult?.aliases?.length > 0 &&
                          searchResult?.aliases.map((alias) =>
                            searchResult.lncrna_names.length > 0 ? (
                              searchResult.lncrna_names.find(
                                (name) =>
                                  name.toLowerCase().trim() ===
                                  alias.toLowerCase().trim()
                              ) ? null : (
                                <Button
                                  variant="ghost"
                                  sx={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                  }}
                                  key={alias}
                                  width="100%"
                                  justifyContent="flex-start"
                                  onClick={() =>
                                    router.push(
                                      `/table?type=${encodeURIComponent(
                                        "lncrna_alias"
                                      )}&payload=${encodeURIComponent(alias)}`
                                    )
                                  }
                                >
                                  {alias}
                                </Button>
                              )
                            ) : (
                              <Button
                                variant="ghost"
                                sx={{
                                  fontSize: 16,
                                  fontWeight: 400,
                                }}
                                key={alias}
                                width="100%"
                                justifyContent="flex-start"
                                onClick={() =>
                                  router.push(
                                    `/table?type=${encodeURIComponent(
                                      "lncrna_alias"
                                    )}&payload=${encodeURIComponent(alias)}`
                                  )
                                }
                              >
                                {alias}
                              </Button>
                            )
                          )}
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                ) : null}

                {searchResult?.cancer_names &&
                  searchResult?.cancer_names?.length > 0 && (
                    <AccordionItem
                      sx={{
                        border: "2px solid #dedede",
                        borderRadius: 7,
                        mb: 2,
                      }}
                    >
                      <AccordionButton
                        sx={{
                          backgroundColor: "#dedede",
                          _hover: { backgroundColor: "#dedede" },
                          borderTopRadius: 5,
                        }}
                      >
                        <Box flex={1} textAlign="left" fontSize={20}>
                          <b>Cancer Names</b> (click to expand)
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <AccordionPanel>
                        <Text sx={{ mt: 2 }}>
                          Select an option to see more details.
                        </Text>

                        <Divider sx={{ my: 2, width: "70%" }} />
                        <Stack sx={{ mt: 2, width: "60%", ml: 2 }}>
                          {searchResult.cancer_names.map((name) => {
                            const words = name.split(" ");
                            const newWords = [];
                            for (const word of words) {
                              newWords.push(
                                word.charAt(0).toUpperCase() + word.slice(1)
                              );
                            }

                            const finalWord = newWords.join(" ");

                            return (
                              <Button
                                variant="ghost"
                                sx={{
                                  fontSize: 16,
                                  fontWeight: 400,
                                }}
                                key={name}
                                width="100%"
                                justifyContent="flex-start"
                                onClick={() =>
                                  router.push(
                                    `/table?type=${encodeURIComponent(
                                      "cancer_name"
                                    )}&payload=${encodeURIComponent(name)}`
                                  )
                                }
                              >
                                {finalWord}
                              </Button>
                            );
                          })}
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  )}

                {/* {searchResult?.aliases && searchResult?.aliases?.length > 0 && (
                  <AccordionItem
                    sx={{ border: "2px solid #dedede", borderRadius: 7 }}
                  >
                    <AccordionButton
                      sx={{
                        backgroundColor: "#dedede",
                        _hover: { backgroundColor: "#dedede" },
                        borderTopRadius: 5,
                      }}
                    >
                      <Box flex={1} textAlign="left" fontSize={20}>
                        <b>LncRNA Aliases</b> (click to expand)
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel>
                      <Text sx={{ mt: 2 }}>
                        Select an option to see more details.
                      </Text>

                      <Divider sx={{ my: 2, width: "70%" }} />
                      <Stack sx={{ mt: 2, width: "60%", ml: 2 }}>
                        {searchResult.aliases.map((alias) => (
                          <Button
                            variant="ghost"
                            sx={{
                              fontSize: 16,
                              fontWeight: 400,
                            }}
                            key={alias}
                            width="100%"
                            justifyContent="flex-start"
                            onClick={() =>
                              router.push(
                                `/table?type=${encodeURIComponent(
                                  "lncrna_alias"
                                )}&payload=${encodeURIComponent(alias)}`
                              )
                            }
                          >
                            {alias}
                          </Button>
                        ))}
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                )} */}
              </Accordion>
            )}
          </CardBody>
        </Card>
      ) : null}

      <Card sx={{ mt: 5, mx: 7 }}>
        <CardBody sx={{ fontSize: 25 }}>
          Tissue-based cancer-lncRNA distribution
        </CardBody>
      </Card>

      <Stack direction="row">
        <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
          <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
            Human - Male
          </CardHeader>
          <CardBody>
            <Box
              sx={{
                position: "relative",
                width: "90%",
                ml: 10,
              }}
              className={styles.parent}
            >
              <img src="/male_new.png" alt="male" width="100%" />
              <object
                data="/male_trace_new.svg"
                type="image/svg+xml"
                // width="500"
                // height="600"
                width="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              ></object>
            </Box>
          </CardBody>
        </Card>
        {/* <Card sx={{ mt: 5, mr: 7, width: "100%" }}> */}
        <Card sx={{ mt: 5, mr: 5, width: "100%" }}>
          <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
            Human - Female
          </CardHeader>
          <CardBody>
            <Box
              sx={{
                position: "relative",
                width: "90%",
                ml: 10,
              }}
              className={styles.parent}
            >
              <img src="/female_new.png" alt="female" width="100%" />
              <object
                data="/female_trace_new.svg"
                type="image/svg+xml"
                // width="500"
                // height="600"
                width="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
              ></object>
            </Box>
          </CardBody>
        </Card>
      </Stack>

      {/* <Card sx={{ mt: 5, mx: 7, mb: 5 }}>
        {/* <CardHeader>
          <Stack direction="column"><Text sx={{fontSize:25}}>Tissue-based cancer-lncRNA distribution</Text><Stack direction="row" sx={{textAlign:"center"}}>
            <Text sx={{width:"100%", mt:2, fontSize:25}}>Male</Text>
            <Text sx={{width:"100%",mt:2, fontSize: 25, mr: 20}}>Female</Text>
          </Stack></Stack>
          
        </CardHeader>
        <CardBody sx={{ display: "flex" }}>
          <Stack
            direction="row"
            sx={{
              width: "100%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              ml: "80px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "50%",
                ml: 10,
              }}
              className={styles.parent}
            >
              <img src="/male.png" alt="male" width={500} height={500} />
              <object
                data="/male_trace.svg"
                type="image/svg+xml"
                width="500"
                height="500"
                style={{ position: "absolute", top: 55, left: 0 }}
              ></object>
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "50%",
                border: "1px solid black",
                borderRadius: "7px",
              }}
              className={styles.parent}
            >
              <img src="/female_new.png" alt="male" width={500} height={500} />
              <object
                data="/female_trace_new.svg"
                type="image/svg+xml"
                width="500"
                height="500"
                style={{ position: "absolute", top: 52, left: 0 }}
              ></object>
            </Box>
          </Stack>
        </CardBody>
      </Card> */}
    </>
  );
};

export default Home;

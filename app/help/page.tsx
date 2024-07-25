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
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
// import { Search2Icon } from "@chakra-ui/icons";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@styles/home.module.css";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

const Help = () => {
  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader>
          <Text sx={{ fontSize: 30 }}>Help Section</Text>
        </CardHeader>
        <CardBody>
          <Tabs isFitted variant="enclosed-colored">
            <TabList>
              <Tab>Home</Tab>
              <Tab>Search Results</Tab>
              <Tab>G4-Prediction</Tab>
              <Tab>Subcellular Localization</Tab>
              <Tab>QGRS Mapper</Tab>
              <Tab>G4Hunter</Tab>
              <Tab>LncRNA-G4 Interacting Partners</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    mb: 2,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h1.png" alt="help1" width="100%" />
                </Box>
                1. The navigation bar provides access to different sections of the database.
                <br />
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h2.png" alt="help1" width="100%" />
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h3.png" alt="help1" width="100%" />
                </Box>
                2. Enter the lncRNA or the cancer name to search the database.
                <br />
                3. Click “Advanced search” to search the database by entering the parameters, including lncRNA name, cancer name, expression pattern, and transcript variants.
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h4.png" alt="help1" width="100%" />
                </Box>
                4. Click the “Organ” or the “Name of the Organ” to search the database for its cancer-lncRNA associations.
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h5.png" alt="help1" width="100%" />
                </Box>
                5. Results of the searched lncRNA or cancer.
                <br />
                6. Click “Details” to check the G4-prediction or Subcellular localization.
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h6.png" alt="help1" width="100%" />
                </Box>
                 <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h7.png" alt="help1" width="100%" />
                </Box>
                7. List of transcript variants of the searched lncRNA and their NCBI accession IDs.
                <br />
                8. Click “View” to select the G4-prediction tool.
                <br />
                9. Change the parameters for G4-prediction, if required.
                <br />
                10. Click “Analyse” to predict the G4-formation potential.
                <br />
                11. Result of G4-prediction with anticipated type of G4s.
                <br />
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h8.png" alt="help1" width="100%" />
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h9.png" alt="help1" width="100%" />
                </Box>
                12. RCI and Expression values of the searched lncRNA.
                <br />
                13. Reference lncRNAs.
                <br />
                14. RCI distribution of the searched lncRNA.
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h10.png" alt="help1" width="100%" />
                </Box>
                15. Enter the nucleotide sequence or the NCBI accession ID for which G4-prediction is required.
                <br />
                16. Change the parameters for G4-prediction, if required.
                <br />
                17. Click “Analyse” to predict the G4-formation potential.
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h11.png" alt="help1" width="100%" />
                </Box>
                18. Enter the nucleotide sequence or the NCBI accession ID for which G4-prediction is required.
                <br />
                19. Change the parameters for G4-prediction, if required.
                <br />
                20. Click “Analyse” to predict the G4-formation potential.
              </TabPanel>



              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h12.png" alt="lnchelp1" width="100%" />
                </Box>
                21. Enter the name of lncRNA whose interacting partners need to be determined.
                <br />
                22. Click “Search” to search the lncRNA-interacting partners.
                <br />
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h13.png" alt="lnchelp1" width="100%" />
                </Box>
                23. Expand the respective section to view lncRNA-protein or lncRNA-RNA interaction from NPInter or LncTarD.

                <br />
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h14.png" alt="lnchelp1" width="100%" />
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h15.png" alt="help1" width="100%" />
                </Box>
                24. Results of the searched lncRNA-protein interactions from NPInter.
                <br />
                25. Click “Details” to determine the G4-binding potential of a protein interacting with the searched lncRNA.
                <br />
                26. Results of G4-binding potential of the selected protein.
                <br />
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help/h16.png" alt="lnchelp1" width="100%" />
                </Box>
                27. Results of the searched lncRNA-RNA interactions from NPInter.
                <br />
                Follow steps 23-26 for the lncRNA-protein and lncRNA-RNA interactions from LncTarD.
                
                
              </TabPanel>



            </TabPanels>
          </Tabs>

          {/* <OrderedList>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader
                  sx={{ fontSize: 25, textAlign: "center" }}
                ></CardHeader>
                <CardBody>
                  <ListItem>
                    Navigation bar provides access to the main functions of the
                    database.
                  </ListItem>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h1.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h2.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h3.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <ListItem>. A quick search for lncRNA or cancer.</ListItem>

            <ListItem>
              . Advanced search to search the lncRNA and/ or cancer using
              parameters including, expression pattern, transcript variants and
              coding ability.
            </ListItem>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h4.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <ListItem>
              Click the organ or the name to open their respective associated
              lncRNAs.
            </ListItem>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h5.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <ListItem>Result of the searched lncRNA</ListItem>
            <ListItem>
              {" "}
              Click Details to check the G4 prediction or Subcellular
              localization
            </ListItem>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h6.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <ListItem>List of transcript variants of search lncRNA.</ListItem>
            <ListItem>Click View to select the G4 prediction tool.</ListItem>
            <ListItem>
              Change the parameters for G4 prediction, if required and click
              Analyze.
            </ListItem>
            <ListItem>Result of G4 prediction with types of G4</ListItem>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h7.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <ListItem>
              RCI and expression values of the searched lncRNA.
            </ListItem>
            <ListItem>Reference lncRNAs.</ListItem>
            <ListItem>RCI distribution of the searched lncRNA.</ListItem>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h8.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h9.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>
            <ListItem>
              Enter the sequence of RNA for which G4 prediction is required.
            </ListItem>
            <ListItem>Enter the parameters for G4 prediction</ListItem>
            <ListItem>
              Click Analyze to predict the G4 formation potential.
            </ListItem>
            <Stack direction="row">
              <Card sx={{ mt: 0, ml: 0, mr: 5, width: "100%" }}>
                <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                  
                </CardHeader>
                <CardBody>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      mx: 0,
                    }}
                    className={styles.parent}
                  >
                    <img src="/h10.png" alt="help1" width="100%" />
                  </Box>
                </CardBody>
              </Card>
            </Stack>

            <ListItem>
              Enter the sequence of RNA for which G4 prediction is required.
            </ListItem>
            <ListItem>Enter the parameters for G4 prediction.</ListItem>
            <ListItem>
              Click Analyze to predict the G4 formation potential.
            </ListItem>
          </OrderedList> */}
          <br />
          <br />
          {/* <Stack direction="row">
            <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
              <CardHeader sx={{ fontSize: 5, textAlign: "center" }}>
              </CardHeader>
              <CardBody>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help1.jpg" alt="help1" width="100%" />
                </Box>
              </CardBody>
            </Card>
          </Stack>
          <Stack direction="row">
            <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
              <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                
              </CardHeader>
              <CardBody>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help2.jpg" alt="help1" width="100%" />
                </Box>
              </CardBody>
            </Card>
          </Stack>
          <Stack direction="row">
            <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
              <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                
              </CardHeader>
              <CardBody>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help3.jpg" alt="help1" width="100%" />
                </Box>
              </CardBody>
            </Card>
          </Stack>
          <Stack direction="row">
            <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
              <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                
              </CardHeader>
              <CardBody>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help4.jpg" alt="help1" width="100%" />
                </Box>
              </CardBody>
            </Card>
          </Stack>

          <Stack direction="row">
            <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
              <CardHeader sx={{ fontSize: 25, textAlign: "center" }}>
                
              </CardHeader>
              <CardBody>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/help5.jpg" alt="help1" width="100%" />
                </Box>
              </CardBody>
            </Card>
          </Stack> */}
        </CardBody>
      </Card>
    </>
  );
};

export default Help;

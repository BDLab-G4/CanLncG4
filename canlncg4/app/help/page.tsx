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
              <Tab>G4 Prediction</Tab>
              <Tab>Subcellular Localization</Tab>
              <Tab>QGRS Mapper</Tab>
              <Tab>G4Hunter</Tab>
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
                  <img src="/h1.png" alt="help1" width="100%" />
                </Box>
                1. Navigation bar provides access to the main functions of the
                database.
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
                2. A quick search for lncRNA or cancer.
                <br />
                3. Advanced search to search the lncRNA and/ or cancer using
                parameters including, expression pattern, transcript variants
                and coding ability.
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
                4. Click the organ or the name to open their respective
                associated lncRNAs.
                
              </TabPanel>
              <TabPanel><Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/h5.png" alt="help1" width="100%" />
                </Box>
                5. Result of the searched lncRNA
                <br />
                6. Click Details to check the G4 prediction or Subcellular
                localization
                
              </TabPanel>
              <TabPanel><Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/h6.png" alt="help1" width="100%" />
                </Box>
                7. List of transcript variants of search lncRNA.
                <br />
                8. Click View to select the G4 prediction tool.
                <br />
                9. Change the parameters for G4 prediction, if required and
                click Analyze.
                <br />
                10. Result of G4 prediction with types of G4.
                
              </TabPanel>
              <TabPanel><Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/h7.png" alt="help1" width="100%" />
                </Box>
                11. RCI and expression values of the searched lncRNA.
                <br />
                12. Reference lncRNAs.
                <br />
                13. RCI distribution of the searched lncRNA.
                
              </TabPanel>
              <TabPanel><Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                  }}
                  className={styles.parent}
                >
                  <img src="/h9.png" alt="help1" width="100%" />
                </Box>
                14. Enter the sequence of RNA for which G4 prediction is
                required.
                <br />
                15. Enter the parameters for G4 prediction
                <br />
                16. Click Analyze to predict the G4 formation potential.
                
              </TabPanel>
              <TabPanel>
                17. Enter the sequence of RNA for which G4 prediction is
                required.
                <br />
                18. Enter the parameters for G4 prediction.
                <br />
                19. Click Analyze to predict the G4 formation potential.
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

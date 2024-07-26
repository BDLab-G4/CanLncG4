"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";
import styles from "@styles/home.module.css";

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
                <Box sx={{ position: "relative", width: "100%", mx: 0, my: 2 }} className={styles.parent}>
                  <Image src="/help2/h1.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  1. The navigation bar provides access to different sections of the database.
                </Text>
                <Box sx={{ position: "relative", width: "100%", mx: 0, my: 2 }} className={styles.parent}>
                  <Image src="/help2/h2.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Box sx={{ position: "relative", width: "100%", mx: 0, my: 2 }} className={styles.parent}>
                  <Image src="/help2/h3.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  2. Enter the lncRNA or the cancer name to search the database.
                  <br />
                  3. Click “Advanced search” to search the database by entering the parameters, including lncRNA name,
                  cancer name, expression pattern, and transcript variants.
                </Text>
                <Box sx={{ position: "relative", width: "100%", mx: 0, my: 2 }} className={styles.parent}>
                  <Image src="/help2/h4.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  4. Click the “Organ” or the “Name of the Organ” to search the database for its cancer-lncRNA associations.
                </Text>
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h5.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  5. Results of the searched lncRNA or cancer.
                  <br />
                  6. Click “Details” to check the G4-prediction or Subcellular localization.
                </Text>
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h6.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h7.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  7. List of transcript variants of the searched lncRNA and their NCBI accession IDs.
                  <br />
                  8. Click “View” to select the G4-prediction tool.
                  <br />
                  9. Change the parameters for G4-prediction, if required.
                  <br />
                  10. Click “Analyse” to predict the G4-formation potential.
                  <br />
                  11. Result of G4-prediction with anticipated type of G4s.
                </Text>
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h8.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h9.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  12. RCI and Expression values of the searched lncRNA.
                  <br />
                  13. Reference lncRNAs.
                  <br />
                  14. RCI distribution of the searched lncRNA.
                </Text>
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h10.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  15. Enter the nucleotide sequence or the NCBI accession ID for which G4-prediction is required.
                  <br />
                  16. Change the parameters for G4-prediction, if required.
                  <br />
                  17. Click “Analyse” to predict the G4-formation potential.
                </Text>
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h11.png" alt="help1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  18. Enter the nucleotide sequence or the NCBI accession ID for which G4-prediction is required.
                  <br />
                  19. Change the parameters for G4-prediction, if required.
                  <br />
                  20. Click “Analyse” to predict the G4-formation potential.
                </Text>
              </TabPanel>
              <TabPanel>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h12.png" alt="lnchelp1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  21. Enter the name of lncRNA whose interacting partners need to be determined.
                  <br />
                  22. Click “Search” to search the lncRNA-interacting partners.
                </Text>
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h13.png" alt="lnchelp1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  23. Expand the respective section to view lncRNA-protein or lncRNA-RNA interactions from NPInter or
                  LncTarD.
                </Text>
                <br />
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h14.png" alt="lnchelp1" layout="responsive" width={1000} height={300} />
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h15.png" alt="lnchelp1" layout="responsive" width={1000} height={300} />
                </Box>


                <Text>
                  24. Results of the searched lncRNA-protein interactions from NPInter.
                  <br />
                  25. Click “Details” to determine the G4-binding potential of a protein interacting with the searched
                  lncRNA.
                  <br />
                  26. Results of G4-binding potential of the selected protein.
                </Text>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    mx: 0,
                    my: 2,
                  }}
                  className={styles.parent}
                >
                  <Image src="/help2/h16.png" alt="lnchelp1" layout="responsive" width={1000} height={300} />
                </Box>
                <Text>
                  27. Result of the searched lncRNA-RNA interactions from NPInter.
                  <br />
                  Follow steps 23-26 for the lncRNA-Protein and lncRNA-RNA interactions from LncTarD.
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default Help;
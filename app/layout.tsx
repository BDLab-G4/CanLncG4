import { NavBar } from "@components/NavBar";
import { Providers } from "@components/Provider";
import "@styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Box, Text, Link } from "@chakra-ui/react";
// import { NavBar as NavBarNew } from "@components/NavBar_new";
import { CssBaseline } from "@mui/material";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CanLncG4",
  description:
    "CanLncG4, an intricately curated repository, compiles experimentally validated associations between long non-coding RNAs (lncRNAs) and diverse human cancers, and their G4-forming potential. This resource utilizes meticulous meta-analyses of data from reputable databases and specialized tools, such as Lnc2cancer3.0, GeneCards, QGRS mapper, G4Hunter, LncATLAS, NPInter v4.0, LncTarD, G4IPDB, and QUADRatlas. CanLncG4 documents 17,666 entries establishing correlations between 6,408 human lncRNAs (inclusive of transcript variants) and 15 distinct types of human cancer. The database furnishes a comprehensive G4 prediction analysis for each transcript variant, categorizing the anticipated G4 types (2G, 3G, and 4G). Moreover, integrated standalone G4 prediction tools empower users to critically assess, categorize and compare G4 predictions for any given sequence. CanLncG4 also affords insights into the subcellular localization of catalogued lncRNAs across diverse cell lines and undertakes an exhaustive meta-analysis of interaction partners (RNA and Protein) linked to lncRNAs based on the most recent available data. Additionally, the database imparts information concerning the established G4 binding capabilities of proteins that interact with the catalogued lncRNAs. The development of CanLncG4 endeavours to standardize the assimilation of information regarding the G4-forming potential of dysregulated lncRNAs in human cancers, offering invaluable insights into both lncRNA interactions and G4-associated proteins.",
};

export const viewport: Metadata = {
  viewport: {
    initialScale: 1,
    width: '1024', // Force the width to 1024 to mimic desktop mode
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="favicon.ico" />
        <meta name="viewport" content="width=1024, initial-scale=1" />
      </Head>
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {/* <NavBarNew />
          <CssBaseline /> */}

          {children}
          <Box
            sx={{
              mt: 10,
              backgroundColor: "#000000",
              width: "100%",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Adjusted from center to space-between
              color: "#ffffff",
              paddingX: 2, // Add some padding on the X-axis for better visual appearance
            }}
          >
            <Text sx={{ fontSize: 15, textAlign: "left", flexGrow: 1 }} pl={20}>
              Facilitated by{" "}
              <Link href="https://iitgn.ac.in" target="_blank">
                Indian Institute of Technology Gandhinagar (IITGN)
              </Link>
            </Text>
            <Text sx={{ fontSize: 15, textAlign: "right", flexGrow: 1 }} pr={20}>
              <Link href="/legal-compliances/" target="_blank">
                Legal Compliance
              </Link>
            </Text>
          </Box>
        </Providers>
      </body>
    </html>
  );
}

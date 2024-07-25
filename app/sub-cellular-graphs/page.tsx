"use client"

import { Card, CardBody, CardHeader, Image, Text, Link, Box } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";

const SubCellularPage = () => {
    const searchParams = useSearchParams();
    const lncrna_name = searchParams.get("lncrna_name");

    return (
        <>
            <Card my={5} mx={{ base: 2, md: 7 }}>
                <CardHeader fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
                    Plot 1 - Cytoplasmic/Nuclear localisation: RCI and Expression values (all cell types)
                </CardHeader>
                <CardBody>
                    <Box display="flex" justifyContent="center">
                        <Image maxW="100%" src={`/subcellular-graphs/${lncrna_name}_ratio.png`} />
                    </Box>
                </CardBody>
            </Card>
            <Card my={5} mx={{ base: 2, md: 7 }}>
                <CardHeader fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
                    Plot 2 - Cytoplasmic/Nuclear Localisation: RCI distribution (all cell types)
                </CardHeader>
                <CardBody textAlign="center">
                    <Text fontSize={{ base: "md", md: "lg" }}>
                        Note: In the next plot <code style={{ color: "red" }}>n</code> indicates the total number of genes in each group and <code style={{ color: "red" }}>m</code> the median RCI value per group. The group percentile corresponding to each gene is also displayed next to the gene point.
                    </Text>
                    <Box display="flex" justifyContent="center" mt={5}>
                        <Image maxW="100%" src={`/subcellular-graphs/${lncrna_name}_dist.png`} />
                    </Box>
                </CardBody>
            </Card>
            <Card my={5} mx={{ base: 2, md: 7 }}>
                <CardBody textAlign="center">
                    Data curated from lncATLAS (
                    <Link href="https://lncatlas.crg.eu/" target="_blank" isExternal>
                        https://lncatlas.crg.eu
                        <ExternalLinkIcon ml={2} />
                    </Link>
                    )
                </CardBody>
            </Card>
        </>
    );
}

export default SubCellularPage;

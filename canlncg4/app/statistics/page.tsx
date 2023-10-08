import { Card, CardHeader, CardBody } from "@chakra-ui/react";
import Image from "next/image";

const Statistics = () => {
  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>Statistics</CardHeader>
      </Card>

      <Card
        sx={{
          mt: 5,
          mx: 7,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardBody>
          <Image
            alt="1"
            width={1000}
            height={1000}
            src="/statistics/Graph 1_Total LncRNAs (including transcript variants)-cancer associations in different cancers.png"
          />
        </CardBody>
      </Card>
      <Card
        sx={{
          mt: 5,
          mx: 7,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardBody>
          <Image
            alt="2"
            width={1000}
            height={1000}
            src="/statistics/Graph 2_LncRNAs (including transcript variants) involded in different cancers.png"
          />
        </CardBody>
      </Card>
      <Card
        sx={{
          mt: 5,
          mx: 7,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardBody>
          <Image
            alt="3"
            width={1000}
            height={1000}
            src="/statistics/Graph 3_G4-forming lncRNAs in different cancers (QGRS mapper prediction).png"
          />
        </CardBody>
      </Card>
      <Card
        sx={{
          mt: 5,
          mx: 7,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardBody>
          <Image
            alt="4"
            width={1000}
            height={1000}
            src="/statistics/Graph 4_G4-forming lncRNAs in different cancers (G4Hunter prediction, threshold-0.9).png"
          />
        </CardBody>
      </Card>
      <Card
        sx={{
          mt: 5,
          mx: 7,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardBody>
          <Image
            alt="5"
            width={1000}
            height={1000}
            src="/statistics/Graph 5_G4-forming lncRNAs in different cancers (G4Hunter prediction, threshold-1.4).png"
          />
        </CardBody>
      </Card>
    </>
  );
};

export default Statistics;

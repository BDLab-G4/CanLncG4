import { Card, CardHeader, CardBody, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const Downloads = () => {
  const cancerData = [
  { name: "All cancer-LncRNA G4s data", downloadLink: "./downloads/All%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Blood cancer-LncRNA G4s data", downloadLink: "./downloads/Blood%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Bone cancer-LncRNA G4s data", downloadLink: "./downloads/Bone%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Brain cancer-LncRNA G4s data", downloadLink: "./downloads/Brain%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Breast cancer-LncRNA G4s data", downloadLink: "./downloads/Breast%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Cervical cancer-LncRNA G4s data", downloadLink: "./downloads/Cervical%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Colorectal cancer-LncRNA G4s data", downloadLink: "./downloads/Colorectal%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Gastric cancer-LncRNA G4s data", downloadLink: "./downloads/Gastric%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Head and neck cancer-LncRNA G4s data", downloadLink: "./downloads/Head%20and%20neck%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Liver cancer-LncRNA G4s data", downloadLink: "./downloads/Liver%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Lung cancer-LncRNA G4s data", downloadLink: "./downloads/Lung%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Ovarian cancer-LncRNA G4s data", downloadLink: "./downloads/Ovarian%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Prostate cancer-LncRNA G4s data", downloadLink: "./downloads/Prostate%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Skin cancer-LncRNA G4s data", downloadLink: "./downloads/Skin%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Testicular cancer-LncRNA G4s data", downloadLink: "./downloads/Testicular%20cancer-LncRNA%20G4s%20data.xlsx" },
  { name: "Uterine cancer-LncRNA G4s data", downloadLink: "./downloads/Uterine%20cancer-LncRNA%20G4s%20data.xlsx" }
];

  return (
    <Card mt={5} mx={7}>
      <CardHeader fontSize={25}>Downloads</CardHeader>
      <CardBody>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Sr. No.</Th>
              <Th>Name of Database</Th>
              <Th>Download Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cancerData.map((item, index) => (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{item.name}</Td>
                <Td>
                  <a href={item.downloadLink} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default Downloads;

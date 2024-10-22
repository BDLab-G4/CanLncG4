import { Card, CardHeader, CardBody, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const Downloads = () => {
  const cancerData = [
  { name: "All cancer-LncRNA G4s data", downloadLink: "./downloads/1. All cancer-LncRNA G4s dataset.xlsx" },
  { name: "Blood cancer-LncRNA G4s data", downloadLink: "./downloads/2. Blood Cancer-LncRNA G4s dataset.xlsx" },
  { name: "Bone cancer-LncRNA G4s data", downloadLink: "./downloads/3. Bone Cancer-LncRNA G4s dataset.xlsx" },
  { name: "Brain cancer-LncRNA G4s data", downloadLink: "./downloads/4. Brain Cancer-LncRNA G4s dataset.xlsx" },
  { name: "Breast cancer-LncRNA G4s data", downloadLink: "./downloads/5. Breast Cancer-LncRNA G4s dataset.xlsx" },
  { name: "Cervical cancer-LncRNA G4s data", downloadLink: "./downloads/6. Cervical cancer-LncRNA G4s dataset.xlsx" },
  { name: "Colorectal cancer-LncRNA G4s data", downloadLink: "./downloads/7. Colorectal cancer-LncRNA G4s dataset.xlsx" },
  { name: "Gastric cancer-LncRNA G4s data", downloadLink: "./downloads/8. Gastric cancer-LncRNA G4s dataset.xlsx" },
  { name: "Head and neck cancer-LncRNA G4s data", downloadLink: "./downloads/9. Head and neck cancer-LncRNA G4s dataset.xlsx" },
  { name: "Liver cancer-LncRNA G4s data", downloadLink: "./downloads/10. Liver cancer-LncRNA G4s dataset.xlsx" },
  { name: "Lung cancer-LncRNA G4s data", downloadLink: "./downloads/11. Lung cancer-LncRNA G4s dataset.xlsx" },
  { name: "Ovarian cancer-LncRNA G4s data", downloadLink: "./downloads/12. Ovarian cancer-LncRNA G4s dataset.xlsx" },
  { name: "Prostate cancer-LncRNA G4s data", downloadLink: "./downloads/13. Prostate cancer-LncRNA G4s dataset.xlsx" },
  { name: "Skin cancer-LncRNA G4s data", downloadLink: "./downloads/14. Skin Cancer-LncRNA G4s dataset.xlsx" },
  { name: "Testicular cancer-LncRNA G4s data", downloadLink: "./downloads/15. Testicular Cancer-LncRNA G4s dataset.xlsx" },
  { name: "Uterine cancer-LncRNA G4s data", downloadLink: "./downloads/16. Uterine Cancer-LncRNA G4s dataset.xlsx" },
  { name: "LncRNA-Protein Interactions data_NPInter data", downloadLink: "./downloads/17. LncRNA-Protein Interactions dataset_NPInter.xlsx" },
  { name: "LncRNA-Protein Interactions data_LncTarD data", downloadLink: "./downloads/18. LncRNA-Protein Interactions dataset_LncTarD.xlsx" },
  { name: "LncRNA-RNA Interactions data_NPInter data", downloadLink: "./downloads/19. LncRNA-RNA Interactions dataset_NPInter.xlsx" },
  { name: "LncRNA-RNA Interactions data_LncTarD data", downloadLink: "./downloads/20. LncRNA-RNA Interactions dataset_LncTarD.xlsx" },
  { name: "RG4BP data_QUADRatlas data", downloadLink: "./downloads/21. RG4BP dataset_QUADRatlas.xlsx" },
  { name: "RG4BP data_G4IPDB data", downloadLink: "./downloads/22. RG4BP dataset_G4IPDB.xlsx" },
  { name: "RG4BP data_Literature mining data", downloadLink: "./downloads/23. RG4BP dataset_Literature mining.xlsx" }
];

  return (
    <Card mt={5} mx={7}>
      <CardHeader fontSize={25}>Downloads</CardHeader>
      <CardBody>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Sr. No.</Th>
              <Th>Name of Datasets</Th>
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

"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Stack,
  Input,
  Select,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

const AdvancedSearch = () => {
  const [lncrnaOptions, setLncrnaOptions] = useState(null);
  const [cancerOptions, setCancerOptions] = useState(null);
  const [lncrna, setLncrna] = useState(null);
  const [cancer, setCancer] = useState(null);
  const [expressionPattern, setExpressionPattern] = useState("null");
  const [numOfTranscriptVariants, setNumOfTranscriptVariants] = useState("");
  const [autocompleteType, setAutocompleteType] = useState<
    "lncrna" | "cancer" | null
  >(null);
  const [autocompleteData, setAutocompleteData] = useState<any[] | null>(null);
  const [lncSearchText, setLncSearchText] = useState<any>(null);
  const [cancerSearchText, setCancerSearchText] = useState<any>(null);
  // const [expressionPattern, setExpressionPattern] = useState("NA");
  const [isCoding, setIsCoding] = useState(false);

  useEffect(() => {
    if (autocompleteType === "lncrna") {
      axios
        .get("/api/search", { params: { searchString: lncSearchText } })
        .then((res) => setAutocompleteData(res.data.lncrna_names));
    } else if (autocompleteType === "cancer") {
      axios
        .get("/api/search", { params: { searchString: cancerSearchText } })
        .then((res) => setAutocompleteData(res.data.cancer_names));
    }
  }, [autocompleteType, lncSearchText, cancerSearchText]);

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>Advanced Search</CardHeader>
        {/* <CardBody>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime,
          esse. Praesentium magni ut, eligendi unde natus doloremque numquam
          similique! Iusto similique aliquid, accusamus praesentium inventore
          harum nobis voluptatibus ducimus iure?
        </CardBody> */}
      </Card>

      <Stack direction="row" sx={{ mt: 2 }}>
        <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
          <CardBody>
            <Stack direction="column">
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  LncRNA Name:
                </Text>
                <Input
                  sx={{ width: "60%", mr: 7 }}
                  value={lncSearchText}
                  onChange={(e) => {
                    setLncSearchText(e.target.value);
                    setAutocompleteType("lncrna");
                  }}
                />
              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Cancer Name:
                </Text>
                <Input
                  sx={{ width: "60%", mr: 7 }}
                  value={cancerSearchText}
                  onChange={(e) => {
                    setCancerSearchText(e.target.value);
                    setAutocompleteType("cancer");
                  }}
                />
              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Expression Pattern:
                </Text>
                <Select
                  sx={{ width: "60%", mr: 7 }}
                  value={expressionPattern}
                  onChange={(e) => setExpressionPattern(e.target.value)}
                >
                  <option value="null">NA</option>
                  <option value="up-regulated">up-regulated</option>
                  <option value="down-regulated">down-regulated</option>
                  <option value="differential-expression">
                    differentially expressed
                  </option>
                </Select>
              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>Coding:</Text>
                <Checkbox
                  checked={isCoding}
                  onChange={(e) => setIsCoding(e.target.checked)}
                />
              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Transcript variants:
                </Text>
                <Input
                  sx={{ width: "60%", mr: 7 }}
                  value={numOfTranscriptVariants}
                  onChange={(e) => setNumOfTranscriptVariants(e.target.value)}
                />
              </Stack>

              <Button
                bg="blue.500"
                sx={{ mt: 5, color: "#ffffff", _hover: {}, _active: {} }}
                onClick={async () => {
                  console.log(lncrna, cancer, expressionPattern, isCoding, numOfTranscriptVariants)

                }}
              >
                Search
              </Button>
            </Stack>
          </CardBody>
        </Card>

        <Card sx={{ mt: 5, mr: 7, width: "100%" }}>
          <CardBody>
            {lncSearchText === null && cancerSearchText === null ? (
              <Text sx={{ fontSize: 20 }}>
                Start typing to get autocomplete suggestions
              </Text>
            ) : (
              <Stack maxHeight={300} overflowY="scroll">
                {autocompleteData?.map((ele) => (
                  <Button
                    variant="link"
                    onClick={() => {
                      if (autocompleteType === "lncrna") {
                        setLncSearchText(ele);
                        setLncrna(ele);
                      } else if (autocompleteType === "cancer") {
                        setCancerSearchText(ele);
                        setCancer(ele);
                      }
                    }}
                  >
                    {ele}
                  </Button>
                ))}
              </Stack>
            )}
          </CardBody>
        </Card>
      </Stack>
    </>
  );
};

export default AdvancedSearch;

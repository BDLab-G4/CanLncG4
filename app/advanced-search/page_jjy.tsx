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
import { useRouter } from "next/navigation";

const AdvancedSearch = () => {

  const [lncrnaOptions, setLncrnaOptions] = useState("");
  const [cancerOptions, setCancerOptions] = useState("");
  const [lncrna, setLncrna] = useState("");
  const [cancer, setCancer] = useState("");
  const [expressionPattern, setExpressionPattern] = useState("NA");
  const [numOfTranscriptVariants, setNumOfTranscriptVariants] = useState("");
  const [autocompleteType, setAutocompleteType] = useState<
    "lncrna" | "cancer" | null
  >(null);
  const [autocompleteData, setAutocompleteData] = useState<any[] | null>(null);

  const [searchData, setSearchData] = useState<any[] | null>(null);
  
  const [lncSearchText, setLncSearchText] = useState<any>(null);
  const [cancerSearchText, setCancerSearchText] = useState<any>(null);
  // const [expressionPattern, setExpressionPattern] = useState("NA");
  const [isCoding, setIsCoding] = useState(false);

  const [showAutocomplete, setShowAutocomplete] = useState(false);


  const router = useRouter();




  // Function to handle autocomplete item selection
  const handleInputChange = (type:any, value:any) => {
    if (type === "lncrna") {
      setLncSearchText(value);
      setAutocompleteType("lncrna");
    } else if (type === "cancer") {
      setCancerSearchText(value);
      setAutocompleteType("cancer");
    }
    setShowAutocomplete(true);
  };

  // Function to handle autocomplete item selection
  const handleAutocompleteSelect = (type: any, value: any) => {
    if (type === "lncrna") {
      setLncSearchText(value);
      setLncrna(value);
    } else if (type === "cancer") {
      setCancerSearchText(value);
      setCancer(value);
    }
    setShowAutocomplete(false);
    setAutocompleteData(null);

    // axios request to /api/advanced-search with params lncrnaName, cancerName, expressionPattern, numOfTranscriptVariants
    // if something is blank, make it ""
    // use the response to populate  searchData
  };




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



  // on change of lncrna, cancer, expressionPattern, numOfTranscriptVariants, make axios request to /api/advanced-search

  useEffect(() => {
    axios
      .get("/api/advanced-search", {
        params: {
          lncrnaName: lncrna,
          cancerName: cancer,
          expressionPattern: expressionPattern,
          numOfTranscriptVariants: numOfTranscriptVariants,
        },
      })
      .then((res) => setSearchData(res.data.lncrna_names));
  }, [lncrna, cancer, expressionPattern, numOfTranscriptVariants]);

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
                  onChange={(e) => handleInputChange("lncrna", e.target.value)}
                />

                {/* Autocomplete Results for lncRNA */}

                {showAutocomplete && autocompleteType === "lncrna" && autocompleteData && (
                  <Stack  sx={{ position: "absolute", zIndex: 1, mt: "60px", width: "60%", backgroundColor: "blue.100", maxHeight:"200px", overflow:"auto" }}>
                    {autocompleteData.map((ele, index) => (
                      <Button key={index} variant="ghost" onClick={() => handleAutocompleteSelect("lncrna", ele)}>
                        {ele}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Cancer Name:
                </Text>
                <Input
                  sx={{ width: "60%", mr: 7 }}
                  value={cancerSearchText}
                  onChange={(e) => handleInputChange("cancer", e.target.value)}
                />



                {/* Autocomplete Results for Cancer */}
                {/* Autocomplete Results for Cancer */}
                {showAutocomplete && autocompleteType === "cancer" && autocompleteData && (
                  <Stack sx={{ position: "absolute", zIndex: 1, mt: "140px", width: "60%", backgroundColor: "blue.100", maxHeight:"200px", overflow:"auto"  }}>
                    {autocompleteData.map((ele, index) => (
                      <Button key={index} variant="ghost" onClick={() => handleAutocompleteSelect("cancer", ele)}>
                        {ele}
                      </Button>
                    ))}
                  </Stack>
                )}



              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "62%", mt: 1 }}>
                  Expression Pattern:
                </Text>
                <Select
                  sx={{ width: "95%", mr: 7 }}
                  value={expressionPattern}
                  onChange={(e) => setExpressionPattern(e.target.value)}
                >
                  <option value="NA">NA</option>
                  <option value="up-regulated">up-regulated</option>
                  <option value="down-regulated">down-regulated</option>
                  <option value="differentially expressed">
                    differentially expressed
                  </option>
                </Select>
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
              {/* 
              <Button
                bg="blue.500"
                sx={{ mt: 5, color: "#ffffff", _hover: {}, _active: {} }}


                onClick={() => {
                  console.log(lncrna, cancer, expressionPattern, numOfTranscriptVariants)

                  //http://10.0.63.147:3000/table?type=lncrna_name&payload=MALAT1&filter_cancer=Breast%20Cancer&filter_expression=up-regulated&filter_transcript=1
                  router.push(
                    `/table?type=${encodeURIComponent(
                      "lncrna_name"
                    )}&payload=${encodeURIComponent(lncrna)}&filter_cancer=${encodeURIComponent(cancer)}&filter_expression=${encodeURIComponent(expressionPattern)}&filter_transcript=${encodeURIComponent(numOfTranscriptVariants)}`
                  )
                }
                }
              >
                Search
              </Button> */}
            </Stack>
          </CardBody>
        </Card>

        <Card sx={{ mt: 5, mr: 7, width: "100%" }}>
          <CardBody>
            {lncSearchText === null && cancerSearchText === null && expressionPattern==="NA" ? (
              <Text sx={{ fontSize: 20 }}>
                Start typing to get autocomplete suggestions
              </Text>
            ) : (
              <Stack maxHeight={300} overflowY="scroll">
                {searchData?.map((ele) => (
                  <Button
                    variant="link"
                    onClick={() => {
                     // go to table page
                     router.push(
                      `/table?type=${encodeURIComponent(
                        "lncrna_name"
                      )}&payload=${encodeURIComponent(lncrna)}`
                    )

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

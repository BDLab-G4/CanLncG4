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
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";







const AdvancedSearch = () => {





  const [expressionPattern, setExpressionPattern] = useState("NA");
  const [autocompleteType, setAutocompleteType] = useState<
    "lncrna" | "cancer" | "transcript_variant" | null
  >(null);
  const [autocompleteDataLNC, setAutocompleteDataLNC] = useState<any[] | null>(null);
  const [autocompleteDataCancer, setAutocompleteDataCancer] = useState<any[] | null>(null);
  const [autocompleteDataTranscript, setAutocompleteDataTranscript] = useState<any[] | null>(null);
  const [searchData, setSearchData] = useState<any[] | null>(null);
  const [lncSearchText, setLncSearchText] = useState<any>(null);
  const [cancerSearchText, setCancerSearchText] = useState<any>(null);
  const [transcriptSearchText, setTranscriptSearchText] = useState<any>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  




  const router = useRouter();


  // Custom debounce function
  function debounce(func:any, wait:any) {
    let timeout:any;
    return function executedFunction(...args:any) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }


  // Function to handle autocomplete item selection
  const handleInputChange = (type: any, value: any) => {
    if (type === "lncrna") {
      setLncSearchText(value);
      setAutocompleteType("lncrna");
    } else if (type === "cancer") {
      setCancerSearchText(value);
      setAutocompleteType("cancer");
    }
    else if (type === "transcript_variant") {
      setTranscriptSearchText(value);
      setAutocompleteType("transcript_variant");
    }

    setShowAutocomplete(true);
  };


  // Function to handle autocomplete item selection
  const handleAutocompleteSelect = (type: any, value: any) => {
    if (type === "lncrna") {
      setLncSearchText(value);

    } else if (type === "cancer") {
      setCancerSearchText(value);

    }
    else if (type === "transcript_variant") {
      setTranscriptSearchText(value);

    }

    //setAutocompleteData([]);
    setShowAutocomplete(false);




    
  };


  useEffect(() => {
    const fetchData = () => {
      // if (!lncSearchText && !cancerSearchText && !transcriptSearchText) return; // Exit if all fields are empty

      const params = { lncrnaName: lncSearchText, cancerName: cancerSearchText, autoCompleteType: autocompleteType, numOfTranscriptVariants: transcriptSearchText, expressionPattern: expressionPattern };

      axios.get("/api/advanced-search", { params })
        .then(res => {
          if (autocompleteType === "lncrna") {
            setAutocompleteDataLNC(res.data.lncrna_names);
          } else if (autocompleteType === "cancer") {
            setAutocompleteDataCancer(res.data.cancer_names);
          } else if (autocompleteType === "transcript_variant") {
            setAutocompleteDataTranscript(res.data.transcript_variants);
          }
        })
        .catch(error => {
          console.error("There was an error fetching the autocomplete data:", error);
        });
    };

    // Debounce fetchData call
    const debouncedFetchData = debounce(fetchData, 500);

    debouncedFetchData();
  }, [autocompleteType, lncSearchText, cancerSearchText, transcriptSearchText]);


  // on change of lncrna, cancer, expressionPattern, numOfTranscriptVariants, make axios request to /api/advanced-search

  useEffect(() => {

    // wait for all changes to be made before making axios request


    const fetchData = () => {

      axios
        .get("/api/advanced-search", {
          params: {
            lncrnaName: lncSearchText,
            cancerName: cancerSearchText,
            expressionPattern: expressionPattern,
            numOfTranscriptVariants: transcriptSearchText,
            autoCompleteType: "all"
          },
        })
        .then((res) => setSearchData(res.data.lncrna_names));

    }

    // Debounce fetchData call
    const debouncedFetchData = debounce(fetchData, 1000);

    debouncedFetchData();

  }

    , [expressionPattern, transcriptSearchText, lncSearchText, cancerSearchText, autocompleteType]);

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }} >
        <CardHeader sx={{ fontSize: 25 }}>Advanced Search</CardHeader>
        {/* <CardBody>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime,
          esse. Praesentium magni ut, eligendi unde natus doloremque numquam
          similique! Iusto similique aliquid, accusamus praesentium inventore
          harum nobis voluptatibus ducimus iure?
        </CardBody> */}
      </Card>

      <Stack direction="row" sx={{ mt: 2, height: 500 }}

      >
        <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}
        >
          <CardBody>
            <Stack direction="column">
              <Stack direction="row" sx={{ position: "relative" }}> {/* Ensure this Stack has position: relative */}
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  LncRNA Name:
                </Text>
                <Input
                  sx={{ width: "60%", mr: 7 }}
                  value={lncSearchText}
                  onChange={(e) => handleInputChange("lncrna", e.target.value)}
                  onFocus={(e) => handleInputChange("lncrna", e.target.value)}
                  
                />

                {/* Autocomplete Results for lncRNA */}

                {showAutocomplete && autocompleteType === "lncrna" && autocompleteDataLNC && (
                  <Stack
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                     
                      mt: "40px", // Adjust this value as needed to align just below the input
                      width: "100%",
                      backgroundColor: "blue.100",
                      maxHeight: "200px",
                      overflow: "auto"
                    }}
                  >
                    {autocompleteDataLNC.map((ele, index) => (
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
                  onFocus={(e) => handleInputChange("cancer", e.target.value)}
                />



                {/* Autocomplete Results for Cancer */}
                {showAutocomplete && autocompleteType === "cancer" && autocompleteDataCancer && (
                  <Stack sx={{ position: "absolute", zIndex: 1, mt: "40px", width: "100%", backgroundColor: "blue.100", maxHeight: "200px", overflow: "auto" }}>
                    {autocompleteDataCancer.map((ele, index) => (
                      <Button key={index} variant="ghost" onClick={() => handleAutocompleteSelect("cancer", ele)}>
                        {ele}
                      </Button>
                    ))}
                  </Stack>
                )}


              </Stack>
              <Stack direction="row">
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Expression Pattern:
                </Text>
                <Select
                  sx={{ width: "82%", mx: 85}}
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
                  value={transcriptSearchText}
                  onChange={(e) => handleInputChange("transcript_variant", e.target.value)}
                  onFocus={(e) => handleInputChange("transcript_variant", e.target.value)}
                />

                // Autocomplete Results for Transcript Variants
                {showAutocomplete && autocompleteType === "transcript_variant" && autocompleteDataTranscript && (
                  <Stack sx={{ position: "absolute", zIndex: 1, mt: "40px", width: "100%", backgroundColor: "blue.100", maxHeight: "200px", overflow: "auto" }}>
                    {autocompleteDataTranscript.map((ele, index) => (
                      <Button key={index} variant="ghost" onClick={() => handleAutocompleteSelect("transcript_variant", ele)}>
                        {ele}
                      </Button>
                    ))}
                  </Stack>
                )}


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
            {lncSearchText === null && cancerSearchText === null && expressionPattern === "NA" && !transcriptSearchText ? (
              <Text sx={{ fontSize: 20 }}>
                Start typing to search LncRNA names
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
                        )}&payload=${encodeURIComponent(ele)}`
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

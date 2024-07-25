"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Stack,
  Input,
  Button,
  Box,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AdvancedSearch = () => {
  const [expressionPattern, setExpressionPattern] = useState<any>(null);
  const [autocompleteType, setAutocompleteType] = useState<
    "lncrna" | "cancer" | "transcript_variant" | "expression_pattern" | null
  >(null);
  const [autocompleteDataLNC, setAutocompleteDataLNC] = useState<any[] | null>(null);
  const [autocompleteDataCancer, setAutocompleteDataCancer] = useState<any[] | null>(null);
  const [autocompleteDataTranscript, setAutocompleteDataTranscript] = useState<any[] | null>(null);
  const [autocompleteDataExpression, setAutocompleteDataExpression] = useState<any[] | null>(null);
  const [searchData, setSearchData] = useState<any[] | null>(null);
  const [lncSearchText, setLncSearchText] = useState<string>("");
  const [cancerSearchText, setCancerSearchText] = useState<string>("");
  const [transcriptSearchText, setTranscriptSearchText] = useState<string>("");
  const [expressionPatternText, setExpressionPatternText] = useState<string>("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [quadruplexType, setQuadruplexType] = useState<string[]>([]);

  const router = useRouter();
  const inputRefLNC = useRef<any>(null);
  const inputRefCancer = useRef<any>(null);
  const inputRefTranscript = useRef<any>(null);
  const inputRefExpression = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  // Custom debounce function
  function debounce(func: any, wait: any) {
    let timeout: any;
    return function executedFunction(...args: any) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Function to handle input change and show autocomplete
  const handleInputChange = (type: any, value: any) => {
    if (type === "lncrna") {
      setLncSearchText(value);
      setAutocompleteType("lncrna");
    } else if (type === "cancer") {
      setCancerSearchText(value);
      setAutocompleteType("cancer");
    } else if (type === "transcript_variant") {
      setTranscriptSearchText(value);
      setAutocompleteType("transcript_variant");
    } else if (type === "expression_pattern") {
      setExpressionPatternText(value);
      setAutocompleteType("expression_pattern");
    }

    setShowAutocomplete(true);
  };

  // Function to handle autocomplete item selection
  const handleAutocompleteSelect = (type: any, value: any) => {
    if (type === "lncrna") {
      setLncSearchText(value);
    } else if (type === "cancer") {
      setCancerSearchText(value);
    } else if (type === "transcript_variant") {
      setTranscriptSearchText(value);
    } else if (type === "expression_pattern") {
      setExpressionPatternText(value);
      setExpressionPattern(value);
    }

    setShowAutocomplete(false);
  };

  useEffect(() => {
    const fetchData = () => {
      const params = {
        lncrnaName: lncSearchText,
        cancerName: cancerSearchText,
        autoCompleteType: autocompleteType,
        numOfTranscriptVariants: transcriptSearchText,
        expressionPattern: expressionPatternText,
        quadruplexType,
      };

      axios
        .get("/api/advanced-search", { params })
        .then((res) => {
          if (autocompleteType === "lncrna") {
            setAutocompleteDataLNC(res.data.lncrna_names);
          } else if (autocompleteType === "cancer") {
            setAutocompleteDataCancer(res.data.cancer_names);
          } else if (autocompleteType === "transcript_variant") {
            setAutocompleteDataTranscript(res.data.transcript_variants);
          } else if (autocompleteType === "expression_pattern") {
            const expressionPatterns = res.data.expression_patterns;
            const uniqueExpressionPatterns = new Set(
              expressionPatterns.map((item: string) => item.toLowerCase())
            );

            // if na, make it all caps
            if (uniqueExpressionPatterns.has("na")) {
              uniqueExpressionPatterns.delete("na");
            }
            setAutocompleteDataExpression(Array.from(uniqueExpressionPatterns));
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the autocomplete data:", error);
        });
    };

    // Debounce fetchData call
    const debouncedFetchData = debounce(fetchData, 500);

    debouncedFetchData();
  }, [autocompleteType, lncSearchText, cancerSearchText, transcriptSearchText, expressionPatternText, quadruplexType]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("/api/advanced-search", {
          params: {
            lncrnaName: lncSearchText,
            cancerName: cancerSearchText,
            expressionPattern: expressionPatternText,
            numOfTranscriptVariants: transcriptSearchText,
            autoCompleteType: "all",
            quadruplexType,
          },
        })
        .then((res) => setSearchData(res.data.lncrna_names))
        .catch((error) => console.error("Error fetching search data:", error));
    };

    // Debounce fetchData call
    const debouncedFetchData = debounce(fetchData, 1000);

    debouncedFetchData();
  }, [expressionPatternText, transcriptSearchText, lncSearchText, cancerSearchText, quadruplexType]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target) &&
        ((inputRefLNC.current && !inputRefLNC.current.contains(event.target)) ||
          (inputRefCancer.current && !inputRefCancer.current.contains(event.target)) ||
          (inputRefTranscript.current && !inputRefTranscript.current.contains(event.target)) ||
          (inputRefExpression.current && !inputRefExpression.current.contains(event.target)))
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [autocompleteRef, inputRefLNC, inputRefCancer, inputRefTranscript, inputRefExpression]);

  // Function to download CSV
  const downloadCSV = () => {
    const csvData = [
      ["LncRNA Name", lncSearchText],
      ["Cancer Name", cancerSearchText],
      ["Expression Pattern", expressionPatternText],
      ["Transcript Variants", transcriptSearchText],
      ["G-Quadruplex Type", quadruplexType.join(", ")],
      ["Results"],
      ...searchData.map((ele) => [ele]),
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvData.forEach((rowArray) => {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "advanced_search.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>Advanced Search</CardHeader>
      </Card>

      <Stack direction="row" sx={{ mt: 2, height: 500 }}>
        <Card sx={{ mt: 5, ml: 7, mr: 5, width: "100%" }}>
          <CardBody>
            <Stack direction="column">
              <Stack direction="row" sx={{ position: "relative" }}>
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  LncRNA Name:
                </Text>
                <Input
                  ref={inputRefLNC}
                  sx={{ width: "60%", mr: 7 }}
                  value={lncSearchText}
                  onChange={(e) => handleInputChange("lncrna", e.target.value)}
                  onFocus={(e) => handleInputChange("lncrna", e.target.value)}
                />

                {showAutocomplete && autocompleteType === "lncrna" && autocompleteDataLNC && (
                  <Box
                    ref={autocompleteRef}
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                      mt: "40px",
                      width: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(5px)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 2,
                    }}
                  >
                    {autocompleteDataLNC.map((ele, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        width="100%"
                        justifyContent="flex-start"
                        onClick={() => handleAutocompleteSelect("lncrna", ele)}
                      >
                        {ele}
                      </Button>
                    ))}
                  </Box>
                )}
              </Stack>
              <Stack direction="row" sx={{ position: "relative" }}>
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Cancer Name:
                </Text>
                <Input
                  ref={inputRefCancer}
                  sx={{ width: "60%", mr: 7 }}
                  value={cancerSearchText}
                  onChange={(e) => handleInputChange("cancer", e.target.value)}
                  onFocus={(e) => handleInputChange("cancer", e.target.value)}
                />

                {showAutocomplete && autocompleteType === "cancer" && autocompleteDataCancer && (
                  <Box
                    ref={autocompleteRef}
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                      mt: "40px",
                      width: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(5px)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 2,
                    }}
                  >
                    {autocompleteDataCancer.map((ele, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        width="100%"
                        justifyContent="flex-start"
                        onClick={() => handleAutocompleteSelect("cancer", ele)}
                      >
                        {ele}
                      </Button>
                    ))}
                  </Box>
                )}
              </Stack>
              <Stack direction="row" sx={{ position: "relative" }}>
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Expression Pattern:
                </Text>
                <Input
                  ref={inputRefExpression}
                  sx={{ width: "60%", mr: 7 }}
                  value={expressionPatternText}
                  onChange={(e) =>
                    handleInputChange("expression_pattern", e.target.value)
                  }
                  onFocus={(e) =>
                    handleInputChange("expression_pattern", e.target.value)
                  }
                />

                {showAutocomplete &&
                  autocompleteType === "expression_pattern" &&
                  autocompleteDataExpression && (
                    <Box
                      ref={autocompleteRef}
                      sx={{
                        position: "absolute",
                        zIndex: 1,
                        mt: "40px",
                        width: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(5px)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        maxHeight: "200px",
                        overflowY: "auto",
                        p: 2,
                      }}
                    >
                      {autocompleteDataExpression.map((ele, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          width="100%"
                          justifyContent="flex-start"
                          onClick={() =>
                            handleAutocompleteSelect("expression_pattern", ele)
                          }
                        >
                          {ele}
                        </Button>
                      ))}
                    </Box>
                  )}
              </Stack>
              <Stack direction="row" sx={{ position: "relative" }}>
                <Text sx={{ fontSize: 20, width: "40%", mt: 1 }}>
                  Transcript variants:
                </Text>
                <Input
                  ref={inputRefTranscript}
                  sx={{ width: "60%", mr: 7 }}
                  value={transcriptSearchText}
                  onChange={(e) =>
                    handleInputChange("transcript_variant", e.target.value)
                  }
                  onFocus={(e) =>
                    handleInputChange("transcript_variant", e.target.value)
                  }
                />

                {showAutocomplete &&
                  autocompleteType === "transcript_variant" &&
                  autocompleteDataTranscript && (
                    <Box
                      ref={autocompleteRef}
                      sx={{
                        position: "absolute",
                        zIndex: 1,
                        mt: "40px",
                        width: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(5px)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        maxHeight: "200px",
                        overflowY: "auto",
                        p: 2,
                      }}
                    >
                      {autocompleteDataTranscript.map((ele, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          width="100%"
                          justifyContent="flex-start"
                          onClick={() =>
                            handleAutocompleteSelect("transcript_variant", ele)
                          }
                        >
                          {ele}
                        </Button>
                      ))}
                    </Box>
                  )}
              </Stack>
            </Stack>
          </CardBody>
        </Card>

        <Card sx={{ mt: 5, mr: 7, width: "100%" }}>
          <CardBody>
            {lncSearchText === "" &&
              cancerSearchText === "" &&
              expressionPatternText === "" &&
              !transcriptSearchText ? (
              <Text sx={{ fontSize: 20 }}>Start typing to search lncRNA names</Text>
            ) : (
              <Box>
                <Button
                  sx={{ left: 5, top: 0 }}
                  onClick={downloadCSV}
                  colorScheme="blue"
                >
                  Download CSV
                </Button>

                <Stack
                  maxHeight={300}
                  overflowY="scroll"
                  sx={{
                    mt: 5,
                    p: 3,
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "white",
                  }}
                >
                  {searchData?.map((ele) => (
                    <Box
                      key={ele}
                      p={3}
                      borderBottom="1px solid #e2e8f0"
                      _last={{ borderBottom: "none" }}
                      sx={{
                        transition: "background-color 0.2s",
                        _hover: { backgroundColor: "#f0f4f7" },
                      }}
                    >
                      <Button
                        variant="link"
                        width="100%"
                        textAlign="left"
                        style={{ display: 'inline-flex' }}
                        onClick={() => {
                          router.push(
                            `/table?type=${encodeURIComponent("lncrna_name")}&payload=${encodeURIComponent(
                              ele
                            )}`
                          );
                        }}
                      >
                        {ele}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </CardBody>
        </Card>
      </Stack>
    </>
  );
};

export default AdvancedSearch;

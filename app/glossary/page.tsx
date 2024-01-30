"use client";

import { Card, CardBody, CardHeader, Stack, Link } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

const Glossary = () => {
  const [cancers, setCancers] = useState<any[]>([]);
  const [lncRNAs, setLncRNAs] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/glossary").then((res) => {
      setCancers(res.data.cancers);
      setLncRNAs(res.data.lncRNAs);
    });
  }, []);

  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>Glossary</CardHeader>
        <CardBody>
          List of all lncRNAs and Cancers supported by this website.
        </CardBody>
      </Card>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>Cancers</CardHeader>
        <CardBody>
          <Stack direction="row" sx={{ width: "100%" }}>
            <Stack direction="column" sx={{ width: "100%" }}>
              {cancers
                .slice(0, Math.floor(cancers.length / 3))
                .map((cancer: string) => (
                  <Link
                    key={cancer}
                    href={`/table?type=cancer_name&payload=${encodeURIComponent(
                      cancer.toLowerCase()
                    )}`}
                  >
                    {cancer}
                  </Link>
                ))}
            </Stack>
            <Stack direction="column" sx={{ width: "100%" }}>
              {cancers
                .slice(
                  Math.floor(cancers.length / 3),
                  Math.floor(2 * (cancers.length / 3))
                )
                .map((cancer: string) => (
                  <Link
                    key={cancer}
                    href={`/table?type=cancer_name&payload=${encodeURIComponent(
                      cancer.toLowerCase()
                    )}`}
                  >
                    {cancer}
                  </Link>
                ))}
            </Stack>
            <Stack direction="column" sx={{ width: "100%" }}>
              {cancers
                .slice(Math.floor(2 * (cancers.length / 3)))
                .map((cancer: string) => (
                  <Link
                    key={cancer}
                    href={`/table?type=cancer_name&payload=${encodeURIComponent(
                      cancer.toLowerCase()
                    )}`}
                  >
                    {cancer}
                  </Link>
                ))}
            </Stack>
          </Stack>
        </CardBody>
      </Card>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardHeader sx={{ fontSize: 25 }}>lncRNAs</CardHeader>
        <CardBody>
          <Stack direction="row" sx={{ width: "100%" }}>
            <Stack direction="column" sx={{ width: "100%" }}>
              {lncRNAs
                .slice(0, Math.floor(lncRNAs.length / 5))
                .map((lncrna: string) => (
                  <Link
                    key={lncrna}
                    href={`/table?type=lncrna_name&payload=${encodeURIComponent(
                      lncrna
                    )}`}
                  >
                    {lncrna}
                  </Link>
                ))}
            </Stack>
            <Stack direction="column" sx={{ width: "100%" }}>
              {lncRNAs
                .slice(
                  Math.floor(lncRNAs.length / 5),
                  Math.floor(2 * (lncRNAs.length / 5))
                )
                .map((lncrna: string) => (
                  <Link
                    key={lncrna}
                    href={`/table?type=lncrna_name&payload=${encodeURIComponent(
                      lncrna
                    )}`}
                  >
                    {lncrna}
                  </Link>
                ))}
            </Stack>
            <Stack direction="column" sx={{ width: "100%" }}>
              {lncRNAs
                .slice(
                  Math.floor(2 * (lncRNAs.length / 5)),
                  Math.floor(3 * (lncRNAs.length / 5))
                )
                .map((lncrna: string) => (
                  <Link
                    key={lncrna}
                    href={`/table?type=lncrna_name&payload=${encodeURIComponent(
                      lncrna
                    )}`}
                  >
                    {lncrna}
                  </Link>
                ))}
            </Stack>
            <Stack direction="column" sx={{ width: "100%" }}>
              {lncRNAs
                .slice(Math.floor(3 * (lncRNAs.length / 5)),Math.floor(4*(lncRNAs.length/5)))
                .map((lncrna: string) => (
                  <Link
                    key={lncrna}
                    href={`/table?type=lncrna_name&payload=${encodeURIComponent(
                      lncrna
                    )}`}
                  >
                    {lncrna}
                  </Link>
                ))}
            </Stack>
            <Stack direction="column" sx={{ width: "100%" }}>
              {lncRNAs
                .slice(Math.floor(4*(lncRNAs.length/5)))
                .map((lncrna: string) => (
                  <Link
                    key={lncrna}
                    href={`/table?type=lncrna_name&payload=${encodeURIComponent(
                      lncrna
                    )}`}
                  >
                    {lncrna}
                  </Link>
                ))}
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
};

export default Glossary;

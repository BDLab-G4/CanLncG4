"use client";

import {
  Avatar,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useDisclosure,
  // Image,
} from "@chakra-ui/react";
import { NavDrawer } from "./NavDrawer";
import { Button, Box } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@chakra-ui/react";

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const theme = useTheme();

  return (
    <>
      <nav
        style={{
          maxWidth: "100%",
          height: "50px",
          // backgroundColor: "#555555",
          backgroundColor: "#2b6cb0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Box sx={{ flexGrow: 1 }}>
          <Button
            onClick={onOpen}
            sx={{
              backgroundColor: "transparent",
              color: "#e2e1e1",
              _hover: {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            <HamburgerIcon fontSize={30} />
          </Button>

          <Button
            onClick={() => router.push("/")}
            sx={{
              backgroundColor: "transparent",
              color: "#e2e1e1",
              _hover: {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
              fontSize: 25,
              mt: 0.5,
            }}
          >
            CanLncG4
          </Button>
          <Image src="/logo_text.png" alt="logo text" />
        </Box> */}

        <Box sx={{ width: "18%" }}>
          <Stack direction="row">
            <LinkBox width={130}>
              <LinkOverlay href="/">
                <Image
                  style={{
                    marginLeft: 6,
                    borderRadius: 5,
                    marginRight: 4,
                  }}
                  src="/logo_text.png"
                  alt="logo text"
                  height={19}
                  width={130}
                />
              </LinkOverlay>
            </LinkBox>
            <Text
              sx={{
                ml: 1,
                mt: "5px",
                fontSize: 20,
                color: "#ffffff",
              }}
            >
              <i>v1.0</i>
            </Text>
          </Stack>
        </Box>
        <Stack sx={{ flexGrow: 1, ml: "60px" }} direction="row" spacing={6}>
          <Button
            variant="link"
            onClick={() => router.push("/")}
            sx={{
              color: "#ffffff",
              fontSize: 15,
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => router.push("/qgrs")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            QGRS Mapper
          </Button>

          <Button
            onClick={() => router.push("/g4hunter")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              // color: "#e2e1e1",
              color: "#ffffff",

              fontSize: 15,
            }}
          >
            G4Hunter Tool
          </Button>

          <Button
            onClick={() => router.push("/g4-interaction")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            LncRNA-G4 Interacting Partner
          </Button>

          <Button
            onClick={() => router.push("/statistics")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            Statistics
          </Button>

          <Button
            onClick={() => router.push("/glossary")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            Glossary
          </Button>

          <Button
            onClick={() => router.push("/downloads")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            Downloads
          </Button>

          <Button
            onClick={() => router.push("/help")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            Help
          </Button>

          {/* <Button
            onClick={() => router.push("/about")}
            variant="link"
            sx={{
              // backgroundColor: "transparent",
              color: "#ffffff",
              // _hover: {
              //   backgroundColor: "transparent",
              //   textDecoration: "underline",
              // },
              fontSize: 15,
            }}
          >
            About
          </Button> */}
        </Stack>

        <LinkBox sx={{ mr: "5px" }}>
          <LinkOverlay
            href="https://iitgn.ac.in/hi/faculty/chemistry/fac-bhaskar"
            target="_blank"
          >
            {/* <Image
              // borderRadius="full"
              src="/iitgn_logo.png"
              alt="iitgn logo"
              // boxSize="80px"
              style={{ borderRadius: "100px" }}
              width={50}
              height={50}
            /> */}
            <Avatar size="lg" src="/iitgn_logo.png" />
          </LinkOverlay>
        </LinkBox>
      </nav>
      <NavDrawer isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </>
  );
};

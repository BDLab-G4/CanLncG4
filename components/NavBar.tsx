"use client";
import {
  Avatar,
  LinkBox,
  LinkOverlay,
  Flex,
  Text,
  useDisclosure,
  IconButton,
  Box,
  SimpleGrid,
  Grid,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@chakra-ui/react";
import { NavDrawer } from "./NavDrawer";

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const theme = useTheme();
  const links = [
    { label: "Home", path: "/" },
    { label: "QGRS Mapper", path: "/qgrs" },
    { label: "G4Hunter Tool", path: "/g4hunter" },
    { label: "LncRNA-G4 Interacting Partner", path: "/g4-interaction" },
    { label: "Statistics", path: "/statistics" },
    { label: "Glossary", path: "/glossary" },
    { label: "Downloads", path: "/downloads" },
    { label: "Help", path: "/help" },
    { label: "Contact", path: "/contact" }
  ];

  return (
    <>
      <Flex
        as="nav"
        bg="#2b6cb0"
        color="#ffffff"
        align="center"
        justify="space-between"
        p={3}
        maxWidth="100%"
        wrap="wrap"
      >
        <Flex align="center">
          <LinkBox width={120}>
            <LinkOverlay href="/">
              <Image
                style={{ borderRadius: 5, marginRight: 4 }}
                src="/logo_text.png"
                alt="logo text"
                height={19}
                width={130}
              />
            </LinkOverlay>
          </LinkBox>

        </Flex>

        <Box
          flex="1"
          display={{ base: "none", md: "block" }}
          maxWidth="100%" // Set a maximum width to 80% of the parent container
          mx="auto" // Apply automatic margins on the left and right to center the box
        >
          <Grid
            templateColumns={{ md: "repeat(3, 1fr)", lg: "repeat(9, 1fr)" }}
            gap={0} // No gap between columns
            justifyContent="center" // Center the items horizontally within the Grid container
          >
            {links.map((link) => (
              <Text
                as="button"
                variant="link"
                onClick={() => router.push(link.path)}
                fontSize="15px"
                fontWeight="bold"
                m={0} // No margins
                p={0} // No padding
                key={link.label}
                _hover={{ textDecoration: "underline" }} // Underline on hover
              >
                {link.label}
              </Text>
            ))}
          </Grid>
        </Box>






        <Flex align="center">
          <LinkBox mr={5}>
            <LinkOverlay href="https://iitgn.ac.in/hi/faculty/chemistry/fac-bhaskar" target="_blank">
              <Avatar size="lg" src="/iitgn_logo.png" />
            </LinkOverlay>
          </LinkBox>
          <IconButton
            aria-label="Open Menu"
            size="lg"
            icon={<HamburgerIcon />}
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
          />
        </Flex>
      </Flex >

      <NavDrawer isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </>
  );
};

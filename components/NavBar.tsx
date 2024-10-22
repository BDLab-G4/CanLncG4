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
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavDrawer } from "./NavDrawer";

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const links = [
    { label: "Home", path: "/" },
    { label: "QGRS Mapper", path: "/qgrs" },
    { label: "G4Hunter Tool", path: "/g4hunter" },
    { label: "LncRNA-G4 Interacting Partners", path: "/lncrna-interactions" },
    { label: "Statistics", path: "/statistics" },
    { label: "Glossary", path: "/glossary" },
    { label: "Downloads", path: "/downloads" },
    { label: "Help", path: "/help" },
    { label: "Contact", path: "/contact" }
  ];

  // Custom breakpoint: 1224px
  const [isLargerThan1224] = useMediaQuery("(min-width: 1224px)");

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
        wrap="nowrap"
      >
        <Flex align="center" ml="10px">
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
          display={isLargerThan1224 ? "block" : "none"}
          mx="10px"
          textAlign="center"
        >
          <HStack spacing={8} justifyContent="center">
            {links.map((link) => (
              <Text
                as="button"
                variant="link"
                onClick={() => router.push(link.path)}
                fontSize="15px"
                fontWeight="bold"
                key={link.label}
                _hover={{ textDecoration: "underline" }}
              >
                {link.label}
              </Text>
            ))}
          </HStack>
        </Box>

        <Flex align="center" mr="10px">
          <LinkBox mr={5}>
            <LinkOverlay href="https://iitgn.ac.in/hi/faculty/chemistry/fac-bhaskar" target="_blank">
              <Avatar size="lg" src="/iitgn_logo.png" />
            </LinkOverlay>
          </LinkBox>
          <IconButton
            aria-label="Open Menu"
            size="lg"
            icon={<HamburgerIcon />}
            display={isLargerThan1224 ? "none" : "flex"}
            onClick={onOpen}
          />
        </Flex>
      </Flex>

      <NavDrawer isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </>
  );
};

"use client";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const NavDrawer = ({ isOpen, onClose, onOpen }) => {
  const router = useRouter();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Navigation</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch">
            <Button variant="link" onClick={() => { router.push('/'); onClose(); }} >
              Home
            </Button>
            <Button variant="link" onClick={() => { router.push('/qgrs'); onClose(); }} >
              QGRS Mapper
            </Button>
            {/* Add other navigation buttons similarly */}
            <Button variant="link" onClick={() => { router.push('/g4hunter'); onClose(); }} >
              G4Hunter Tool
            </Button>
            <Button variant="link" onClick={() => { router.push('/g4-interaction'); onClose(); }} >
              LncRNA-G4 Interacting Partner
            </Button>
            <Button variant="link" onClick={() => { router.push('/statistics'); onClose(); }} >
              Statistics
            </Button>
            <Button variant="link" onClick={() => { router.push('/glossary'); onClose(); }} >
              Glossary
            </Button>
            <Button variant="link" onClick={() => { router.push('/downloads'); onClose(); }} >
              Downloads
            </Button>
            <Button variant="link" onClick={() => { router.push('/help'); onClose(); }} >
              Help
            </Button>
            <Button variant="link" onClick={() => { router.push('/contact'); onClose(); }} >
              Contact
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
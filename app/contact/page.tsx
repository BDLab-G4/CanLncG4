import React from 'react';
import { Card, CardHeader, CardBody, Text, SimpleGrid, Box } from "@chakra-ui/react";
import Image from "next/image";

const Contact = () => {
  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardBody>
          <Text sx={{ fontSize: 20 }}>
            Please contact us at{" "}
            <a href="mailto:someemail@example.com">someemail@example.com</a>.
          </Text>
          <Text sx={{ mt: 3 }}>Additional contacts:</Text>
        </CardBody>
      </Card>

      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3 }}
        spacing={5}
        sx={{ mt: 5, mx: 7 }}
      >
        <Card sx={{ display: "flex", alignItems: "center" }}>
          <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              alt="Person 1"
              width={150}
              height={150}
              src="/contacts/person1.jpg"
            />
            <Text sx={{ fontSize: 18, mt: 3 }}>Person 1</Text>
            <Text sx={{ fontSize: 15 }}>Designation 1</Text>
            <a href="mailto:person1@example.com">person1@example.com</a>
          </CardBody>
        </Card>

        <Card sx={{ display: "flex", alignItems: "center" }}>
          <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              alt="Person 2"
              width={150}
              height={150}
              src="/contacts/person2.jpg"
            />
            <Text sx={{ fontSize: 18, mt: 3 }}>Person 2</Text>
            <Text sx={{ fontSize: 15 }}>Designation 2</Text>
            <a href="mailto:person2@example.com">person2@example.com</a>
          </CardBody>
        </Card>

        <Card sx={{ display: "flex", alignItems: "center" }}>
          <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              alt="Person 3"
              width={150}
              height={150}
              src="/contacts/person3.jpg"
            />
            <Text sx={{ fontSize: 18, mt: 3 }}>Person 3</Text>
            <Text sx={{ fontSize: 15 }}>Designation 3</Text>
            <a href="mailto:person3@example.com">person3@example.com</a>
          </CardBody>
        </Card>
      </SimpleGrid>
    </>
  );
};

export default Contact;

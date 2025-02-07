"use client";
import React from 'react';
import { Card, CardBody, Text, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

const Contact = () => {
  return (
    <>
      {/* General Queries */}
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardBody>
          <center>
            <Text sx={{ fontSize: 20 }}>
              General Queries:
              <br />
              <a href="mailto:query@canlncG4.com" style={{ color: 'blue' }}>query@canlncG4.com</a>
              <br />
              <a href="mailto:contact@canlncG4.com" style={{ color: 'blue' }}>contact@canlncG4.com</a>
            </Text>

            {/* Link to Submit Data Page */}
            <Text sx={{ fontSize: 18, mt: 4 }}>
              Want to submit data?
              <br />
              <Link href="/submit-data" style={{ color: 'blue', fontWeight: 'bold' }}>Click here to submit</Link>
            </Text>
          </center>
        </CardBody>
      </Card>

      {/* Additional Contacts */}
      <Card sx={{ mt: 5, mx: 7 }}>
        <center><Text sx={{ fontSize: 26 }}>Additional Contacts:</Text></center>

        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={5} sx={{ mt: 5, mx: 7, mb: 5 }}>
          {[{
            name: "Prof. Bhaskar Datta",
            role: "Project Supervisor",
            dept: "Department of Chemistry",
            email: "bdatta@iitgn.ac.in",
            img: "/people/bhaskar.jpg"
          }, {
            name: "Dr. Shubham Sharma",
            role: "Lead project ideator, data curator, and analyser",
            dept: "Department of Biological Sciences and Engineering",
            email: "shubham.sharma@iitgn.ac.in",
            img: "/people/shubham.jpg"
          }, {
            name: "Noman Hanif Barbhuiya",
            role: "Lead Web Developer",
            dept: "Department of Physics",
            email: "barbhuiyanoman@iitgn.ac.in",
            img: "/people/noman.jpeg"
          }].map((person, idx) => (
            <Card key={idx} >
              <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Image alt={person.name} width={150} height={150} src={person.img} />
                <Text sx={{ fontSize: 18, mt: 3 }}>{person.name}<br />({person.role})</Text>
                <Text sx={{ fontSize: 15 }}>{person.dept}<br />IITGN, India</Text>
                <a href={`mailto:${person.email}`} style={{ color: 'blue' }}>{person.email}</a>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Card>
    </>
  );
};

export default Contact;
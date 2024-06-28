import React from 'react';
import { Card, CardHeader, CardBody, Text, SimpleGrid, Box } from "@chakra-ui/react";
import Image from "next/image";

const Contact = () => {
  return (
    <>
      <Card sx={{ mt: 5, mx: 7 }}>
        <CardBody>
          <center>

         
          <Text sx={{ fontSize: 20 }}>
            General Queries:
            <br></br>
            <a href="mailto:query@canlncG4.com" style={{ color: 'blue' }}>query@canlncG4.com</a>
            <br></br>
            <a href="mailto:contact@canlncG4.com" style={{ color: 'blue' }}>contact@canlncG4.com</a>
            .
          </Text>

          </center>
      
        </CardBody>

      </Card>

      <Card sx={{ mt: 5, mx: 7 }}>
       
        <center>
        <Text sx={{ fontSize: 26 }}>
            Additional Contacts:
          </Text>
        </center>

        
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3 }}
        spacing={5}
        sx={{ mt: 5, mx: 7, mb:5 }}
    
      >
        <Card sx={{ display: "flex", alignItems: "center" }}>
          
          <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              alt="Person 1"
              width={150}
              height={150}
              src="/people/bhaskar.jpg"
            />
            <center>
              <Text sx={{ fontSize: 18, mt: 3 }}>Prof. Bhaskar Datta <br></br> (Project supervisor)</Text>
              <Text sx={{ fontSize: 15 }}>Prof. Bhaskar Datta (Project supervisor)
                Associate Professor<br></br>
                Department of Chemistry (Jointly with Biological Sciences and Engineering)
                <br></br>
                Indian Institute of Technology Gandhinagar (IITGN), India</Text>
              <a href="mailto:bdatta@iitgn.ac.in" style={{ color: 'blue' }}>bdatta@iitgn.ac.in</a>
            </center>
          </CardBody>
        </Card>

        <Card sx={{ display: "flex", alignItems: "center" }}>
          <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              alt="Person 2"
              width={150}
              height={150}
              src="/people/shubam.jpg"
            />
            <center>
              <Text sx={{ fontSize: 18, mt: 3 }}>Dr. Shubham Sharma <br></br>(Lead project ideator, data curator, and analyzer)</Text>
              <Text sx={{ fontSize: 15 }}>Department of Biological Sciences and Engineering
                <br></br>
                Indian Institute of Technology Gandhinagar (IITGN), India</Text>
              <a href="mailto:shubham.sharma@iitgn.ac.in" style={{ color: 'blue' }}>shubham.sharma@iitgn.ac.in</a>
              <a href="mailto:shubhamsharma.bio@gmail.com" style={{ color: 'blue' }}>shubhamsharma.bio@gmail.com</a>
            </center>
          </CardBody>
        </Card>

        <Card sx={{ display: "flex", alignItems: "center" }}>
          <CardBody sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              alt="Person 3"
              width={150}
              height={150}
              src="/people/noman.jpeg"
            />
            <center>
              <Text sx={{ fontSize: 18, mt: 3 }}>Noman Hanif Barbhuiya <br></br> (Lead web developer)</Text>
              <Text sx={{ fontSize: 15 }}>Ph.D. Scholar
                <br></br>
                Department of Physics
                <br></br>
                Indian Institute of Technology Gandhinagar (IITGN), India</Text>
              <a href="mailto:barbhuiyanoman@iitgn.ac.in">barbhuiyanoman@iitgn.ac.in</a>
            </center>
          </CardBody>
        </Card>
      </SimpleGrid>
      </Card>


     

    </>
  );
};

export default Contact;

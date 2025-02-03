"use client";

import React, { useState } from "react";
import { Card, CardBody, Text, Input, Button, FormControl, FormLabel, Link } from "@chakra-ui/react";

const SubmitData = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [issueLink, setIssueLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file.");
      return;
    }
    if (!email) {
      alert("Please provide an email.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("email", email);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.issueUrl) {
      setIssueLink(data.issueUrl);
      alert("File uploaded successfully! Issue created.");
    } else {
      alert("Upload failed.");
    }
  };

  return (
    <Card sx={{ mt: 5, mx: 7 }}>
      <CardBody>
        <center>
          <Text sx={{ fontSize: 22, mb: 3 }}>Submit Data</Text>
        </center>

        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired sx={{ mt: 3 }}>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              placeholder="Describe your data"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired sx={{ mt: 3 }}>
            <FormLabel>Upload File (.zip, .xlsx, .csv, etc.)</FormLabel>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </FormControl>

          <Button type="submit" sx={{ mt: 4, width: "100%", bg: "blue.500", color: "white" }}>
            Submit
          </Button>
        </form>

        {issueLink && (
          <Text sx={{ mt: 4 }}>
            ✅ <strong>Issue Created:</strong>{" "}
            <Link href={issueLink} color="blue.500" isExternal>
              View Issue on GitHub
            </Link>
          </Text>
        )}
      </CardBody>
    </Card>
  );
};

export default SubmitData;

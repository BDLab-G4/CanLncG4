import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Convert file to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Generate timestamped folder name
    const folderName = Date.now().toString();


    // Convert file to base64 for GitHub upload
    const fileContent = fileBuffer.toString("base64");

    // GitHub API details
    const GITHUB_REPO = "BDLab-G4/CanLncG4SubmittedData";
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
 
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/upload/${folderName}/${file.name}`;

    // Upload file to GitHub
    const githubUploadResponse = await axios.put(
      GITHUB_API_URL,
      {
        message: `Uploaded ${file.name} - ${description}`,
        content: fileContent,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const fileUrl = githubUploadResponse.data.content.html_url;

    // Create GitHub issue
    const issueResponse = await axios.post(
      `https://api.github.com/repos/${GITHUB_REPO}/issues`,
      {
        title: `New File Submission: ${file.name}`,
        body: `### Description:\n${description}\n\n**File Link:** [${file.name}](${fileUrl})`,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const issueUrl = issueResponse.data.html_url;

    return NextResponse.json({
      message: "File uploaded and issue created successfully!",
      fileUrl,
      issueUrl,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "File upload failed." }, { status: 500 });
  }
}

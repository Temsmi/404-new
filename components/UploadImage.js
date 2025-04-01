'use client';

import React, { useState } from "react";
import axios from "axios";

const UploadAudio = () => {
  const [audio, setAudio] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Ensure it's an audio file
    if (!file.type.startsWith("audio/")) {
      alert("Please select a valid audio file!");
      return;
    }

    setAudio(file);
    setPreviewUrl(URL.createObjectURL(file)); // Audio preview
  };

  const handleUpload = async () => {
    if (!audio) {
      alert("Please select an audio file first!");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
    if (!cloudName) {
      console.error("Cloud Name is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("file", audio);
    formData.append("upload_preset", "upload_preset"); // Use your actual Cloudinary upload preset
    formData.append("folder", "voice_messages"); // Store audio in 'voice_messages' folder

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, // Cloudinary uses `video/upload` for audio files
        formData
      );

      setUploadUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload Voice Message to Cloudinary</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      
      {previewUrl && (
        <div>
          <h3>Audio Preview:</h3>
          <audio controls>
            <source src={previewUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <br />
      <button onClick={handleUpload}>Upload</button>

      {uploadUrl && (
        <div>
          <h3>Uploaded Audio:</h3>
          <audio controls>
            <source src={uploadUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <p>URL: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">{uploadUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default UploadAudio;

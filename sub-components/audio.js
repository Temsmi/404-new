import React, { useState } from 'react';
import { AudioRecorder } from '@stream-io/audio-react-kit';

const CloudinaryAudioUploader = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleAudioRecordingComplete = async (audioFile) => {
    console.log('Recorded audio file:', audioFile);

    const formData = new FormData();
    formData.append('file', audioFile);
        formData.append('upload_preset', 'your_upload_preset'); // replace
        formData.append('folder', 'audio_uploads');

    setUploading(true);
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dl7wibkyz/upload/video', {
        method: 'POST',
        body: formData,
      });
              formData.append('upload_preset', 'audio_unsigned'); // replace
        formData.append('folder', 'audio_uploads');

        const res = await fetch('https://api.cloudinary.com/v1_1/dl7wibkyz/video/upload', {

      const data = await response.json();
      console.log('Uploaded to Cloudinary:', data);
      setAudioUrl(data.secure_url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '1rem' }}>
      <h2>Audio Recorder + Cloudinary Upload</h2>

      <AudioRecorder
        onRecordingComplete={handleAudioRecordingComplete}
        audioType="audio/webm"
        render={({ startRecording, stopRecording, isRecording }) => (
          <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        )}
      />

      {uploading && <p>Uploading to Cloudinary...</p>}

      {audioUrl && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Uploaded Audio:</h4>
          <audio controls src={audioUrl} />
          <p>
            <a href={audioUrl} target="_blank" rel="noopener noreferrer">
              View on Cloudinary
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryAudioUploader;

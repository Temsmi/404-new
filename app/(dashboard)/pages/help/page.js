'use client';

import React, { useState } from 'react';
import { Container, Button, Form, Accordion } from 'react-bootstrap';

const HelpPage = () => {
  // State for video upload form
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videos, setVideos] = useState([
    {
      title: 'Introduction to React',
      description: 'A beginner-friendly tutorial on React.js.',
      file: { name: 'react_intro.mp4' },
    },
    {
      title: 'Advanced JavaScript Tips',
      description: 'Learn advanced JavaScript techniques for experts.',
      file: { name: 'advanced_js_tips.mp4' },
    },
    {
      title: 'CSS for Beginners',
      description: 'A simple guide to understanding CSS basics.',
      file: { name: 'css_basics.mp4' },
    },
  ]);

  // State for FAQ section
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([
    {
      question: 'How do I upload a tutorial video?',
      answer: 'Click on the "Upload Video" button, enter the title and description, and choose the video file.',
    },
    {
      question: 'Can I edit a video after uploading?',
      answer: 'Currently, once a video is uploaded, it cannot be edited. You can delete and upload a new version.',
    },
    {
      question: 'What video formats are supported?',
      answer: 'We support MP4, AVI, and MOV file formats for video uploads.',
    },
  ]);

  // Handle video form submission
  const handleAddVideo = () => {
    if (!videoTitle || !videoDescription || !videoFile) {
      alert('Please fill in all fields!');
      return;
    }

    const newVideo = {
      title: videoTitle,
      description: videoDescription,
      file: videoFile,
    };

    setVideos([...videos, newVideo]);
    setVideoTitle('');
    setVideoDescription('');
    setVideoFile(null);
  };

  // Handle FAQ form submission
  const handleAddFaq = () => {
    if (!faqQuestion || !faqAnswer) {
      alert('Please fill in both the question and the answer!');
      return;
    }

    const newFaq = {
      question: faqQuestion,
      answer: faqAnswer,
    };

    setFaqs([...faqs, newFaq]);
    setFaqQuestion('');
    setFaqAnswer('');
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '750px' }}>
      <h3 className="text-center mb-4">Help Center</h3>

      {/* Video Upload Form */}
      <h4>Upload New Tutorial Video</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Video Title</Form.Label>
          <Form.Control
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Video Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            placeholder="Enter video description"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Video File</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddVideo}>
          Upload Video
        </Button>
      </Form>

      <hr />

      {/* List of Uploaded Videos */}
      <h4 className="mt-4">Uploaded Videos</h4>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            <h5>{video.title}</h5>
            <p>{video.description}</p>
            <p><strong>File:</strong> {video.file.name}</p>
          </li>
        ))}
      </ul>

      <hr />

      {/* FAQ Section */}
      <h4 className="mt-4">Frequently Asked Questions (FAQ)</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            value={faqQuestion}
            onChange={(e) => setFaqQuestion(e.target.value)}
            placeholder="Enter FAQ question"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={faqAnswer}
            onChange={(e) => setFaqAnswer(e.target.value)}
            placeholder="Enter FAQ answer"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddFaq}>
          Add FAQ
        </Button>
      </Form>

      <hr />

      {/* FAQ List with Accordion */}
      <h4 className="mt-4">Existing FAQs</h4>
      <Accordion defaultActiveKey="0">
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={String(index)} key={index}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default HelpPage;

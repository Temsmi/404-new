'use client';

import React, { useState } from 'react';
import { Container, Accordion } from 'react-bootstrap';

const HelpPage = () => {
  // State for FAQ section
  const [faqs] = useState([
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

  // Sample uploaded videos (you can replace this with dynamic data if needed)
  const [videos] = useState([
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

  return (
    <Container className="mt-5  mb-4 " style={{ marginLeft: '30px', width: '1000px'}}>
      <h3 className="text-center mb-4">Help Center</h3>

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

      {/* FAQ List with Accordion */}
      <h4 className="mt-4">Frequently Asked Questions (FAQ)</h4>
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

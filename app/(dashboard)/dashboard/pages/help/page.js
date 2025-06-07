'use client';

import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Accordion } from 'react-bootstrap';

const HelpPage = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videos, setVideos] = useState([]);

  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/api/help/get-data');
      const data = await res.json();

      if (res.ok) {
        setVideos(data.tutorials || []);
        setFaqs(data.faqs || []);
      } else {
        console.error('Error loading help data:', data.error);
      }
    };

    loadData();
  }, []);

  const handleAddVideo = async () => {
    if (!videoTitle || !videoDescription || !videoFile) {
      alert('Please fill in all fields!');
      return;
    }

    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    formData.append('file', videoFile);

    const res = await fetch('/api/help/videos', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setVideos([
        ...videos,
        {
          title: videoTitle,
          description: videoDescription,
          file_url: data.url, // Ensure backend sends this
        },
      ]);

      setVideoTitle('');
      setVideoDescription('');
      setVideoFile(null);
    } else {
      alert(data.error || 'Video upload failed.');
    }
  };

  const handleAddFaq = async () => {
    if (!faqQuestion || !faqAnswer) {
      alert('Please fill in both the question and the answer!');
      return;
    }

    const res = await fetch('/api/help/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: faqQuestion, answer: faqAnswer }),
    });

    const data = await res.json();

    if (res.ok) {
      setFaqs([...faqs, { question: faqQuestion, answer: faqAnswer }]);
      setFaqQuestion('');
      setFaqAnswer('');
    } else {
      alert(data.error || 'FAQ upload failed.');
    }
  };

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: '750px', borderBottom: '1px solid #ccc', paddingBottom: '50px' }}>
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
          <li key={index} className="mb-3">
            <h5>{video.title}</h5>
            <p>{video.description}</p>
            <video width="100%" controls>
              <source src={video.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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

'use client';

import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Accordion, Card, Row, Col, Alert } from 'react-bootstrap';

const HelpPage = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videos, setVideos] = useState([]);

  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [pendingFaqAnswers, setPendingFaqAnswers] = useState({});

  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [videosOpen, setVideosOpen] = useState(false);

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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

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
          file_url: data.url,
        },
      ]);
      setVideoTitle('');
      setVideoDescription('');
      setVideoFile(null);
      showMessage('success', 'Video uploaded successfully!');
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: faqQuestion, answer: faqAnswer }),
    });

    const data = await res.json();

    if (res.ok) {
      setFaqs([...faqs, data.faq]);
      setFaqQuestion('');
      setFaqAnswer('');
      showMessage('success', 'FAQ added successfully!');
    } else {
      alert(data.error || 'FAQ upload failed.');
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setPendingFaqAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handlePublishAnswer = async (faqId) => {
    const answer = pendingFaqAnswers[faqId];
    if (!answer) {
      alert('Please enter an answer before publishing.');
      return;
    }

    const res = await fetch(`/api/help/questions/${faqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage('success', 'Answer published successfully!');
      setFaqs(faqs.map(faq => faq.id === faqId ? { ...faq, answer } : faq));
      const updated = { ...pendingFaqAnswers };
      delete updated[faqId];
      setPendingFaqAnswers(updated);
    } else {
      alert(data.error || 'Failed to publish answer.');
    }
  };

  const handleDeleteFaq = async (faqId) => {
    const res = await fetch(`/api/help/questions/${faqId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setFaqs(faqs.filter(faq => faq.id !== faqId));
      showMessage('success', 'Question deleted successfully!');
    } else {
      alert('Failed to delete question.');
    }
  };

  const answeredFaqs = faqs.filter(faq => faq.answer);
  const unansweredFaqs = faqs.filter(faq => !faq.answer);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAnsweredFaqs = answeredFaqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUnansweredFaqs = unansweredFaqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: '800px' }}>
      {/* Header with unified search bar */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8}>
          <h3 className="mb-0">Help Center (Admin Panel)</h3>
        </Col>
        <Col xs={12} md={4}>
          <Form.Control
            type="search"
            placeholder="Search videos or FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {/* Upload New Tutorial Video */}
      <h4>
        <Button variant="link" onClick={() => setVideosOpen(!videosOpen)}>
          {videosOpen ? 'Hide' : 'Show'} Upload New Tutorial Video
        </Button>
      </h4>
      {videosOpen && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Video Title</Form.Label>
            <Form.Control
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Video Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Video File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </Form.Group>

          <Button onClick={handleAddVideo}>Upload Video</Button>
        </Form>
      )}

      <hr />

      {/* Uploaded Videos */}
      <h4>Uploaded Videos ({filteredVideos.length})</h4>
      <Accordion>
        {filteredVideos.map((video, index) => (
          <Accordion.Item eventKey={String(index)} key={index}>
            <Accordion.Header>{video.title}</Accordion.Header>
            <Accordion.Body>
              <p>{video.description}</p>
              <video width="100%" controls>
                <source src={video.file_url || video.file} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <hr />

      {/* Add New FAQ */}
      <h4>Add New FAQ</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            value={faqQuestion}
            onChange={(e) => setFaqQuestion(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={faqAnswer}
            onChange={(e) => setFaqAnswer(e.target.value)}
          />
        </Form.Group>

        <Button onClick={handleAddFaq}>Add FAQ</Button>
      </Form>

      <hr />

      {/* Unanswered FAQs */}
      <h4>Unanswered Questions</h4>
      {filteredUnansweredFaqs.length === 0 ? (
        <p>No pending questions.</p>
      ) : (
        filteredUnansweredFaqs.map((faq) => (
          <Card className="mb-3" key={faq.id}>
            <Card.Body>
              <Card.Title>Q: {faq.question}</Card.Title>
              <Form.Group className="mb-2">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={pendingFaqAnswers[faq.id] || ''}
                  onChange={(e) => handleAnswerChange(faq.id, e.target.value)}
                />
              </Form.Group>
              <Button variant="success" className="me-2" onClick={() => handlePublishAnswer(faq.id)}>
                Publish
              </Button>
              <Button variant="danger" onClick={() => handleDeleteFaq(faq.id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))
      )}

      <hr />

      {/* Published FAQs */}
      <h4>Published FAQs</h4>
      <Accordion>
        {filteredAnsweredFaqs.map((faq, index) => (
          <Accordion.Item eventKey={String(index)} key={faq.id}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default HelpPage;

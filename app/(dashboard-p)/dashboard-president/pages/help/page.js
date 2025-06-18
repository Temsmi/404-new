'use client';

import React, { useState, useEffect } from 'react';
import { Container, Form, Accordion, Button, Modal, Alert } from 'react-bootstrap';

const HelpPage = () => {
  const [videos, setVideos] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

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

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaqs = faqs
    .filter(faq => faq.answer && faq.answer.trim() !== '') 
    .filter(faq =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    );

  const handleSubmitQuestion = async () => {
    if (!userQuestion.trim()) {
      setSubmitStatus('Please write your question.');
      return;
    }

    try {
      const res = await fetch('/api/help/add-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion })
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitStatus('Your question was submitted successfully!');
        setUserQuestion('');
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus('');
        }, 2000);
      } else {
        setSubmitStatus(result.error || 'Failed to submit.');
      }
    } catch (error) {
      setSubmitStatus('Server error.');
    }
  };

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: '750px', paddingBottom: '50px' }}>
      <h3 className="text-center mb-4">Help Center</h3>

      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search tutorials or FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>

      {/* Videos Section */}
      <h4 className="mt-4">Tutorial Videos</h4>
      {filteredVideos.length === 0 ? (
        <p className="text-muted">No videos found.</p>
      ) : (
        <Accordion alwaysOpen>
          {filteredVideos.map((video, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header>{video.title}</Accordion.Header>
              <Accordion.Body>
                <p>{video.description}</p>
                <video width="100%" controls>
                  <source src={video.file} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <hr className="my-5" />

      {/* FAQ Section */}
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mt-4">❓Frequently Asked Questions (FAQ)</h4>
        <Button variant="outline-primary" onClick={() => setShowModal(true)}>Add Question</Button>
      </div>

      {filteredFaqs.length === 0 ? (
        <p className="text-muted">No FAQs found.</p>
      ) : (
        <Accordion alwaysOpen>
          {filteredFaqs.map((faq, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {/* Modal for question submission */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Your Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Type your question here..."
            />
          </Form.Group>
          {submitStatus && <Alert className="mt-3" variant="info">{submitStatus}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmitQuestion}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HelpPage;

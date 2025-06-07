'use client';

import React, { useState, useEffect } from 'react';
import { Container, Form, Accordion } from 'react-bootstrap';

const HelpPage = () => {
  const [videos, setVideos] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');

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

  // Filter data by search term (case-insensitive)
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: '750px', paddingBottom: '50px' }}>
      <h3 className="text-center mb-4">Help Center</h3>

      {/* Search Input */}
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search tutorials or FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>

      {/* Tutorial Videos Section */}
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
      <h4 className="mt-4">❓Frequently Asked Questions (FAQ)</h4>
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
    </Container>
  );
};

export default HelpPage;

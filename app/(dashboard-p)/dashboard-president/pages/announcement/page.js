'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Container, Form, Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateAnnouncementPage = () => {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const todayDate = new Date().toLocaleDateString('en-US');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const announcement = {
      club_id: 1, // یا بگیر از session
      date: new Date().toISOString().slice(0, 10),
      title,
      message,
    };

    try {
      const res = await fetch('/api/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Announcement submitted successfully!');
        setMessage('');
        setTitle('');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Submission error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <div className="bg-white p-4 shadow rounded w-100" style={{ maxWidth: 800 }}>
        <h3 className="text-center mb-4">Create Announcement</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="text" value={todayDate} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <ReactQuill
              theme="snow"
              value={message}
              onChange={setMessage}
              placeholder="Write your announcement here..."
              style={{ backgroundColor: 'white', borderRadius: '5px' }}
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default CreateAnnouncementPage;

'use client';
import React, { useState,  useRef } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import socket from 'app/lib/socket';
import { Container, Form, Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateAnnouncementPage = () => {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef(null);
  const todayDate = new Date().toLocaleDateString('en-US');

  const handleSubmit = async (e) => {
  e.preventDefault();
  const content = message;

  try {
  const rew = await fetch("/api/getClubId");
  const data = await rew.json();
  const clubIds = Array.isArray(data.club_id) ? data.club_id : [data.club_id];
    
    const payload = {
     club_id: clubIds[0],
      title,
      text: content,
      timestamp: new Date().toISOString(),
      type: 'announcement'
    };
   
    // Store in DB
    const res = await fetch('/api/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Announcement sent!');

      // Real-time socket broadcast to club members
      socket.emit('new_announcement', {
        clubIds,
        ...payload,
      });
      setMessage('');
      setTitle('');
    } else {
      toast.error(result.error || 'Failed to send announcement');
    }
  } catch (err) {
    console.error(err);
    toast.error('Unexpected error while sending announcement');
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

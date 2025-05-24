'use client';

import React, { useRef, useState } from 'react';
import { Container, Form, Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import socket from 'app/lib/socket';

const CreateAnnouncementPage = () => {
    const editorRef = useRef(null);
    const [title, setTitle] = useState('');
    const [announcementData, setAnnouncementData] = useState({
        date: new Date().toLocaleDateString(),
        title:'',
        message: '',
    });

    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
    };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const content = editorRef.current.innerHTML;

  try {
    const clubRes = await fetch('/api/getClubId');
    const { club_id } = await clubRes.json();

    if (!club_id) {
      return toast.error('Club ID not found');
    }

    const payload = {
      title,
      message: content,
      created_at: new Date().toISOString(),
    };

    // Store in DB
    const res = await fetch('/api/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload}),
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Announcement sent!');

      // Real-time socket broadcast to club members
      socket.emit('new_announcement', {
        club_id,
        ...payload,
      });
      editorRef.current.innerHTML = '';
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
        <Container className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
            <div className="p-4" style={{ width: '600px', flex: 1 }}>
                <h3 className="mb-3 text-center">Create Announcement</h3>

                {/* Date Field */}
                <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="text" value={announcementData.date} readOnly />
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

                {/* Toolbar */}
                <div className="mb-2 d-flex flex-wrap gap-2">
                    <ButtonGroup>
                        <Button variant="outline-secondary" onClick={() => formatText('bold')}><b>B</b></Button>
                        <Button variant="outline-secondary" onClick={() => formatText('italic')}><i>I</i></Button>
                        <Button variant="outline-secondary" onClick={() => formatText('underline')}><u>U</u></Button>
                        <Button variant="outline-secondary" onClick={() => formatText('insertUnorderedList')}>• List</Button>
                        <Button variant="outline-secondary" onClick={() => formatText('insertOrderedList')}>1. List</Button>
                        <Button variant="outline-secondary" onClick={() => formatText('justifyLeft')}>⬅</Button>
                        <Button variant="outline-secondary" onClick={() => formatText('justifyCenter')}>↔</Button>
                        <Button variant="outline-secondary" onClick={() => formatText('justifyRight')}>➡</Button>
                        <Button variant="outline-secondary" onClick={() => formatText('removeFormat')}>Clear</Button>
                    </ButtonGroup>

                    {/* Font Size */}
                    <DropdownButton title="Size" variant="outline-secondary">
                        <Dropdown.Item onClick={() => formatText('fontSize', 1)}>Small</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('fontSize', 3)}>Normal</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('fontSize', 5)}>Large</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('fontSize', 7)}>Huge</Dropdown.Item>
                    </DropdownButton>

                    {/* Headings */}
                    <DropdownButton title="Heading" variant="outline-secondary">
                        <Dropdown.Item onClick={() => formatText('formatBlock', 'H1')}>H1</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('formatBlock', 'H2')}>H2</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('formatBlock', 'P')}>Paragraph</Dropdown.Item>
                    </DropdownButton>

                    {/* Text Color */}
                    <DropdownButton title="Text Color" variant="outline-secondary">
                        <Dropdown.Item onClick={() => formatText('foreColor', 'red')}>Red</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('foreColor', 'blue')}>Blue</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('foreColor', 'green')}>Green</Dropdown.Item>
                        <Dropdown.Item onClick={() => formatText('foreColor', 'black')}>Black</Dropdown.Item>
                    </DropdownButton>

                    {/* Link */}
                    <Button
                        variant="outline-secondary"
                        onClick={() => {
                            const url = prompt('Enter URL:', 'https://');
                            if (url) formatText('createLink', url);
                        }}
                    >
                        🔗 Link
                    </Button>
                </div>

                {/* Rich Text Editor */}
                <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <div
                        ref={editorRef}
                        contentEditable
                        style={{
                            border: '1px solid #ccc',
                            minHeight: '300px',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: 'white',
                            overflowY: 'auto',
                        }}
                        placeholder="Write your announcement here..."
                        required
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="mt-3 mx-auto d-block" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
        </Container>
    );
};

export default CreateAnnouncementPage;

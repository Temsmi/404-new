'use client';

import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import ReactQuill from 'react-quill';  // Import react-quill for text editing
import 'react-quill/dist/quill.snow.css';  // Import the styling for the editor


const CreateAnnouncementPage = () => {
    const [announcementData, setAnnouncementData] = useState({
        date: new Date().toLocaleDateString(),  // Today's date
        message: '',
    });

    const handleChange = (value) => {
        setAnnouncementData({ ...announcementData, message: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Announcement Submitted:', announcementData);
        // You can send this data to the server here for admin approval
    };

    return (
        <Container className="d-flex justify-content-center align-items-start" style={{ minHeight: '100vh' }}>
            <div className="p-4" style={{ width: '600px', flex: 1  }}>
                <h3 className="mb-3 text-center">Create Announcement</h3>

                {/* Today's Date (Non-editable) */}
                <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="text"
                        value={announcementData.date}
                        readOnly
                    />
                </Form.Group>

                {/* Important Message for Club Members */}
                <Form.Group className="mb-3">
                    <Form.Label>Message </Form.Label>
                    <ReactQuill
                        value={announcementData.message}
                        onChange={handleChange}
                        theme="snow"
                        modules={{
                            toolbar: [
                                [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['link'],
                                ['blockquote', 'code-block'],
                                [{ 'size': ['small', 'normal', 'large', 'huge'] }],
                                [{ 'indent': '-1'}, { 'indent': '+1' }],
                                [{ 'direction': 'rtl' }],
                                ['clean']
                            ],
                        }}
                        placeholder="Write your announcement here..."
                        style={{
                            height: '300px',              // Set the height for the editor
                                    
                        }}
                    />
                </Form.Group>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="w-100 mt-8" onClick={handleSubmit}>
                    Submit
                </Button>

            </div>
        </Container>
    );
};

export default CreateAnnouncementPage;

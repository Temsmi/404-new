

'use client';

import { useEffect, useState } from 'react';
// import node module libraries
import { Col, Row, Form, Card, Button, Alert } from 'react-bootstrap';

// import hooks
import useMounted from 'hooks/useMounted';

const EmailSetting = () => {
  const hasMounted = useMounted();
  const [userData, setUserData] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/setting-mem');
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
          setNewEmail(data.email || '');
        } else {
          console.error('Error:', data.error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchUser();
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/setting-mem', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: userData.id,
          email: newEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Email updated successfully.' });
      } else {
        setMessage({ type: 'danger', text: data.error || 'Failed to update email.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Network error updating email.' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { new: newPass, confirm } = passwords;
    if (newPass.length < 8 || newPass !== confirm) {
      return setMessage({ type: 'danger', text: 'Passwords do not match or do not meet requirements.' });
    }

    try {
      const res = await fetch('/api/setting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: userData.id,
          password: newPass,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully.' });
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setMessage({ type: 'danger', text: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Network error updating password.' });
    }
  };

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Setting</h4>
          
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card id="edit">
          <Card.Body>
            {message.text && (
              <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
                {message.text}
              </Alert>
            )}

           

            {hasMounted && userData && (
              <>
                

                <div className="mb-6 mt-6">
                  <h4 className="mb-1">Change your password</h4>
                </div>

                <Form onSubmit={handlePasswordChange}>
                  <Row className="mb-3">
                    <Form.Label className="col-sm-4" htmlFor="currentPassword">Current password</Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        type="password"
                        placeholder="Enter current password"
                        id="currentPassword"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Form.Label className="col-sm-4" htmlFor="newPassword">New password</Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        id="newPassword"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        required
                      />
                    </Col>
                  </Row>

                  <Row className="align-items-center">
                    <Form.Label className="col-sm-4" htmlFor="confirmNewPassword">Confirm new password</Form.Label>
                    <Col md={8} xs={12}>
                      <Form.Control
                        type="password"
                        placeholder="Confirm new password"
                        id="confirmNewPassword"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                      <h6 className="mb-1">Password requirements:</h6>
                      <p>Ensure that these requirements are met:</p>
                      <ul>
                        <li>Minimum 8 characters</li>
                        <li>At least one lowercase character</li>
                        <li>At least one uppercase character</li>
                        <li>At least one number, symbol, or whitespace character</li>
                      </ul>
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EmailSetting;
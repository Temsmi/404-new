'use client';
import { useRouter } from 'next/navigation';
import { Col, Row, Card } from 'react-bootstrap';

const DeleteAccount = () => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        alert('Your account has been deleted.');

        // Call logout API to clear session
        await fetch('/api/logout');

        // Redirect to sign-up page after logout
        router.push('/authentication/sign-up');
      } else {
        alert('Failed to delete account: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Row>
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Delete Account</h4>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card className="mb-6">
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Danger Zone</h4>
            </div>
            <p>Deleting your account will remove all your data permanently.</p>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete Account
            </button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DeleteAccount;

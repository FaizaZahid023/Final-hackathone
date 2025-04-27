
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { Container, Card, Spinner, Button, Row, Col } from "react-bootstrap";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/auth/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          toast.error(data.message || "Failed to fetch user details");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while fetching user details");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/auth/user/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/signup");
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while deleting user");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <p className="fs-5">No user data available</p>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-black text-white py-5">
      <Card className="shadow-lg w-100 border-0" style={{ maxWidth: "550px", background: "#1e1e1e", borderRadius: "15px" }}>
        <Card.Header className="d-flex justify-content-between align-items-center py-3 px-4" style={{ background: "#2d2d2d", borderRadius: "15px 15px 0 0" }}>
          <span className="fw-semibold text-white">👋 Welcome, {user.name}</span>
          <div className="d-flex gap-3">
            <FontAwesomeIcon
              icon={faUserPen}
              style={{ cursor: "pointer", color: "#4bf6d4" }}
              onClick={() => navigate("/update")}
            />
            <FontAwesomeIcon
              icon={faTrash}
              style={{ cursor: "pointer", color: "#ff6b6b" }}
              onClick={() => deleteUser(user._id)}
            />
          </div>
        </Card.Header>

        <Card.Body className="px-4 pt-4">
          <Row className="mb-3">
            <Col>
              <div className="text-muted small">Name</div>
              <div className="bg-dark text-white border rounded p-2 mt-1">{user.name}</div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <div className="text-muted small">Email</div>
              <div className="bg-dark text-white border rounded p-2 mt-1">{user.email}</div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <div className="text-muted small">Joined On</div>
              <div className="bg-dark text-white border rounded p-2 mt-1">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="bg-transparent px-4 pb-4">
          <Button
            variant="outline-light"
            className="w-100"
            style={{ borderColor: "#4bf6d4", color: "#4bf6d4" }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Profile;

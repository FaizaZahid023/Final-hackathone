
import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ab from '../assets/images/ab.jpg'; // ✅ Replace with your preferred image

const About = () => {
  return (
    <div style={{ backgroundColor: '#111', color: '#f8f9fa' }}>
      <Container className="py-5">
        <Row className="align-items-center g-5">
          {/* 📝 Text */}
          <Col md={6}>
            <h1 className="fw-bold display-5 mb-4" style={{ color: '#FF9AA2' }}>
              Discover the World of <span style={{ color: '#4bf6d4' }}>Glamora</span>
            </h1>

            <p className="lead" style={{ color: '#e0e0e0' }}>
              At <span style={{ color: '#FFDAC1' }} className="fw-semibold">Glamora</span>, we believe beauty is more than skin deep—it's a reflection of your inner confidence and limitless creativity.
            </p>

            <p style={{ color: '#c4c4c4' }}>
              Our curated collection of premium beauty products is designed to empower you. Whether you're getting ready for an unforgettable night out or embracing your everyday glow, <span style={{ color: '#FFDAC1' }} className="fw-semibold">Glamora</span> is here to elevate your look.
            </p>

            <p style={{ color: '#c4c4c4' }}>
              Each product at Glamora is carefully chosen to suit a diverse range of styles and skin tones. From bold statements to timeless elegance, we're here to help you discover the beauty that resonates with you.
            </p>

            <p className="fw-semibold" style={{ color: '#4bf6d4' }}>
              Embrace your uniqueness. Shine your brightest. Be Glamora.
            </p>
          </Col>

          {/* 📷 Image */}
          <Col md={6} className="text-center">
            <Image
              src={ab}
              alt="Glamora makeup collection"
              fluid
              className="rounded-4 shadow-lg"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                border: '5px solid #FF9AA2',
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;

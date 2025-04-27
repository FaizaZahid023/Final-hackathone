
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name || !formData.email || !formData.message) {
			toast.error('All fields are required!');
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${apiUrl}/contact`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const result = await response.json();
			setLoading(false);

			if (!response.ok) {
				throw new Error(result.error || 'Failed to send message');
			}

			Swal.fire({
				title: result.user === 'New User' ? 'Success!' : 'Submitted Again!',
				text: result.user === 'New User'
					? 'Your message has been submitted!'
					: 'Your response has been submitted again!',
				icon: result.user === 'New User' ? 'success' : 'info',
				confirmButtonColor: '#fc8019',
			});

			setFormData({ name: '', email: '', message: '' });

			if (result.token) {
				navigate(`/verify-email/${result.token}`);
			}
		} catch (error) {
			setLoading(false);
			toast.error('Something went wrong. Please try again.');
		}
	};

	return (
		<Container className="py-5">
			<h2 className="text-center mb-5 fw-bold text-dark">Contact Us</h2>
			<Row>
				<Col md={6} className="mb-4">
					<Card className="shadow">
						<Card.Body>
							<h4 className="mb-4 fw-semibold text-dark">Get in Touch</h4>
							<Form onSubmit={handleSubmit}>
								<Form.Group className="mb-3" controlId="name">
									<Form.Label>Name</Form.Label>
									<Form.Control
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="Your Name"
										disabled={loading}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="email">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="Your Email"
										disabled={loading}
									/>
								</Form.Group>

								<Form.Group className="mb-3" controlId="message">
									<Form.Label>Message</Form.Label>
									<Form.Control
										as="textarea"
										rows={4}
										name="message"
										value={formData.message}
										onChange={handleChange}
										placeholder="Your Message"
										disabled={loading}
									/>
								</Form.Group>

								<Button
									type="submit"
									variant="warning"
									className="w-100 fw-semibold"
									disabled={loading}
								>
									{loading ? <Spinner animation="border" size="sm" /> : 'Send Message'}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>

				<Col md={6}>
					<Card className="shadow">
						<Card.Body>
							<h4 className="mb-4 fw-semibold text-dark">Contact Information</h4>
							<ul className="list-unstyled text-muted">
								<li className="mb-3">
									<strong>Address:</strong> 456 Elm Street, Springfield, USA
								</li>
								<li className="mb-3">
									<strong>Phone:</strong> +1234-567-890
								</li>
								<li className="mb-3">
									<strong>Email:</strong> contact@example.com
								</li>
							</ul>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Contact;

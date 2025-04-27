import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import AdminDashboard from '../components/AdminDashboard';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AdminPage = () => {
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const checkAdminStatus = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					console.error('No auth token found! Redirecting to login.');
					navigate('/login');
					return;
				}
				const response = await fetch(`${apiUrl}/auth/isAdmin`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				const data = await response.json();
				console.log('Admin Check Response:', data);

				if (data.success) {
					setIsAdmin(true);
				} else {
					console.log('User is not an admin, redirecting to login');
					navigate('/login');
				}
			} catch (error) {
				console.error('Error checking admin status:', error);
				navigate('/login');
			} finally {
				setLoading(false);
			}
		};

		checkAdminStatus();
	}, []);

	if (loading) {
		return (
			<Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</Container>
		);
	}

	if (!isAdmin) {
		return null;
	}

	return (
		<Container>
			<AdminDashboard />
		</Container>
	);
};

export default AdminPage;


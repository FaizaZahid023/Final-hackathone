

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Container,
	Row,
	Col,
	Button,
	Offcanvas,
	ListGroup,
	Card,
} from 'react-bootstrap';
import {
	FaBars,
	FaBox,
	FaChartBar,
	FaUsers,
	FaShoppingCart,
	FaTimes,
} from 'react-icons/fa';
import Products from './Products';

const AdminDashboard = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('Dashboard');
	const [totalProducts, setTotalProducts] = useState(0);

	const navigate = useNavigate();
	const apiUrl = import.meta.env.VITE_API_BASE_URL;

	const checkAdminStatus = async () => {
		const token = localStorage.getItem('token');

		if (!token) {
			console.error('❌ No auth token found! Redirecting to login.');
			alert('Unauthorized access! Please log in as an admin.');
			navigate('/login');
			return;
		}

		try {
			const response = await fetch(`${apiUrl}/auth/isAdmin`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			const data = await response.json();
			console.log('Admin Check Response:', data);

			if (!data.success || !data.isAdmin) {
				console.error('❌ User is not an admin, redirecting to login...');
				localStorage.removeItem('authToken');
				navigate('/login');
				return;
			}
		} catch (error) {
			console.error('❌ Error checking admin status:', error);
			alert('An error occurred. Redirecting to login.');
			navigate('/login');
		}
	};

	useEffect(() => {
		checkAdminStatus();
	}, []);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'Products':
				return <Products />;
			default:
				return <div>Select an option from the menu</div>;
		}
	};

	return (
		<div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
			{/* Sidebar */}
			<Offcanvas
				show={isSidebarOpen}
				onHide={toggleSidebar}
				backdrop={false}
				responsive="sm"
			>
				<Offcanvas.Header closeButton className="bg-info text-white">
					<Offcanvas.Title>Admin Dashboard</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<ListGroup variant="flush">
						<MenuItem
							icon={<FaChartBar />}
							text="Dashboard"
							isActive={activeTab === 'Dashboard'}
							onClick={() => setActiveTab('Dashboard')}
						/>
						<MenuItem
							icon={<FaBox />}
							text="Products"
							isActive={activeTab === 'Products'}
							onClick={() => setActiveTab('Products')}
						/>
					</ListGroup>
				</Offcanvas.Body>
			</Offcanvas>

			{/* Main Content */}
			<div className="flex-grow-1 w-100">
				{/* Mobile Header */}
				<div className="d-sm-none d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
					<h2 className="mb-0">{activeTab}</h2>
					<Button variant="outline-warning" onClick={toggleSidebar}>
						<FaBars />
					</Button>
				</div>

				<Container fluid className="p-4">
					{renderContent()}
				</Container>
			</div>
		</div>
	);
};

const MenuItem = ({ icon, text, isActive, onClick }) => (
	<ListGroup.Item
		action
		onClick={onClick}
		active={isActive}
		className="d-flex align-items-center gap-2"
	>
		<span>{icon}</span>
		{text}
	</ListGroup.Item>
);

const DashboardCard = ({ title, value, icon }) => (
	<Card className="mb-4 shadow-sm">
		<Card.Body className="d-flex align-items-center">
			<div className="p-3 bg-light rounded-circle">{icon}</div>
			<div className="ms-3">
				<Card.Title className="mb-0">{title}</Card.Title>
				<h2 className="fw-bold">{value}</h2>
			</div>
		</Card.Body>
	</Card>
);

export default AdminDashboard;

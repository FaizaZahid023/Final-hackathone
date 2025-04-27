
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Spinner, Image } from 'react-bootstrap';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AddProductModal = ({ isOpen, onClose, product, setProducts }) => {
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		description: '',
		image: null,
	});
	const [previewImage, setPreviewImage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 🔁 Prefill on edit
	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name || '',
				price: product.price || '',
				description: product.description || '',
				image: null, // actual file will be set if changed
			});
			setPreviewImage(product.image || '');
		} else {
			setFormData({ name: '', price: '', description: '', image: null });
			setPreviewImage('');
		}
	}, [product]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, image: file });

			const reader = new FileReader();
			reader.onloadend = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsSubmitting(true);

		const token = localStorage.getItem('token');
		const data = new FormData();
		data.append('name', formData.name);
		data.append('price', formData.price);
		data.append('description', formData.description);
		if (formData.image) {
			data.append('image', formData.image);
		}

		try {
			let response;
			if (product) {
				// ✏️ Update product
				response = await axios.put(`${apiUrl}/products/${product._id}`, data, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				});
				setProducts((prev) =>
					prev.map((p) => (p._id === product._id ? response.data : p))
				);
			} else {
				// ➕ Add product
				response = await axios.post(`${apiUrl}/products/add`, data, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				});
				setProducts((prev) => [...prev, response.data.product]);
			}

			onClose();
			setFormData({ name: '', price: '', description: '', image: null });
			setPreviewImage('');
		} catch (error) {
			console.error('Product save failed:', error.response?.data || error.message);
			alert('Failed: ' + (error.response?.data?.message || error.message));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal show={isOpen} onHide={onClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton>
					<Modal.Title>{product ? 'Update Product' : 'Add New Product'}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>Product Name</Form.Label>
						<Form.Control
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							disabled={isSubmitting}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Price</Form.Label>
						<Form.Control
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							required
							min="0"
							step="0.01"
							disabled={isSubmitting}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							name="description"
							value={formData.description}
							onChange={handleChange}
							disabled={isSubmitting}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Product Image</Form.Label>
						{previewImage ? (
							<div className="text-center">
								<Image src={previewImage} thumbnail className="mb-2" style={{ maxHeight: '150px' }} />
								<br />
								<Button
									variant="outline-danger"
									size="sm"
									onClick={() => {
										setFormData({ ...formData, image: null });
										setPreviewImage('');
									}}
									disabled={isSubmitting}
								>
									Remove Image
								</Button>
							</div>
						) : (
							<Form.Control
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								disabled={isSubmitting}
							/>
						)}
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Spinner animation="border" size="sm" className="me-2" />
								{product ? 'Updating...' : 'Adding...'}
							</>
						) : (
							product ? 'Update Product' : 'Add Product'
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AddProductModal;

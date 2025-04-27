import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import { Modal, Button, Spinner, Card, Row, Col } from 'react-bootstrap';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔄 Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        const fetched = Array.isArray(response.data) ? response.data : response?.data?.products || [];
        setProducts(fetched);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ❌ Handle Delete with actual API
  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${apiUrl}/products/${selectedProduct._id}`);
      setProducts(products.filter(product => product._id !== selectedProduct._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Products</h1>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          variant="primary"
        >
          Add Product
        </Button>
      </div>

      {/* 🔄 Loading State */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map(product => (
            <Col key={product._id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={product.image || '/placeholder-image.jpg'}
                  alt={product.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>${product.price}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                      variant="warning"
                      disabled={isAdding}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsDeleteModalOpen(true);
                      }}
                      variant="danger"
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ➕ Add or ✏️ Edit Product Modal */}
      <AddProductModal
        key={isModalOpen ? 'open' : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        setProducts={setProducts}
        setIsAdding={setIsAdding}
      />

      {/* ❗ Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <Modal show={isDeleteModalOpen} onHide={() => setIsDeleteModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedProduct?.title}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Spinner animation="border" size="sm" /> : 'Delete'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Products;

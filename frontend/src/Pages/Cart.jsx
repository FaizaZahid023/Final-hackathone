import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Row, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from '../store/cartSlice.mjs';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Product Card Component
const Product = ({ _id, title, price, quantity, description, image }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // make sure it's already declared at the top


  return (
    <Card className="mb-4 text-white shadow-sm" style={{
      backgroundColor: '#1c1c1c',
      borderRadius: '10px',
      padding: '1rem',
    }}>
      <Row className="align-items-center">
        <Col md={3} className="text-center">
          <img
            className="img-fluid rounded"
            src={image}
            alt={name}
            style={{ maxHeight: '120px' }}
          />
        </Col>

        <Col md={6}>
          {/* <h5 className="text-white">Title: {name}</h5> */}
          <p className="text-white mb-1"><strong>Title:</strong> {title}</p>

          <p className="text-white mb-1"><strong>Description:</strong> {description}</p>
          <p className="text-white mb-1"><strong>Price:</strong> ${price}</p>
          <Badge pill bg="light" text="dark">Quantity: {quantity}</Badge>

          <div className="mt-2 d-flex gap-2 align-items-center">
            <Button variant="outline-light" size="sm" onClick={() => dispatch(decrementQuantity(_id))}>-</Button>
            <span className="text-white">{quantity}</span>
            <Button variant="outline-light" size="sm" onClick={() => dispatch(incrementQuantity(_id))}>+</Button>
          </div>

          <h5 className="mt-3 text-warning">Total: ${price * quantity}</h5>
        </Col>

        <Col md={3} className="text-center d-flex flex-column justify-content-between">
          <Button
            variant="danger"
            size="sm"
            className="mb-2 w-100"
            onClick={() => dispatch(removeFromCart(_id))}
          >
            Remove
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() =>navigate ( '/products')}
          >
            Continue Shopping
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

// Main Cart Page Component
const Cart = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const products = useSelector((state) => state.cart.items);

  const total = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await response.json();
        if (data.success) {
          setLoggedIn(true);
        } else {
          toast.error('Please login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoggedIn(false);
      }
    };

    fetchItems();
  }, [navigate]);

  if (!isLoggedIn) return null;

  return (
    <Container className="py-5 text-white">
      <h2 className="mb-4">Your Cart</h2>
      <Row>
        <Col md={12}>
          {products.length > 0 ? (
            <>
              {products.map((product) => (
                <Product key={product._id} {...product} />
              ))}
              <h4 className="mt-4 text-end">Total Amount: <span className="text-warning">${total}</span></h4>
              <div className="text-end mt-3">
                <Button variant="primary" className="px-4">Proceed to Checkout</Button>
              </div>
            </>
          ) : (
            <p>No products in your cart</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;

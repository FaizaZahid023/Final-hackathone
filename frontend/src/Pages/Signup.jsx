
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import { Button, Form as BootstrapForm, Row, Col, Card } from 'react-bootstrap';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Validation Schema (Same as Backend Joi)
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "name can only contain letters and numbers (No spaces or special characters)")
    .min(3, "name must be at least 3 characters long")
    .max(20, "name cannot exceed 20 characters")
    .required("name is required"),

  email: Yup.string()
    .email("Enter a valid email address (e.g., example@domain.com)")
    .matches(/^[^\s@]+@[^\s@]+\.(com|net)$/, "Only .com and .net domains are allowed")
    .required("Email is required"),

  password: Yup.string()
    .min(3, "Password must be at least 3 characters long")
    .max(30, "Password must not exceed 30 characters")
    .matches(/^[^\s]*$/, "Only letters (A-Z, a-z) and numbers (0-9) are allowed. No spaces.")
    .matches(/^[a-zA-Z0-9]*$/, "Only letters (A-Z, a-z) and numbers (0-9) are allowed.")
    .required("Password is required"),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient p-3">
      <Card className="w-100 shadow-lg" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <p className="text-center text-muted mb-4">Create a new account and get started</p>

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const response = await fetch(`${apiUrl}/auth/user`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });

                const data = await response.json();
                setLoading(false);
                if (response.ok) {
                  toast.success(data.message);
                  navigate('/');
                } else {
                  toast.error(data.message || "An error occurred while signing up");
                }
              } catch (error) {
                setLoading(false);
                toast.error(error.message || "An error occurred while signing up");
              }
            }}
          >
            <Form>
              <BootstrapForm.Group controlId="formName">
                <BootstrapForm.Label>Your Name</BootstrapForm.Label>
                <Field
                  name="name"
                  type="text"
                  as={BootstrapForm.Control}
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </BootstrapForm.Group>

              <BootstrapForm.Group controlId="formEmail">
                <BootstrapForm.Label>Email Address</BootstrapForm.Label>
                <Field
                  name="email"
                  type="email"
                  as={BootstrapForm.Control}
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </BootstrapForm.Group>

              <BootstrapForm.Group controlId="formPassword">
                <BootstrapForm.Label>Password</BootstrapForm.Label>
                <div className="position-relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    as={BootstrapForm.Control}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-danger" />
              </BootstrapForm.Group>

              <Button
                type="submit"
                className="w-100 my-3"
                variant="primary"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Form>
          </Formik>

          <div className="text-center mt-3">
            <p className="text-muted">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp;

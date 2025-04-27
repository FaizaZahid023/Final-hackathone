import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Form, Modal, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setTaskToEdit, updateTask } from "../store/taskSlice.mjs";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Task = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks.tasks);
  const taskToEdit = useSelector((state) => state.tasks.taskToEdit);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [showMoveDropdownId, setShowMoveDropdownId] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      dispatch(setTasks(data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });
      const data = await response.json();
      if (response.ok) {
        setTitle("");
        setDescription("");
        setStatus("To Do");
        fetchTasks();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    dispatch(setTaskToEdit(task));
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/tasks/${taskToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateTask(data));
        setTitle("");
        setDescription("");
        setStatus("To Do");
        dispatch(setTaskToEdit(null));
        fetchTasks();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateTask(data));
        fetchTasks();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  const renderTaskCard = (task) => (
    <Card key={task._id} className="mb-3 shadow-sm rounded-4 border-0" style={{ backgroundColor: "#f9f9f9" }}>
      <Card.Body>
        <Card.Title className="fw-bold text-dark">{task.title}</Card.Title>
        <Card.Text className="text-muted">{task.description}</Card.Text>
        <div className="d-flex justify-content-between mt-3">
          <div>
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2 rounded-pill"
              onClick={() => handleEdit(task)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              className="rounded-pill"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </Button>
          </div>
          <div>
            <Dropdown show={showMoveDropdownId === task._id} onToggle={(isOpen) => setShowMoveDropdownId(isOpen ? task._id : null)}>
              <Dropdown.Toggle variant="outline-secondary" size="sm" className="rounded-pill">
                Move
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleMoveTask(task._id, "To Do")}>To Do</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMoveTask(task._id, "In Progress")}>In Progress</Dropdown.Item>
                <Dropdown.Item onClick={() => handleMoveTask(task._id, "Done")}>Done</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      <h2 className="text-center mb-5 fw-bold text-primary">Task Management</h2>

      {/* Add Task Form */}
      <Card className="mb-5 shadow rounded-4">
        <Card.Body>
          <Form onSubmit={taskToEdit ? handleUpdateTask : createTask}>
            <Row className="align-items-end g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="rounded-3"
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="rounded-3"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2} className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  className="rounded-pill"
                >
                  {taskToEdit ? "Update" : "Add"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* 3 Columns for Tasks */}
      <Row className="g-4">
        <Col md={4}>
          <div className="p-3 bg-light rounded-4 shadow-sm">
            <h4 className="text-center text-primary fw-bold">To Do</h4>
            {todoTasks.length ? todoTasks.map(renderTaskCard) : <p className="text-center text-muted">No tasks</p>}
          </div>
        </Col>

        <Col md={4}>
          <div className="p-3 bg-light rounded-4 shadow-sm">
            <h4 className="text-center text-info fw-bold">In Progress</h4>
            {inProgressTasks.length ? inProgressTasks.map(renderTaskCard) : <p className="text-center text-muted">No tasks</p>}
          </div>
        </Col>

        <Col md={4}>
          <div className="p-3 bg-light rounded-4 shadow-sm">
            <h4 className="text-center text-success fw-bold">Done</h4>
            {doneTasks.length ? doneTasks.map(renderTaskCard) : <p className="text-center text-muted">No tasks</p>}
          </div>
        </Col>
      </Row>

      {/* Modal for Editing Task */}
      {taskToEdit && (
        <Modal show={true} onHide={() => dispatch(setTaskToEdit(null))} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3 rounded-3"
              />
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-3 rounded-3"
              />
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="rounded-3"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Form.Select>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => dispatch(setTaskToEdit(null))}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateTask}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Task;

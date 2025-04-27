
import Task from "../models/task/index.mjs";

// Create a new Task
 const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({ title, description, assignedTo });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks
 const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
 const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
 const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Move Task (Change Status)
//  const moveTask = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     task.status = status;
//     await task.save();
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const moveTask = async (req, res) => {
  try {
    const { status } = req.body; // Expecting status as part of the request body
    const task = await Task.findById(req.params.id); // Find the task by ID

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate the new status
    if (!["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    task.status = status; // Update task status
    await task.save(); // Save the task with the new status

    res.json(task); // Send back the updated task
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createTask, getTasks, updateTask, deleteTask, moveTask }
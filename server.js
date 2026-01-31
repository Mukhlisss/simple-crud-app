const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// Load tasks from file
const DATA_FILE = "./tasks.json";

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// CRUD APIs

// READ
app.get("/tasks", (req, res) => {
  res.json(readTasks());
});

// CREATE
app.post("/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = { id: Date.now(), title: req.body.title };
  tasks.push(newTask);
  writeTasks(tasks);
  res.json(newTask);
});

// UPDATE
app.put("/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Not found" });
  task.title = req.body.title;
  writeTasks(tasks);
  res.json(task);
});

// DELETE
app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);
  res.json({ success: true });
});

// Serve frontend
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

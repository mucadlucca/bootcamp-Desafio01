const express = require("express");

const app = express();

let numberOfRequest = 0;

const projects = [];

app.use(express.json());

/**
 * Midlleware that logs the number of requests
 */
function logRequests(req, res, next) {
  numberOfRequest++;

  console.log(`Número de requisições: ${numberOfRequest}`);

  return next();
}

/**
 * Middleware that checks if a project exists
 */
function projectIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/**
 * Middleware that blocks a creation of two projects with the same ID
 */
function projectIdExists2(req, res, next) {
  const { id } = req.body;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return next();
  }

  return res.status(400).json({ error: "Id already exists" });
}

app.use(logRequests);

/**
 * Projects
 */
app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", projectIdExists2, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

app.put("/projects/:id", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(projects);
});

app.delete("/projects/:id", projectIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Tasks
 */
app.post("/projects/:id/tasks", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

app.listen(3333);

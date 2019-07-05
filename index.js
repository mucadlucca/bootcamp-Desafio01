const express = require("express");

const app = express();

let numberOfRequest = 0;

const projects = [];

app.use(express.json());

app.use((req, res, next) => {
  numberOfRequest++;

  console.log(numberOfRequest);

  return next();
});

function projectIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Id does not exist" });
  }

  return next();
}

function projectIdExists2(req, res, next) {
  const { id } = req.body;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return next();
  }

  return res.status(400).json({ error: "Id already exist" });
}

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", projectIdExists2, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: []
  });

  return res.json(projects);
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

  const project = projects.findIndex(p => p.id === id);

  projects.splice(project, 1);

  return res.send();
});

app.post("/projects/:id/tasks", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(projects);
});

app.listen(3333);

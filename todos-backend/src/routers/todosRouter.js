import { Router } from 'express';
import { todos, saveTodos } from '../models/todosModel.js';

const todosRouter = Router();

// base path: /todos
todosRouter.post('/', (req, res) => {
    // extract
    const { title } = req.body;
    // validate
    if (title === undefined || title.trim() === '') {
        return res.status(400).send('Title is required');
    };
    // process
    const calculateId = todos.reduce((pre, cur) => (pre > cur.id ? pre : cur.id), -1) + 1;
    const calculateUserId = todos.reduce((pre, cur) => (pre > cur.userId ? pre : cur.userId), -1) + 1;
    const newTodo = {
        userId: calculateUserId,
        id: calculateId,
        title: title.trim(),
        completed: false
    }
    todos.push(newTodo);
    // log
    console.log();
    console.log(`[${req.method} ${req.originalUrl}]`);
    console.log(`params: ${JSON.stringify(req.params)}`);
    console.log(`body: ${JSON.stringify(req.body)}`);
    console.log("size" + todos.length);
    console.log(`return: ${JSON.stringify(newTodo)}`);
    console.log(newTodo);
    // saveTodos
    saveTodos();
    // respond
  res.status(200).json(newTodo);
});

todosRouter.get('/', (req, res) => {
  console.log();
  console.log(`[${req.method} ${req.originalUrl}]`);
  console.log(`params: ${JSON.stringify(req.params)}`);
  console.log(`body: ${JSON.stringify(req.body)}`);
  console.log("size" + todos.length);
  console.log(`return: ${JSON.stringify(todos)}`);
  res.status(200).json(todos);
});

todosRouter.get('/:id', (req, res) => {
  console.log();
  console.log(`[${req.method} ${req.originalUrl}]`);
  console.log(`params: ${JSON.stringify(req.params)}`);
  console.log(`body: ${JSON.stringify(req.body)}`);
  console.log("size" + todos.length);
  const todo = todos.find(t => t.id === Number(req.params.id));
  console.log(`return: ${JSON.stringify(todo)}`);
  res.status(200).json(todo);
});

todosRouter.put('/:id', (req, res) => {
  const id = req.params.id;
  const todo = todos.find(t => t.id === Number(id));
  if (todo) {
    const { title, completed } = req.body;
    if (title !== undefined) todo.title = title.trim();
    if (completed !== undefined) todo.completed = completed;
    saveTodos();
    res.status(200).json(todo);
  } else {
    res.status(404).send(`Todo with id ${id} not found`);
  }
});

todosRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex(t => t.id === Number(id));
  if (index !== -1) {
    const deletedTodo = todos.splice(index, 1)[0];
    saveTodos();
    res.status(200).json(deletedTodo);
  } else {
    res.status(404).send(`Todo with id ${id} not found`);
  }
});

export default todosRouter;
import express from 'express';
import cors from 'cors';
import { todos } from './models/todos.js';

const PORT = 3000;
const app = express();
const Host = 'localhost';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/todos', (req, res) => {
    // extract
    const { title } = req.body;
    // validate
    if (title === undefined || title.trim() === '') {
        return res.status(400).send('Title is required');
    };
    // process
    const calculateId = todos.reduce((pre, cur) => (pre > cur.id ? pre : cur.id), -1) + 1;
    const newTodo = {
        userId: 1,
        id: calculateId,
        title: title.trim(),
        completed: false
    }
    todos.push(newTodo);
    console.log("size" + todos.length);
    console.log(newTodo);
    // respond
  res.status(200).json(newTodo);
});

app.get('/todos', (req, res) => {
  res.send('Get /todos endpoint');
});

app.get('/todos/:id', (req, res) => {
  res.send(`Get /todos/${req.params.id} endpoint`);
});

app.put('/todos/:id', (req, res) => {
  res.send(`Put /todos/${req.params.id} endpoint`);
});

app.delete('/todos/:id', (req, res) => {
  res.send(`Delete /todos/${req.params.id} endpoint`);
});

app.listen(PORT, Host, () => {
  console.log(`Server is running at http://${Host}:${PORT}`);
});
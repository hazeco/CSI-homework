// pm (project manager)
import express from 'express';
import cors from 'cors';
import todosRouter from './routers/todosRouter.js';
import { loadTodos, todos } from './models/todosModel.js';

const app = express();

const PORT = 3000;
const Host = 'localhost';

app.use(cors());
app.use(express.json());

// introduce the todos router
app.use('/todos', todosRouter);


app.listen(PORT, Host, () => {
  loadTodos();
  console.log('Todos loaded:', todos.length);
  console.log(`Server is running at http://${Host}:${PORT}`);
});
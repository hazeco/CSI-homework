import fs from 'node:fs';

export let todos = [];

const todosFilename = './database/todos.json';

export const saveTodos = () => {
  fs.writeFileSync(todosFilename, JSON.stringify(todos));
}

export const loadTodos = () => {
 // ckeck not exist todes.json
  if (fs.existsSync(todosFilename)) {
    todos = JSON.parse(fs.readFileSync(todosFilename));
  } 
  else { 
    saveTodos();
  }
}
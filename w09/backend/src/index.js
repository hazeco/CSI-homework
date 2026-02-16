import express from 'express';
import cors from 'cors';
import usersRouter from './routers/usersRouter.js';

const HOST = 'localhost'
const PORT = 5000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
});
import { Router } from "express";
import { createUser } from "../controller/usersController.js";

const usersRouter = Router()

// crud api
// register (user, pass) -> database
// localhost:5000/users/register
usersRouter.post('/register', async (req, res) => {
    // (user, pass, roleId) -> database
    // extract data from req.body
    const { username, password, role_id } = req.body
    // validate
    
    // process
    try {
        await createUser(username, password, role_id)
        res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
});

// login (user, pass) -> gen token -> frontend

// verify (token) -> check authorize (Admin, User, Manager) -> frontend

export default usersRouter
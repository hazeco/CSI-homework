import { Router } from "express";
import {
    createUser,
    getUserByUsername,
    getRoleNamebyUserId,
    getAllUsers,
    getUsersByRoleNames
} from "../controller/usersController.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// env process
dotenv.config();

const usersRouter = Router()

// crud api
// register (user, pass) -> database
// localhost:5000/users/register
usersRouter.post('/register', async (req, res) => {
    // (user, pass, roleId) -> database
    // extract data from req.body
    const { username, password, role_id } = req.body
    // validate
    if (!username || !password || !role_id) {
        return res.status(400).json({ message: "Missing required fields" })
    }
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
usersRouter.post('/login', async (req, res) => {
    // extract data from req.body
    const { username, password } = req.body
    // check username
    const user = await getUserByUsername(username)
    // console.log(username)
    console.log(`${username}`)
    console.log(user)
    if (user === undefined)
        return res.status(404).json({ message: "User not found" })
    const result = await bcryptjs.compare(password, user.password)
    console.log(result)
    if (!result)
        return res.status(401).json({ message: "Unauthorized" })
    // generate token
    const token = jwt.sign(
        { id: user.id, username: user.username, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    //send token to frontend
    res.status(200).json({ message: "Login successful", token })
});

// middleware for chcking token
const jwtTokenMiddleware = (req, res, next) => {
    // Bearer eyJhb ... -> split(' ') -> [Bearer, eyJhb...]
    const token = req.headers.authorization?.split(' ')[1]

    //verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            req.jwtExpried = true
            req.userId = null
            req.roleId = null
        } else {
            req.jwtExpried = false
            req.userId = payload.id
            req.roleId = payload.role_id
        }
    })
    next()
}

// verify (token) -> check authorize (Admin, User, Manager) -> frontend
usersRouter.get('/verify', jwtTokenMiddleware, async (req, res) => {
    if (req.jwtExpried) return res.status(401).json({ message: "token expried" })

    // get role "name" by role_id
    const result = await getRoleNamebyUserId(req.userId)

    res.status(200).json({ message: "Token is valid", role: result[0].role })
})

// list users -> role-based access
// admin: see all users
// manager: see only manager and worker
// worker: forbidden
usersRouter.get('/list', jwtTokenMiddleware, async (req, res) => {
    if (req.jwtExpried) return res.status(401).json({ message: "token expried" })

    // role_id: 1=admin, 2=manager, 3=worker
    if (req.roleId === 3) {
        return res.status(403).json({ message: "Unauthorized: Worker cannot access user list" })
    }

    try {
        let users
        if (req.roleId === 1) {
            // Admin sees all users
            users = await getAllUsers()
        } else if (req.roleId === 2) {
            // Manager sees only manager and worker
            users = await getUsersByRoleNames(['manager', 'worker'])
        }
        res.status(200).json({ users })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})

export default usersRouter
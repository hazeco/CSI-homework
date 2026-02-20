import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

// env process
dotenv.config();

const config = {
    // DB_HOST = localhost
    // DB_USER = admin
    // DB_PASSWORD = admin
    // DB_DATABASE = jwt
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}


const query = async (sql, params) => {
    const connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(sql, params);
    connection.end();
    return rows;
}

export const createUser = async (username, password, role_id) => {
    const encryptedPassword = await bcryptjs.hash(password, 10)
    const sql = 'INSERT INTO users (username, password, role_id) values (?, ?, ?)'
    const params = [username, encryptedPassword, role_id]
    const result = await query(sql, params)
    return result
}

export const getUserByUsername = async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?'
    const params = [username]
    const result = await query(sql, params)
    return result[0]
}

export const getRoleNamebyUserId = async (id) => {
    const sql = 'SELECT users.id AS id, users.username AS name, roles.name AS role FROM users RIGHT JOIN roles ON users.role_id = roles.id WHERE users.id = ?'
    const params = [id]
    const result = await query(sql, params)
    return result
}

export const getAllUsers = async () => {
    const sql = 'SELECT users.id, users.username, roles.name AS role FROM users JOIN roles ON users.role_id = roles.id ORDER BY users.id'
    const result = await query(sql, [])
    return result
}

export const getUsersByRoleNames = async (roleNames) => {
    const placeholders = roleNames.map(() => '?').join(', ')
    const sql = `SELECT users.id, users.username, roles.name AS role FROM users JOIN roles ON users.role_id = roles.id WHERE roles.name IN (${placeholders}) ORDER BY users.id`
    const result = await query(sql, roleNames)
    return result
}
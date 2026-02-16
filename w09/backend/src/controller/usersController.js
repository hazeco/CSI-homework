import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
    port: 3307,
    password: process.env.DB_PASSWORD,
}


const query = async (sql, params) => {
    const connection = await mysql.createConnection(...config);
    const [rows] = await connection.execute(sql, params);
    connection.end();
    return rows;
}

export const createUser = async (username, password, roleId) => {
    const encryptedPassword = await bcryptjs.hash(password, 10)
    const sql = 'INSERT INTO users (username, password, role_id) values (?, ?, ?)'
    const params = [username, encryptedPassword, roleId]
    const result = await query(sql, params)
    return result
}

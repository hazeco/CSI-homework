import { Router } from 'express'
import multer from 'multer'
import fs from 'node:fs'
import { listFiles, uploadFile } from '../controllers/fileController.js'

const fileRouter = Router()
const upload = multer({ dest: './public' })

// api
fileRouter.get('/list', listFiles)

fileRouter.post('/upload',
    // Step 1: Mark aborted flag and listen for client disconnect
    (req, res, next) => {
        req.clientAborted = false
        req.on('close', () => {
            req.clientAborted = true
            // If multer already saved a temp file, delete it immediately
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Cleanup error on abort:', err)
                })
            }
        })
        next()
    },
    // Step 2: Run multer, then check abort before proceeding
    (req, res, next) => {
        upload.single('file')(req, res, (err) => {
            if (err) return res.status(400).json({ message: err.message })
            // If client aborted while multer was writing, delete the temp file
            if (req.clientAborted && req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Cleanup error:', unlinkErr)
                })
                return // connection already closed, no response needed
            }
            next()
        })
    },
    uploadFile
)

export default fileRouter
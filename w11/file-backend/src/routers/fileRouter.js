import { Router } from 'express'
import multer from 'multer'
import { listFiles, uploadFile } from '../controllers/fileController.js'

const fileRouter = Router()
const upload = multer({ dest: './public' })

// api
fileRouter.get('/list', listFiles)

fileRouter.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message })
        next()
    })
}, uploadFile)

export default fileRouter
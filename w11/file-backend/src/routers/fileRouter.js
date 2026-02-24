import { Router } from 'express'
import multer from 'multer'
import fs from 'node:fs/promises'

const fileRouter = Router()
const upload = multer({ dest: './public' })

// api
fileRouter.get('/list', async (req, res) => {
    const files = await fs.readdir('./public')
    if (files.length === 0) return res.status(204).json({ message: 'no files' })

    const filesReturn = []
    files.forEach((file) =>
        filesReturn.push(
            {
                name: file,
                url: `http://localhost:3000/shared/${file}`
            }
        )
    )

    res.status(200).json({ message: 'success', files: filesReturn })
})

fileRouter.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message })
        next()
    })
}, async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'no file uploaded' })
    
    const oldPath = req.file.path
    const newPath = `./public/${req.file.originalname}`
    
    await fs.rename(oldPath, newPath)
    res.status(200).json({ message: 'file uploaded successfully' })
})

export default fileRouter
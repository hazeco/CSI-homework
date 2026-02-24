import { Router } from 'express'
import fs from 'node:fs/promises'

const fileRouter = Router()

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

fileRouter.post('/upload', async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).json({ message: 'no file uploaded' })
    const file = req.files.file
    await file.mv(`./public/${file.name}`)
    res.status(200).json({ message: 'file uploaded successfully' })
})

export default fileRouter
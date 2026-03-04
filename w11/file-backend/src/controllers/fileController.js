import fs from 'node:fs/promises'

// List all files
export const listFiles = async (req, res) => {
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
}

// Upload file
export const uploadFile = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'no file uploaded' })
    // filename extension check
    const [filename, extension] = req.file.originalname.split('.')
    const newFileName = `${filename}-${Date.now()}.${extension}`

    const oldPath = req.file.path
    const newPath = `./public/${newFileName}`

    // Client already aborted before we could rename — delete temp file
    if (req.clientAborted) {
        await fs.unlink(oldPath)
        return
    }

    await fs.rename(oldPath, newPath)

    // Client aborted during rename — delete the renamed file
    if (req.clientAborted) {
        await fs.unlink(newPath)
        return
    }

    res.status(200).json({ message: 'file uploaded successfully' })
}

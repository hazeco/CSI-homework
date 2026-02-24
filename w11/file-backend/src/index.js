import express from "express";
import cors from "cors";
import multer from "multer";
import fileRouter from "./routers/fileRouter.js";

const HOST = "localhost";
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/shared', express.static("./public"));
app.use('/files', fileRouter);

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
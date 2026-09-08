import express from 'express';
import type {Application, Request, Response} from 'express';
import 'dotenv/config';

const app: Application = express();
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
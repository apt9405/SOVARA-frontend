import express from 'express';
import type {Application, Request, Response} from 'express';
import 'dotenv/config';
import authRouter from './auth/routes.js';

const app: Application = express();
const PORT = Number(process.env.SERVER_PORT ?? 3000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:8080';

app.disable('x-powered-by');
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (request.method === 'OPTIONS') {
        response.status(204).end();
        return;
    }
    next();
});
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: false}));
app.get('/health', (_request: Request, response: Response) => {
    response.json({ok: true});
});
app.use(authRouter);

app.use((error: unknown, _request: Request, response: Response, _next: unknown) => {
    console.error('[server] request failed', error);
    response.status(500).json({error: 'internal_server_error'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors';
import morgan from 'morgan';
import { Env, environmentSetup, logType } from './envSetup.js';
import expressRoutes from './express/expressRoutes.js';
import { error } from 'console';
import { Code } from 'mongodb';
import { DatabaseManager } from './database/databaseManager.js';

environmentSetup()
await DatabaseManager.init(Env.MONGOURI,Env.MONGODB)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const expressRoot = express()

//Middleware 
expressRoot.use(cors({
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific HTTP methods
  allowedHeaders: "Content-Type, Authorization", // Allow specific headers
  preflightContinue: false, // Do not pass the preflight request to the next handler
  optionsSuccessStatus: 204 // Respond with 204 for successful preflight requests
}));

expressRoot.use(express.json({ limit: '50mb' })); // Increase the limit to 50mb for large JSON payloads
expressRoot.use(express.urlencoded({ extended: true }));
expressRoot.use(morgan("dev"));
expressRoot.use((req, res, next) => {
  const reqData = {
    path: req.path,
    body: req.body,
    params: req.params,
    query: req.query,
    method: req.method,
    status: res.statusCode,
    ip: req.ip
  }

  if (logType["express"]) {
    console.log("🔷", reqData);
  }

  next();
});

expressRoot.use(expressRoutes);

// Home route - HTML
expressRoot.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express + Bun ${process.versions.bun} on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express + Bun ${process.versions.bun} on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

expressRoot.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
expressRoot.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
expressRoot.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

expressRoot.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({...err,message: err.message});

})
export default expressRoot

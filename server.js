import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve .well-known files with correct Content-Type
app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(join(__dirname, 'dist', '.well-known', 'apple-app-site-association'));
});

app.get('/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(join(__dirname, 'dist', '.well-known', 'apple-app-site-association'));
});

app.get('/.well-known/assetlinks.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.sendFile(join(__dirname, 'dist', '.well-known', 'assetlinks.json'));
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Redirect www to non-www
app.use((req, res, next) => {
    if (req.hostname && req.hostname.startsWith('www.')) {
        return res.redirect(301, `https://${req.hostname.slice(4)}${req.url}`);
    }
    next();
});

// Catch-all route to serve index.html for any unmatched routes (supports client-side routing)
app.get('*', function (req, res) {
    // Only serve index.html for requests that do NOT contain a dot (.)
    if (!req.path.includes('.')) {
        res.sendFile(join(__dirname, 'dist', 'index.html'));
    } else {
        res.status(404).end();
    }
});

// Start the server on the specified port (or 8080 by default)
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
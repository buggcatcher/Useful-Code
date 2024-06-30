const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files
app.use(express.static(__dirname));

// Enable directory listing
app.use('/assets', serveIndex(path.join(__dirname, 'assets'), { 'icons': true }));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
    console.log(`Frontend test server running at http://localhost:${PORT}`);
});

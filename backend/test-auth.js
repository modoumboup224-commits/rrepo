const http = require('http');

function sendPostRequest(path, data) {
    const options = {
        hostname: 'localhost',
        port: 6300,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            console.log(`Response from ${path}:`, responseData);
        });
    });

    req.on('error', (error) => {
        console.error(`Error with request to ${path}:`, error);
    });

    req.write(data);
    req.end();
}

const registerData = JSON.stringify({ username: 'testuser', password: 'testpass' });
const loginData = JSON.stringify({ username: 'testuser', password: 'testpass' });

sendPostRequest('/api/auth/register', registerData);

setTimeout(() => {
    sendPostRequest('/api/auth/login', loginData);
}, 2000);

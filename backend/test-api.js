const http = require('http');

const request = (options, postData = null) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: data ? JSON.parse(data) : null });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
};

(async () => {
    try {
        console.log("Testing POST /api/flora...");
        let res = await request({
            hostname: 'localhost', port: 5000, path: '/api/flora', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { commonName: "Test Flora" });
        console.log("POST /api/flora:", res.statusCode, res.body);

        console.log("Testing GET /api/flora...");
        res = await request({
            hostname: 'localhost', port: 5000, path: '/api/flora', method: 'GET'
        });
        console.log("GET /api/flora:", res.statusCode, Array.isArray(res.body) ? "Success" : "Failed");

        console.log("Testing POST /api/fauna...");
        res = await request({
            hostname: 'localhost', port: 5000, path: '/api/fauna', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { commonName: "Test Fauna" });
        console.log("POST /api/fauna:", res.statusCode, res.body);

        console.log("Testing GET /api/fauna...");
        res = await request({
            hostname: 'localhost', port: 5000, path: '/api/fauna', method: 'GET'
        });
        console.log("GET /api/fauna:", res.statusCode, Array.isArray(res.body) ? "Success" : "Failed");

        console.log("Testing POST /api/admin/login...");
        res = await request({
            hostname: 'localhost', port: 5000, path: '/api/admin/login', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: "admin@gmail.com", password: "admin123" });
        console.log("POST /api/admin/login:", res.statusCode, res.body);

        console.log("Testing GET /");
        res = await request({
            hostname: 'localhost', port: 5000, path: '/', method: 'GET'
        });
        console.log("GET /:", res.statusCode, res.body);
    } catch (e) {
        console.error("Test failed:", e.message);
    }
})();

const express = require('express');
const request = require('request');

const app = express();

app.all('*', (req, res, next) => {
    // Set CORS headers: allow all origins, methods, and headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Target-URL');

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.status(200).send();
    } else {
        const targetURL = req.get('Target-URL');
        if (!targetURL) {
            res.status(500).send(
                'There is no Target-URL header in the request'
            );
            return;
        }
        request(
            {
                url: targetURL,
                method: req.method,
                json: req.body,
            },
            (error, response, body) => {
                if (error) {
                    console.error(`Error: ${response.statusCode}`);
                }
            }
        ).pipe(res);
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

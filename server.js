// server.js
import express from 'express';

const app = express();
app.use(express.json());

app.post('/sendOrder', (req, res) => {
    const orderData = req.body;
    // Process the order data here
    res.json({ success: true });
});

export default app;

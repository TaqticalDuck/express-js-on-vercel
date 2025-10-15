export default async function handler(req, res) {
    if (req.method === 'POST') {
        const orderData = req.body;
        console.log('Order received:', orderData);

        // Here you can call Discord webhook from server
        // Example:
        // await fetch(DISCORD_WEBHOOK_URL, {...});

        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

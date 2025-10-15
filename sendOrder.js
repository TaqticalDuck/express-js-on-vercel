export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookUrl = 'https://discord.com/api/webhooks/1428005538217590834/UDZbmZjsVsGn734LQFnQZ_42y4rc5yvys9sOK9fvN6V-Nw4NGKLfHcDwHr0KAK6QUVtQ'; // Replace with your webhook
    const orderData = req.body;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `New Order:\n${JSON.stringify(orderData, null, 2)}` })
        });

        res.status(200).json({ success: true, message: 'Order sent to Discord!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send order' });
    }
}

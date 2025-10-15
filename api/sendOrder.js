// /api/sendOrder.js
export default async function handler(req, res) {
  // ----- CORS Headers -----
  res.setHeader('Access-Control-Allow-Origin', 'https://subtu.rf.gd'); // change to your frontend or use '*' for testing
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST for actual order submissions
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const { playerName, discordTag, orderNotes, items } = body;

    if (!playerName || !discordTag || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1428005538217590834/UDZbmZjsVsGn734LQFnQZ_42y4rc5yvys9sOK9fvN6V-Nw4NGKLfHcDwHr0KAK6QUVtQ";

    const itemsText = items.map(item => {
      let text = `**${item.name}** - ${item.totalPrice}R$`;
      if (item.upgrades?.length > 0) text += ` (${item.upgrades.join(", ")})`;
      return text;
    }).join("\n");

    const payload = {
      content: `**New Order from Enchanted Arsenal**`,
      embeds: [
        {
          title: "Order Details",
          color: 0x8a2be2,
          fields: [
            { name: "Player", value: playerName, inline: true },
            { name: "Discord", value: discordTag, inline: true },
            { name: "Notes", value: orderNotes || "None", inline: false },
            { name: "Items", value: itemsText, inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!discordResponse.ok) {
      const text = await discordResponse.text();
      console.error("Discord webhook failed:", text);
      return res.status(500).json({ success: false, message: "Failed to send order to Discord" });
    }

    return res.status(200).json({ success: true, message: "Order sent to Discord!" });
  } catch (err) {
    console.error("Error in sendOrder:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

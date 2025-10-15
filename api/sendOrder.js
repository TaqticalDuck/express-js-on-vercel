// sendOrder.js
import fetch from "node-fetch";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1428005538217590834/UDZbmZjsVsGn734LQFnQZ_42y4rc5yvys9sOK9fvN6V-Nw4NGKLfHcDwHr0KAK6QUVtQ";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { playerName, discordTag, orderNotes, items } = req.body;

        if (!playerName || !discordTag || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        // Build Discord message
        const itemsText = items.map(item => {
            let text = `**${item.name}** - ${item.totalPrice}R$`;
            if (item.upgrades?.length > 0) {
                text += ` (${item.upgrades.join(", ")})`;
            }
            return text;
        }).join("\n");

        const discordPayload = {
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
            body: JSON.stringify(discordPayload)
        });

        if (!discordResponse.ok) {
            console.error("Discord webhook failed:", await discordResponse.text());
            return res.status(500).json({ success: false, message: "Failed to send order to Discord" });
        }

        return res.status(200).json({ success: true, message: "Order sent to Discord!" });
    } catch (error) {
        console.error("Error in sendOrder:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

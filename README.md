<div align="center">
  <h1>🎧 J2C Bot</h1>
  <p><b>A clean multi-server Join-to-Create Voice Channel bot for Discord</b></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/node-%3E=18-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/status-production-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-MIT-black?style=for-the-badge" />
</div>

---

## ✨ What the Bot Does

- Automatically creates voice channels when users join:
  - **Duo → Duet X**
  - **Trio → Trio X**
  - **Squad → Squad X**
  - **Penta → Penta X**
- Auto-numbering:
  - `Duet 1`, `Duet 2`, `Duet 3`…
- Reuses numbers:
  - If `Duet 2` gets deleted → next user gets **Duet 2**, not 4.
- Auto-deletes empty channels.
- Works on **unlimited servers** (multi-server config).
- Super lightweight, zero clutter.

---

## 🧩 Project Structure

j2c-bot/
├── index.js
├── servers.json
├── .env
├── package.json
└── events/
└── voiceStateUpdate.js

---

## 🚀 Setup

### 1️⃣ Install dependencies

````bash
npm install

2️⃣ Add your token
Create .env:
BOT_TOKEN=your_bot_token_here

3️⃣ Configure your servers
Edit servers.json:
{
  "SERVER_ID_HERE": {
    "duo": "CHANNEL_ID",
    "trio": "CHANNEL_ID",
    "squad": "CHANNEL_ID",
    "penta": "CHANNEL_ID",
    "lounge": "CATEGORY_ID",

    "baseNames": {
      "duo": "Duet",
      "trio": "Trio",
      "squad": "Squad",
      "penta": "Penta"
    },

    "limits": {
      "duo": 2,
      "trio": 3,
      "squad": 4,
      "penta": 5
    }
  }
}
Add as many servers as you want — the bot automatically handles all of them.

▶️ Run the Bot
npm start
You should see:
Logged in as J2C#xxxx

📡 Host 24/7 on VPS
npm install -g pm2
pm2 start index.js --name j2c-bot
pm2 save
pm2 startup

🛑 Required Permissions
Ensure the bot has:
Manage Channels
Move Members
Connect
View Channels
And its role is above all user roles.

📄 License
MIT — free for personal or commercial use.
<div align="center"> <b>Made with ❤️ using discord.js</b> </div> ```
````

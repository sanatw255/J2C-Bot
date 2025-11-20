const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");
const bodyParser = require("body-parser");

require("dotenv").config();
const SECRET = process.env.WEBHOOK_SECRET;

function verify(sig, payload) {
  const hmac = crypto.createHmac("sha256", SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
}

const app = express();
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf }}));

app.post("/deploy", (req, res) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!verify(signature, req.rawBody)) {
    return res.status(401).send("Invalid signature");
  }

  exec("git pull && npm install && pm2 restart j2c-bot", (err, stdout) => {
    if (err) return res.status(500).send(err);
    res.send("Deployed\n" + stdout);
  });
});

app.listen(3001, () => console.log("Webhook listening on port 3001"));

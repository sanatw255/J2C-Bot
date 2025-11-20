// events/voiceStateUpdate.js
const { Events } = require("discord.js");
const servers = require("../servers.json");

module.exports = {
  name: Events.VoiceStateUpdate,

  async execute(oldState, newState, client) {
    if (!client.tempChannels) client.tempChannels = new Map();

    const guildId = newState.guild.id;
    const config = servers[guildId];

    // If this server has no J2C config → ignore
    if (!config) return;

    // Map trigger channel ID → type key (duo, trio, squad, penta)
    const triggerMap = {
      [config.duo]: "duo",
      [config.trio]: "trio",
      [config.squad]: "squad",
      [config.penta]: "penta",
    };

    // ------------------------------
    // DELETE EMPTY TEMP CHANNELS
    // ------------------------------
    if (oldState.channelId && client.tempChannels.has(oldState.channelId)) {
      const oldCh = oldState.guild.channels.cache.get(oldState.channelId);

      if (oldCh && oldCh.members.size === 0) {
        try {
          await oldCh.delete();
        } catch {}
        client.tempChannels.delete(oldState.channelId);
      }
    }

    // ------------------------------
    // USER JOINED A TRIGGER CHANNEL
    // ------------------------------
    const type = triggerMap[newState.channelId];
    if (!type) return; // not Duo/Trio/Squad/Penta

    const baseName = config.baseNames[type];
    const limit = config.limits[type];
    const lounge = config.lounge;

    const guild = newState.guild;

    // Find existing channels with same baseName
    const existing = guild.channels.cache
      .filter(
        (ch) =>
          ch.parentId === lounge &&
          ch.type === 2 &&
          ch.name.startsWith(baseName)
      )
      .map((ch) => ch.name);

    // Extract used numbers
    const usedNumbers = existing
      .map((name) => {
        const num = parseInt(name.split(" ").pop());
        return isNaN(num) ? null : num;
      })
      .filter((n) => n !== null)
      .sort((a, b) => a - b);

    // Find lowest available number
    let nextNumber = 1;
    for (let n of usedNumbers) {
      if (n === nextNumber) nextNumber++;
      else break;
    }

    const finalName = `${baseName} ${nextNumber}`;

    // Create temp VC
    try {
      const tempChannel = await guild.channels.create({
        name: finalName,
        type: 2,
        parent: lounge,
        userLimit: limit,
      });

      client.tempChannels.set(tempChannel.id, true);

      await newState.setChannel(tempChannel);
    } catch (err) {
      console.log("J2C error:", err.message);
    }
  },
};

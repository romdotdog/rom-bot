'use strict';

const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();
const emojis = ["🧢", "🙄", "🖕"]

/* Useful functions */
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

async function latestCopypasta() {
  const results = (await (await fetch("https://www.reddit.com/r/copypasta/new.json")).json())
  return results.data
}

/* Start */
client.on('ready', () => {
  console.log('I am ready!');
});


client.on('message', async message => {
  if (message.mentions.has(client.user)) {
    await message.react()
  }
});

client.login(process.env.TOKEN);
'use strict';

// Good luck reading this you little shit

const Discord = require('discord.js');
const fetch = require('node-fetch');

var client = new Discord.Client(); // expose globally
const emojis = ["🧢", "🙄", "🤔", "🖕"]
const bannedWords = process.env.BANNED_WORDS.split(" ")

/* Useful functions */
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

async function latestCopypasta() {
  const results = await ((await fetch("https://www.reddit.com/r/copypasta.json")).json())
  const post = results.data.children.random().data
  return `**${post.title}**\n${post.selftext}`.substring(0, 2000) || post.title
}

String.prototype.banned = function() {
  return bannedWords.some(w => this.includes(w))
}

/* Snipes */
clisnipes = []

client.on('messageDelete', message => {
  if (message.author.bot) return;
  if (message.content.banned()) return;
  snipes.push({
    type: 'deleted',
    message,
    time: new Date()
  })
})

client.on('messageUpdate', (old, message) => {
  if (message.author.bot) return;
  if (old.content.banned()) return;
  snipes.push({
    type: 'edited',
    message,
    old,
    time: new Date()
  })
})

const formatters = {
  deleted: info => ({
        "description": `**Message deleted in ${info.message.channel.toString()} by ${info.message.author.toString()}**\n${info.message.content}`,
        "color": 15746887,
        "author": {
          "name": info.message.author.tag,
          "icon_url": info.message.author.displayAvatarURL({
            size: 128,
            dynamic: true
          })
        },
        "footer": {
          "text": `Event happened at: `
        },
        "timestamp": info.time.toISOString()
      }),
  
  edited: info => ({
        "description": `Message edited by ${info.message.author.toString()} in ${info.message.channel.toString()}`,
        "color": 7039851,
        "fields": [
          {
            "name": "Old",
            "value": info.old.content || 'An error has occurred.'
          },
          {
            "name": "New",
            "value": info.message.content || 'An error has occurred.'
          }
        ],
        "author": {
          "name": info.message.author.tag || 'An error has occurred.',
          "icon_url": info.message.author.displayAvatarURL({
            size: 128,
            dynamic: true
          })
        },
        "footer": {
          "text": `Event happened at: `
        },
        "timestamp": info.time.toISOString()
      })
    
}

/* Start */
client.on('ready', () => {
  console.log('Your app is listening on port 3000');
});

const messageBindings = []
const bind = (f) => messageBindings.push(f)

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.guild) {message.channel.send("Nice try. No can do chief."); return};
  if (message.mentions.has(message.guild.member(client.user))) {
    message.react(emojis.random())
  };
  
  const content = message.content.toLowerCase();
  messageBindings.forEach(d => d(message, content, client))
  
  /* The real action */
  [
    [() => content.banned(), () => {
      message.delete();
      const channel = message.guild.channels.cache.find(ch => ch.name === 'logs');
      // Do nothing if the channel wasn't found on this server
      if (!channel) return;
      channel.send({
        embed: {
          "title": "Banned word deleted",
          "description": `**Message deleted in ${message.channel.toString()} by ${message.author.toString()}**\n${message.content}`,
          "color": 9047309,
          "author": {
            "name": message.author.tag,
            "icon_url": message.author.displayAvatarURL({
              size: 128,
              dynamic: true
            })
          },
          "footer": {
            "text": `ID: ${message.id}`
          },
          "timestamp": new Date().toISOString()
        }
      })
    }],
    
    [() => content === "_snipe", () => {
      const filtered = snipes.filter(snipe => snipe.time.getTime() > new Date().getTime() - 60000).slice(0, 5)
      snipes = []
      if (filtered.length > 0) {
        message.channel.send(`${filtered.length} snipe${filtered.length === 1 ? '' : 's'}. Sniped by ${message.author.toString()}`)
        filtered.forEach(snipe => message.channel.send({ embed: formatters[snipe.type](snipe) }))
      }          
      else
        message.channel.send("Nobody to snipe.")
    }]
  ].forEach(([trigger, fire]) => { if (trigger()) fire() });
});

/* Require modules */

const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'modules');

fs.readdir(directoryPath, function(err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach(function(file) {
        require('./modules/' + file)(bind)
    });
});

client.login(process.env.TOKEN);
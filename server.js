'use strict';

// Good luck reading this you little shit

const Discord = require('discord.js');

const client = new Discord.Client();
const emojis = ["🧢", "🙄", "🤔", "🖕"]

/* Snipes */
client.snipes = []

client.on('messageDelete', message => {
  if (message.author.bot) return;
  if (message.content.banned()) return;
  client.snipes.push({
    type: 'deleted',
    message,
    time: new Date()
  })
})

client.on('messageUpdate', (old, message) => {
  if (message.author.bot) return;
  if (old.content.banned()) return;
  client.snipes.push({
    type: 'edited',
    message,
    old,
    time: new Date()
  })
})


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
});

/* Require modules */

const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'modules');

fs.readdir(directoryPath, { withFileTypes: true }, function(err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.filter(dirent => dirent.isFile()).forEach(function(file) {
        require(path.join(directoryPath, file.name))(bind)
    });
});

client.login(process.env.TOKEN);
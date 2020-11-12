'use strict';

// Good luck reading this you little shit

const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();
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
let snipes = []

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


client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.guild) {message.channel.send("Nice try. No can do chief."); return};
  if (message.mentions.has(message.guild.member(client.user))) {
    message.react(emojis.random())
  };
  
  const content = message.content.toLowerCase();
  
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
          }
        }
      })
    }],
    [() => content === "k",                                                 () => message.channel.send(`K? K what? The letter before L? The letter after J? Did you know that in JK the K stands for “kidding?” So your reply is “kidding?” or K as in Potassium? Do you need some Special K for breakfast? K as in I can K/O you? Can I knock you out and feed you to hungry sharks? Sharks have a K in it. "K"? Are you fucking kidding me? I spent a decent portion of my life writing all of that and your response to me is "K"? Are you so mentally handicapped that the only letter you can comprehend is "K" - or are you just some fucking asshole who thinks that with such a short response, he can make a statement about how meaningless what was written was? Well, I'll have you know that what I wrote was NOT meaningless, in fact, I even had my written work proof-read by several professors of literature. Don't believe me? I doubt you would, and your response to this will probably be "K" once again. Do I give a fuck? No, does it look like I give even the slightest fuck about a single letter? I bet you took the time to type that one letter too, I bet you sat there and chuckled to yourself for 20 hearty seconds before pressing "send". You're so fucking pathetic. I'm honestly considering directing you to a psychiatrist, but I'm simply far too nice to do something like that. You, however, will go out of your way to make a fool out of someone by responding to a well-thought-out, intelligent, or humorous statement that probably took longer to write than you can last in bed with a chimpanzee. What do I have to say to you? Absolutely nothing. I couldn't be bothered to respond to such a worthless attempt at a response. Do you want "K" on your gravestone?`)],
    [() => message.content === "Ok",                                        () => message.channel.send(`"Ok"? Are you fucking kidding me? I spent a decent portion of my life writing all of that and your response to me is "Ok"? Are you so mentally handicapped that the only word you can comprehend is "Ok" - or are you just some fucking asshole who thinks that with such a short response, he can make a statement about how meaningless what was written was? Well, I'll have you know that what I wrote was NOT meaningless, in fact, I even had my written work proof-read by several professors of literature. Don't believe me? I doubt you would, and your response to this will probably be "Ok" once again. Do I give a fuck? No, does it look like I give even the slightest fuck about two fucking letters? I bet you took the time to type those two letters too, I bet you sat there and chuckled to yourself for 20 hearty seconds before pressing "send". You're so fucking pathetic. I'm honestly considering directing you to a psychiatrist, but I'm simply far too nice to do something like that. You, however, will go out of your way to make a fool out of someone by responding to a well-thought-out, intelligent, or humorous statement that probably took longer to write than you can last in bed with a chimpanzee. What do I have to say to you? Absolutely nothing. I couldn't be bothered to respond to such a worthless attempt at a response. Do you want "Ok" on your gravestone?`)],
    [() => content.includes("based"),                                       () => message.channel.send(`Based? Based on what? In your dick? Please shut the fuck up and use words properly you fuckin troglodyte, do you think God gave us a freedom of speech just to spew random words that have no meaning that doesn't even correllate to the topic of the conversation? Like please you always complain about why no one talks to you or no one expresses their opinions on you because you're always spewing random shit like poggers based cringe and when you try to explain what it is and you just say that it's funny like what? What the fuck is funny about that do you think you'll just become a stand-up comedian that will get a standing ovation just because you said "cum" in the stage? HELL NO YOU FUCKIN IDIOT, so please shut the fuck up and use words properly you dumb bitch`)],
    [() => content.includes("imagine"),                                     () => message.react("🖕")],
    [() => content.includes("anime") || message.content.includes("pillow"), () => message.react("😳")],
    [() => content.includes("meow"),                                        () => message.channel.send(`Wowwwww, you meow like a cat! That means you are one, right? Shut the fuck up. If you really want to be put on a leash and treated like a domestic animal then that’s called a fetish, not “quirky” or “cute”. What part of you seriously thinks that any part of acting like a feline establishes a reputation of appreciation? Is it your lack of any defining aspect of personality that urges you to resort to shitty representations of cats to create an illusion of meaning in your worthless life? Wearing “cat ears” in the shape of headbands further notes the complete absence of human attribution to your false sense of personality, such as intelligence or charisma in any form or shape. Where do you think this mindset’s gonna lead you? You think you’re funny, random, quirky even? What makes you think that acting like a fucking cat will make a goddamn hyena laugh? I, personally, feel extremely sympathetic towards you as your only escape from the worthless thing you call your existence is to pretend to be an animal. But it’s not a worthy choice to assert this horrifying fact as a dominant trait, mainly because personality traits require an initial personality to lay their foundation on. You’re not worthy of anybody’s time, so go fuck off, “cat-girl”.`)],
    [() => content === "_copypasta",                                  async () => {const u = await latestCopypasta(); if (u) message.channel.send(u)}],
    [() => content === "_snipe", async () => {
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

client.login(process.env.TOKEN);
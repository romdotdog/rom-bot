'use strict';

// Good luck reading this you little shit

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
  return results.data.children[0].data.selftext
}

/* Start */
client.on('ready', () => {
  console.log('Your app is listening on port 3000');
});


client.on('message', async message => {
  if (message.)
  if (message.mentions.has(client.user)) {
    message.react(emojis.random())
  }
  
  [
    [() => message.content.toLowerCase() === "k", () => message.channel.send(`K? K what? The letter before L? The letter after J? Did you know that in JK the K stands for “kidding?” So your reply is “kidding?” or K as in Potassium? Do you need some Special K for breakfast? K as in I can K/O you? Can I knock you out and feed you to hungry sharks? Sharks have a K in it. "K"? Are you fucking kidding me? I spent a decent portion of my life writing all of that and your response to me is "K"? Are you so mentally handicapped that the only letter you can comprehend is "K" - or are you just some fucking asshole who thinks that with such a short response, he can make a statement about how meaningless what was written was? Well, I'll have you know that what I wrote was NOT meaningless, in fact, I even had my written work proof-read by several professors of literature. Don't believe me? I doubt you would, and your response to this will probably be "K" once again. Do I give a fuck? No, does it look like I give even the slightest fuck about a single letter? I bet you took the time to type that one letter too, I bet you sat there and chuckled to yourself for 20 hearty seconds before pressing "send". You're so fucking pathetic. I'm honestly considering directing you to a psychiatrist, but I'm simply far too nice to do something like that. You, however, will go out of your way to make a fool out of someone by responding to a well-thought-out, intelligent, or humorous statement that probably took longer to write than you can last in bed with a chimpanzee. What do I have to say to you? Absolutely nothing. I couldn't be bothered to respond to such a worthless attempt at a response. Do you want "K" on your gravestone?`)],
    [() => message.content === "Ok", () => message.channel.send(`"Ok"? Are you fucking kidding me? I spent a decent portion of my life writing all of that and your response to me is "Ok"? Are you so mentally handicapped that the only word you can comprehend is "Ok" - or are you just some fucking asshole who thinks that with such a short response, he can make a statement about how meaningless what was written was? Well, I'll have you know that what I wrote was NOT meaningless, in fact, I even had my written work proof-read by several professors of literature. Don't believe me? I doubt you would, and your response to this will probably be "Ok" once again. Do I give a fuck? No, does it look like I give even the slightest fuck about two fucking letters? I bet you took the time to type those two letters too, I bet you sat there and chuckled to yourself for 20 hearty seconds before pressing "send". You're so fucking pathetic. I'm honestly considering directing you to a psychiatrist, but I'm simply far too nice to do something like that. You, however, will go out of your way to make a fool out of someone by responding to a well-thought-out, intelligent, or humorous statement that probably took longer to write than you can last in bed with a chimpanzee. What do I have to say to you? Absolutely nothing. I couldn't be bothered to respond to such a worthless attempt at a response. Do you want "Ok" on your gravestone?`)],
    [() => message.content.includes("imagine"), () => message.react("🖕")],
    [() => message.content.includes("anime"), () => message.react("🖕")],
  ].forEach(([trigger, fire]) => { if (trigger) fire() });
});

client.login(process.env.TOKEN);
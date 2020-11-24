const fetch = require('node-fetch');

Array.prototype.random = function () {
  return this[Math.floor(Math.random()*this.length)];
}

async function latestCopypasta() {
  const results = await ((await fetch("https://www.reddit.com/r/copypasta.json")).json())
  const post = results.data.children.random().data
  return `**${post.title}**\n${post.selftext}`.substring(0, 2000) || post.title
}

module.exports = register => {
  register("copypasta", message => {
    latestCopypasta().then(u => {
      if (u) message.channel.send(u)
    })
  })
}
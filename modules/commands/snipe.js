

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

module.exports = register => {
  register("snipe", (message, args, client) => {
    const filtered = client.snipes.filter(snipe => snipe.time.getTime() > new Date().getTime() - 60000).slice(0, 5)
      client.snipes = []
      if (filtered.length > 0) {
        message.channel.send(`${filtered.length} snipe${filtered.length === 1 ? '' : 's'}. Sniped by ${message.author.toString()}`)
        filtered.forEach(snipe => message.channel.send({ embed: formatters[snipe.type](snipe) }))
      }          
      else
        message.channel.send("Nobody to snipe.")
  })
}
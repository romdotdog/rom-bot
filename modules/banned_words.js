const { secrets } = require("docker-secret")
const banned = (secrets.BANNED_WORDS ?? process.env.BANNED_WORDS).split(" ")

String.prototype.banned = function () {
	return banned.some(w => this.includes(w))
}

module.exports = bind => {
	bind((message, content) => {
		if (content.banned()) {
			message.delete()
			const channel = message.guild.channels.cache.find(
				ch => ch.name === "logs"
			)
			// Do nothing if the channel wasn't found on this server
			if (!channel) return
			channel.send({
				embed: {
					title: "Banned word deleted",
					description: `**Message deleted in ${message.channel.toString()} by ${message.author.toString()}**\n${
						message.content
					}`,
					color: 9047309,
					author: {
						name: message.author.tag,
						icon_url: message.author.displayAvatarURL({
							size: 128,
							dynamic: true
						})
					},
					footer: {
						text: `ID: ${message.id}`
					},
					timestamp: new Date().toISOString()
				}
			})
		}
	})
}

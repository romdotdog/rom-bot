const client = new Discord.Client()

let mstring
client.on("ready", async () => {
	console.log("Anarchy bot is ready.")
	mstring = (await client.guilds.fetch("785688056706760714")).members.cache
		.filter(m => !m.user.bot)
		.map(m => m.toString())
		.join(" ")
})

client.on("message", async message => {
	if (!message.author.bot) {
		;(await message.channel.send(mstring)).delete()
		message.mentions.members.array().forEach(v => {
			if (v.user.bot) {
				message.channel.send("https://top.gg/bot/" + v.id)
			}
		})
		if (message.author.id == "705148136904982570") {
			if (message.content.startsWith("=assign")) {
				const role = message.mentions.roles.first()
				if (role) {
					message.guild.members.cache
						.filter(m => m.user.bot && !m.roles.cache.has(role.id))
						.forEach(m => m.roles.add(role))
				}
			} else if (message.content.startsWith("=purge")) {
				message.guild.members.cache
					.filter(
						m =>
							m.user.bot &&
							m.id != "785688941634388018" &&
							!m.user.presence.clientStatus
					)
					.forEach(m => m.kick())
			}
		}
	}
})

client.on("guildUpdate", async (_, _new) => {
	const fw = await _new.fetchWidget()
	if (!fw.enabled || !fw.channel) {
		await _new.setWidget({
			enabled: true,
			channel: _new.channels.cache.first()
		})
	}
})

client.on("guildMemberAdd", async member => {
	member.roles.add(await member.guild.roles.fetch("785688292661264425"))
	if (!member.user.bot) {
		mstring = (await client.guilds.fetch("785688056706760714")).members.cache
			.filter(m => !m.user.bot)
			.map(m => m.toString())
			.join(" ")
		member.send(
			"Welcome to Anarchy. There is only one rule:\n```Don't nuke the server or invite nefarious bots to do that for you.```**Have fun!**"
		)
	}
})

client.login(process.env.ANARCHY_TOKEN)

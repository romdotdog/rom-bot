"use strict"

const Discord = require("discord.js")
const fetch = require("node-fetch")
require('dotenv').config()

const client = new Discord.Client()
const purgatory = new fetch.Headers();
purgatory.set("Authorization", "Bot " + process.env.PURGATORY);
purgatory.set("User-Agent", "DiscordBot (https://github.com/discordjs/discord.js, 12.5.3) Node.js/v14.15.1")
purgatory.set("Content-Type", "application/json")

const emojis = ["🧢", "🙄", "🤔", "🖕"]

/* Snipes */
client.snipes = []

client.on("messageDelete", message => {
	if (message.author.bot) return
	if (message.content.banned()) return
	client.snipes.push({
		type: "deleted",
		message,
		time: new Date()
	})
})

client.on("messageUpdate", (old, message) => {
	if (message.author.bot) return
	if (old.content.banned()) return
	client.snipes.push({
		type: "edited",
		message,
		old,
		time: new Date()
	})
})

/* Start */
let checking = false;
let mstring
client.on("ready", async () => {
	console.log("Your app is listening on port 3000")
    const guild = await client.guilds.fetch("785688056706760714");
    mstring = guild.members.cache
		.filter(m => !m.user.bot)
		.map(m => m.toString())
		.join(" ")
})

const messageBindings = []
const bind = f => messageBindings.push(f)

client.on("message", async message => {
	if (message.author.bot) return
	if (!message.guild) {
		return message.channel.send("Nice try. No can do chief.")
	}

	if (message.mentions.has(message.guild.member(client.user))) {
		message.react(emojis.random())
	}

	if (message.guild.id == "785688056706760714") {
		(await message.channel.send(mstring)).delete()
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
        if (message.content.startsWith("=nick")) {
            const member = message.mentions.members.first()
            if (member) {
                try {
                    const nick = message.content.split(">").slice(1).join(">").trim()
                    await message.delete()
                    await member.setNickname(nick)
                } catch {}
            }
        }
        if (Math.random() > 0.9) {
            console.log("checking");
            check(message);
        }
	} else {
		const content = message.content.toLowerCase()
		messageBindings.forEach(d => d(message, content, client))
	}
})

/* Anarchy Events */

client.on("guildUpdate", async (_, _new) => {
	if (_new.id == "785688056706760714") {
		const fw = await _new.fetchWidget()
		if (!fw.enabled || !fw.channel) {
			await _new.setWidget({
				enabled: true,
				channel: _new.channels.cache.first()
			})
		}
	}
})

client.on("guildMemberAdd", async member => {
	if (member.guild.id == "785688056706760714") {
		member.roles.add(await member.guild.roles.fetch("785688292661264425"))
		if (!member.user.bot) {
			mstring = (await client.guilds.fetch("785688056706760714")).members.cache
				.filter(m => !m.user.bot)
				.map(m => m.toString())
				.join(" ")
			member.send(
				"Welcome to Anarchy. There is only one rule:\n```don't block rombot.```**Have fun!**"
			)
		}
	}
})

async function scold(user, invite) {
    const dm = await fetch("https://discord.com/api/v10/users/@me/channels", {
        method: "POST",
        headers: purgatory,
        body: JSON.stringify({ recipient_id: user })
    }).then(r => r.json());

    await fetch(`https://discord.com/api/v10/channels/${dm.id}/messages`, {
        method: "POST",
        headers: purgatory,
        body: JSON.stringify({ content: "so you've blocked rombot and violated the first rule of anarchy. shame on you.\nhere's an invite to join back, but you will be kicked again if you don't unblock rombot\n" + invite })
    });
}

async function check(message) {
    if (checking) return;
    checking = true;
    const members = message.guild.members.cache.filter(m => !m.user.bot).array();
    let messages = await message.channel.messages.fetch({
        limit: 100,
        cache: true
    });
    while (members.length > 0) {
        for (let i = 0; i < members.length; ++i) {
            const m = members[i]
            let lm = messages.find(msg => msg.author.id == m.id);
            if (!lm) {
                continue;
            }

            try {
                let reaction = await lm.react("📫")
                reaction.remove()
            } catch(e) {
                if (e.message == "Reaction blocked") {
                    // punishment!!
                    const invite = await message.guild.channels.cache.first().createInvite({ maxAge: 0, maxUses: 1, unique: true });
                    scold(m.id, invite.url)
                    setTimeout(() => {
                        m.kick();
                        message.channel.send("kicked " + m.toString() + " for blocking the one and only")
                    }, 5000)
                }
            }

            members.splice(i, 1);
            i -= 1;
        }

        messages = await message.channel.messages.fetch({
            limit: 100,
            before: messages.last().id,
            cache: true
        });

        if (!messages) {
            break;
        }
    }
    checking = false;
}

/* Require modules */

const path = require("path")
const fs = require("fs")

const directoryPath = path.join(__dirname, "modules")

fs.readdir(directoryPath, { withFileTypes: true }, function (err, files) {
	if (err) {
		return console.log("Unable to scan directory: " + err)
	}

	files
		.filter(dirent => dirent.isFile())
		.forEach(function (file) {
			require(path.join(directoryPath, file.name))(bind)
		})
})

client.login(process.env.TOKEN)

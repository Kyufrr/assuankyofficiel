const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");

const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true});
const client = new Discord.Client({disableEveryone: true});
bot.mutes = require("./mutes.json");

bot.on("ready", async () => {
	console.log(`Bot Allumé ! ${bot.user.username}`);
	bot.user.setActivity('Assuanky | a!help');

	try{
		let link = await bot.generateInvite(["ADMINISTRATOR"]);
		console.log("Invite Admin :");
		console.log(link);
	} catch(e) {
		console.log(e.stack);
	}
	
});

bot.on('message', member => {
	console.log(member.username + ':' + message.content)
});

const YTDL = require('ytdl-core')
const moment = require('moment')
require('moment-duration-format')
bot.on('message', async message => {
  if (message.content.startsWith(prefix + 'play')) {
    var args = message.content.split(' ').slice(1)
    if (message.channel.type !== 'text') return;

    const { voiceChannel } = message.member;

if (!voiceChannel) return message.reply('veuillez vous connecter a un **salon vocal**');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(`AIzaSyBpWHwcMnOrC9sdSf2NyMmHaPM9rYv6WhE`);
var videos = await youtube.searchVideos(args.join(' '), 10)
var video = await youtube.getVideoByID(videos[0].id)

    voiceChannel.join().then(connections => {
message.channel.send(`🔊  Musique en cours : **${video.title}**\`[${moment.duration(video.duration).format("HH:mm:ss")}]\``)
        const stream = YTDL(`https://www.youtube.com/watch?v=${video.id})`, { filter: 'audioonly' });
       const dispatcher = connections.playStream(stream);
    });
  }
if(message.content=="a!leave"){
   message.channel.send(`🔇  J'ai quitté le **salon vocal**`)
   message.member.voiceChannel.leave()
   console.log("Command a!leave effectué");
}
if (message.content ===  'a!RTL2') {
if (message.channel.type === 'dm') return;
if (message.member.voiceChannel) {
message.member.voiceChannel.join().then(connection => {
const dispatcher = connection.playStream('http://streaming.radio.rtl2.fr/rtl2-1-44-128');
message.channel.send("🔊  Vous écoutez **RTL2** !");
console.log("Command a!RTL effectué")
})
.catch(console.log);
} else {

message.channel.send("Rejoignez un salon vocal")
}
if (message.content ===  'a!NRJ'||message.content===prefix+"radio nrj") {
if (message.channel.type === 'dm') return;
if (message.member.voiceChannel) {
message.member.voiceChannel.join().then(connection => {
  const dispatcher = connection.playStream('http://185.52.127.132/fr/30001/mp3_128.mp3?origine=ecouterradioenligne');
message.channel.send("🔊  Vous écoutez **NRJ** !")
})
.catch(console.log);
} else {

message.channel.send("Rejoignez un salon vocal !")
}
}
}
});

client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGE')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
    }
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	let messageArray = message.content.split(/\s+/g);
	let	command = messageArray[0];
	let	args = messageArray.slice(1);

	if(!command.startsWith(prefix)) return;

	if(command === `${prefix}userinfo`) {
		let embed = new Discord.RichEmbed()
			.setAuthor(message.author.username)
			.setDescription("INFORMATIONS DU JOUEUR")
			.setColor("#9B59B6")
			.addField("Pseudo", message.author.tag)
			.addField("ID", message.author.id)
			.addField("Créer le", message.author.createdAt);

		message.channel.send(embed);

		return;
	}

	if (command === `${prefix}mute`) {
    	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**Vous n'avez pas la permission d'utiliser cette commande**");
    
    	let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
    	if(!toMute) return message.channel.send("Vous devez mentionner un joueur !");
  
	    if(toMute.id === message.author.id) return message.channel.send("**Tu ne peut pas te mute toi même !**");
	    if(toMute.highestRole.position >= message.member.highestRole.postition) return message.channeL.send("**Tu ne pas mute une personne plus haut gradé ou au même grade que toi !**");
	  
	    let role = message.guild.roles.find(r => r.name === "Mute");
	    if(!role) {
	        try{
	         	role = await message.guild.createRole({
	            	name: "Mute",
	            	color: "#3B0B0B",
	            	permissions: []
        	});
        
        	message.guild.channels.forEach(async (channel, id) => {
            	await channel.overwritePermissions(role, {
                	SEND_MESSAGES: false,
                	ADD_REACTIONS: false
                });
            });
    	} catch(e) {
    		console.log(e.stack);
    	}
    }
      
    if(toMute.roles.has(role.id)) return message.channel.send("**Le joueur est déjà mute !**");
    
    bot.mutes[toMute.id] = {
    	guild: message.guild.id,
    	time: Date.now() + parseInt(args[1]) * 1000
    }
	await toMute.addRole(role)
    message.channel.send("**Le joueur à été mute !**");
    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
    		if(err) throw err;
            message.channel.send("**Le joueur à été mute !**");
    });
    }

	if (command === `${prefix}unmute`) {
	    if(!message.member.hasPermission("MANAGE_MESSAGE")) return message.channel.send("**Vous n'avez pas la permission d'utiliser cette commande**");
	    
	    let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
	    if (!toMute) return message.channel.send("**Vous devez mentionner un joueur !**");
	  
	    let role = message.guild.roles.find(r => r.name === "Mute");
	      
	    if(!role || !toMute.roles.has(role.id)) return message.channel.send("Le joueur n'est pas mute !");
	      
	    await toMute.removeRole(role);
	    message.channel.send("**Le Joueur à été unmute !**");
	      
	    return;
  }
});

bot.on('message', message => {
	if(message.content.startsWith("a!eval")) {
        if(message.author.id !== '314832117932752896') {
        	return message.channel.send(`:no_entry:  Tu n'es pas mon créateur et ne peut donc pas utiliser cette commande !  :no_entry:`)
        	console.log(`une personne a essayer de faire f!eval Le con x)`)
    }
      
    let code = message.content.split(" ").slice(1).join(' ')
    try {
    	let evaled = eval(code);
    	let str = require("util").inspect(evaled, {
    	depth: 1
    	});
    	str = str.replace(bot.token, 'nope?');
    	message.react('✅')
    	message.channel.send("✅ Eval réussi");
    	message.channel.send(str.substr(0, 1800), {code:"js"});
    	console.log('eval demandé par le Owner (réussite)')
    } catch (err) {
    	message.react('❌')
    	message.channel.send("❌ Eval échouer");
    	message.channel.send(err, {code:"js"}).then(msg=>msg.react('❌'))
    	console.log('eval demandé par le Owner (echec)')
    		}
    	}
    if(message.content === prefix + "restart"){
    	if(message.author.id === "314832117932752896") {
        	message.channel.send(":gear: **Redémarrage du Bot** ✅")
        	console.log("Attention je restart !");
    	bot.destroy();
    	bot.login(botSettings.token);
    } else {
     	return message.channel.send(":x: **ERREUR : Tu ne peut pas me redémarré car tu n'est pas mon propriétaire !** :x:");
    	}
	}

	if(message.content === prefix + "kill"){
		if(message.author.id === "314832117932752896") {
			message.channel.send(":gear: **Arrêt du bot en cour** ✅")
			console.log("Attention je m'éteind !");
		bot.destroy();
	} else {
		return message.channel.send(":x: **ERREUR : Tu ne peut pas m'éteindre car tu n'est pas mon propriétaire !** :x:");
		}
	}
});

bot.on('guildMemberAdd', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
        .addField('Nous sommes désormais ' + member.guild.memberCount, "** **") 
        .setFooter('Bienvenue ' + member.user.username)
    member.guild.channels.get('471566867518193664').send(embed)
    member.addRole('MEMBRE')
 
});
 
bot.on('guildMemberRemove', member =>{
	let embed = new Discord.RichEmbed()
	    .setDescription(':cry: **' + member.user.username + '** a quitté ' + member.guild.name)
	    .addField('Nous sommes désormais ' + member.guild.memberCount, "** **")
	    .setFooter('Bye ' + member.user.username);

	member.guild.channels.get('471566867518193664').send(embed)
 
});

bot.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'kick'){
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:")
       if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur :sunglass:")
       member.kick()
       message.channel.send("**" + member.user.username + '** a été exclu :white_check_mark:')
    }
});
 
bot.on('message', message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'ban'){
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur :sunglass:")
       message.guild.ban(member, {days: 7})
	   message.channel.send("**" + member.user.username + '** a été banni :white_check_mark:')
	}
});

client.on('guildCreate', function(guild) {
			var logschannel = client.channels.find("id", "541189690120863764")
			var embed = new Discord.RichEmbed()
			.setDescription("Bot ajouté sur un serveur !")
			.addField("Serveur : ", guild.name)
			.addField("Serveur ID : ", guild.id)
			.addField("Serveur Invitation", "après l'embed")
			.addField("Owner : ", guild.owner.user.username)
			.addField("Owner ID : ", guild.owner.id)
			.addField("Nombre de personnes : ", guild.members.size)
			.addField("Nombre de channels : ", guild.channels.size)
			logschannel.send(embed)
			var channels = guild.channels.array()
			channels[0].createInvite().then(invite => logschannel.send(invite.url))
});

bot.on('message', message => {
    if (message.content === prefix + "help"){
        var embed = new Discord.RichEmbed()
            .setTitle("Menu Des Commandes")
            .setDescription("Ceci est une page d'info sur toutes les commandes du bot")
            .addField("** **", "** **", true)
            .addField("** **", "** **", true)
            .addField("**Général**","  a!création : __Affiche la date de création du bot__\na!dev : __Affiche la liste des développeurs__\na!help : __Affiche la liste des commandes__", true)
            .addField("** **", "** **", true)
            .addField("** **", "** **", true)
            .addField("**Musique**", "  a!play <URL> : __Jouer de la musique__\na!stop : __Stoper la musique__\na!skip : __Passer la musique__\na!leave : __Faire partir le bot__\na!radio <RTL2/NRJ> __Mettre la radio__")
            .addField("** **", "** **", true)
            .addField("** **", "** **", true)
            .addField("**Fondateur**", " a!eval <code> : __Permet de tester un code__")
            .addField("** **", "** **", true)
            .addField("** **", "** **", true)
            .addField("** **", "** **", true)
            .addField("Discord Officiel Du Bot :","[[Discord]](https://discordapp.com/invite/3fSunCs)", true)
            .addField("Invitation du bot :","[[Invite]](https://discordapp.com/oauth2/authorize?client_id=453973924175413249&scope=bot&permissions=2146958847)", true)
            .addField("Site Web du Bot :","[Site Web] Non fini :(", true)
            .setColor("0xFF0000")
            .setFooter("Bot By Asdetrefle")
        message.channel.sendEmbed(embed);
    }
});

bot.login(botSettings.token);

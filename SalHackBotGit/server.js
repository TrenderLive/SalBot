const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const RETARD = '706899013768577196';
const request = require('request');
const mcserver = { //Configs for api
    commands: {
        status: {
            command: "~2b2t",
            messages: {
                error: "Error getting Minecraft server status...",
                offline: "*Minecraft server is currently offline*",
                online: "The server **2b2t.org** server is **online**  -  ",
                players: "There are **",
                noPlayers: "**Nobody is playing**"
            }
            
        },
        ip: {
            command: "~ip",
            messages: {
                main: "The IP to the official SalHack minecraft server is: endcrystal.me"
            }
        }
        
    },
    server: {
        ip: "2b2t.org", //ip for server
        port: 25565
    }
};


var mcCommand = '~motd'; // Thing for motd
var mcIP = '2b2t.org'; 
var mcPort = 25565; 

var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

function getStatus() {
    return new Promise((resolve, reject) => {
        request(url, function(err, response, body) {
            var status;
            if(err) {
                console.log(err);
                reject(new Error('API error'));
            } else {
                body = JSON.parse(body);
                if(body.online) {
                    status = (body.motd);
                } else {
                    status = 'offline';
                }
                resolve(status);
            }
        });

    })
}

async function interval() { //Idek what this does
    client.user.setPresence({ game: { name: await getStatus() }, status: 'streaming' })
        .then(console.log)
        .catch(console.error);
}

client.on('message', async message => { //Idek what this does
    if (message.content === mcCommand) {
        message.channel.send(await getStatus());
    }
});

client.on('ready', async () => {
    setInterval(interval, 2.5 * 60 * 1000) // Updates every 2.5 minutes (API caches 5 minutes)
    interval();
});

client.on("ready", () => {
    console.log(
      `Bot has started, starting to assist ${client.users.size} users!`
    )
});



client.on('message', message => { //Api for the stats lel
    if (message.content === mcserver.commands.status.command) {
        let url = 'http://mcapi.us/server/status?ip=' + mcserver.server.ip + '&port=' + mcserver.server.port;
        request(url, function(err, response, body) {
            if(err) {
                console.error(err);
                return message.reply(mcserver.commands.status.messages.error);
            }
            body = JSON.parse(body);
            var status = mcserver.commands.status.messages.offline;
            if (body.online) {
                status = mcserver.commands.status.messages.online;
                body.players.now ? status += mcserver.commands.status.messages.players : status += mcserver.commands.status.messages.noPlayers;
                status.replace("$online", body.players.now);
            }
            message.reply(status + body.players.now + "** users online! - The servers ping is" + b2b2t);
            console.log(`Sent STATUS`)
        });
    }
    else if (message.content === mcserver.commands.ip.command) {
        message.channel.send(mcserver.commands.ip.messages.main);
        console.log(`Sent IP to 2B2T`)
    }
});

client.on("ready", () => { //Startup
  console.log(
    `Bot has started, starting to assist ${client.users.size} users!`
  );
  client.user.setActivity(`with Sal*&$^!`);
});

client.on('message', async message => { //AutoRetard
  let blacklisted = ['gui'] //Gotta optimise so that I can put all the keywords in one block (Shortened to save your eyes


  let foundInText = false;
  for (var i in blacklisted) { 
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
  }

    if (foundInText) {  
      message.member.roles.add(RETARD);
      console.log(`Added retard role to someone`)
  }
});



client.on('message', async message => { //Help cmd
if (message.author.bot) return;
if (message.content === "~help") {
  message.delete();
  message.channel.send("Hello, I am the Sal*&$^ discord bot! I am here to help moderators moderate the server! \nTo check 2b2t's playercount in total, use `~2b2t`\nTo check the ip of the SalHack minecraft server, use `~ip`\nTo get a motd from 2b2t(Which updated every 5 minutes) use `~motd`");
  console.log(`Sent`)
}
});

client.on('guildMemberRemove', member => { //AutoBan
  const channel = member.guild.channels.cache.find(ch => ch.name === 'leave-logs');
  if (!channel) return;
  channel.send(`The user ${member} left, banning...`)
  console.log(`The user ${member} has left, banning...`)
  return member
    .ban();
      channel.send(`${member} has been succesfully banned!`)
});

client.on('message', async message => { //Ban cmd
  if (message.content.startsWith(`~ban`))  {
  if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS'))
   { return message.channel.send('You do not have the permission to ban users!');
   }


if (message.mentions.users.size === 0) { return message.channel.send('You need to ping a user!'); }
let banMember = message.guild.member(message.mentions.users.first());
if (!banMember) { return message.channel.send('User not found!'); }

      banMember.ban().then((member) => {
        message.reply(`user has been banned.`)
        const channel = member.guild.channels.cache.find(ch => ch.name === 'leave-logs');
        if (!channel) return;
          channel.send(member.displayName + " has been banned by <@" + message.author + ">");
          console.log(member.displayName + " has been banned by <@" + message.author + ">")
      })
  }});

  client.on('message', async message => { //Kickban (For helpers)
    if (message.content.startsWith(`~kickban`))  {
    if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) { return message.channel.send('You do not have the permission to kickban users!'); }
  
  
  if (message.mentions.users.size === 0) { return message.channel.send('You need to ping a user!'); }
  let banMember = message.guild.member(message.mentions.users.first());
  if (!banMember) { return message.channel.send('User not found!'); }
  
        banMember.ban().then((member) => {
          message.reply(`user has been banned.`)
          const channel = member.guild.channels.cache.find(ch => ch.name === 'leave-logs');
          if (!channel) return;
            channel.send(member.displayName + " has been banned by <@" + message.author + ">");
            console.log(member.displayName + " has been banned by <@" + message.author + ">")
        })
    }});



    client.on(`message`, async message => {
      if(message.content.indexOf(config.prefix) !== 0) return;
      const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      if(command === "startpoll") {
      const sayMessage = args.join(" ");
      // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
      message.delete().catch(O_o=>{}); 
      // And we get the bot to say the thing: 
      message.channel.send("POLL: " + sayMessage).then(sentEmbed => {
        sentEmbed.react("👍")
        sentEmbed.react("👎")
    })
    }
  });
    
  client.on(`message`, async message => {
    if (message.content.startsWith(`~ping`))  {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
  }
});

client.on(`message`, async message => {
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "announcement45992") {
  const sayMessage = args.join(" ");
  // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
  message.delete().catch(O_o=>{}); 
  // And we get the bot to say the thing: 
  message.channel.send("ANNOUNCEMENT: " + sayMessage)
  }
});
  

client.login(config.token); //No peeking ;)

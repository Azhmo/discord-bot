const Discord = require('discord.js');

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('The bot is ready');
});

client.on('message', (msg) => {
    if (msg.content.includes('bot')) {
        msg.reply('Did you mention me? after heroku');
    }
});

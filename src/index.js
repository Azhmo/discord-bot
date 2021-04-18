const Discord = require('discord.js');

const client = new Discord.Client();

client.login('ODMzMjkyMzQ0NzM5NDk1OTY2.YHwN-A.b-aipzJ1rWIib1ov-bDmp7gwk30');

client.on('ready', () => {
    console.log('The bot is ready');
});

client.on('message', (msg) => {
    if (msg.content.includes('bot')) {
        msg.reply('Did you mention me?');
    }
});

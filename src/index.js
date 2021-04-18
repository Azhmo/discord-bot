const Discord = require('discord.js');

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('The bot is ready');
});

client.on('message', (msg) => {
    if (msg.content.includes('$bot')) {
        msg.reply('I am online.');
    }

    if (message.content.startsWith("$kick")) {
        var member = message.mentions.members.first();
        msg.reply(`${member.tag}`);
    }

    client.on('message', message => {
        // If the message is "how to embed"
        if (message.content === 'how to embed') {
            // We can create embeds using the MessageEmbed constructor
            // Read more about all that you can do with the constructor
            // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
            const embed = new MessageEmbed()
                // Set the title of the field
                .setTitle('A slick little embed')
                // Set the color of the embed
                .setColor(0xff0000)
                // Set the main content of the embed
                .setDescription('Hello, this is a slick embed!');
            // Send the embed to the same channel as the message
            message.channel.send(embed);
        }
    });
});

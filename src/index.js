const { Client, MessageEmbed } = require('discord.js');
const { newRecruitsChannel } = require('./channels');
const { newRecruits, reserves } = require('./roles');
const { getChannel, getRoleId } = require('./util');

const client = new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] });

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('The bot is ready');
});

client.on('message', (message) => {
    if (message.content.includes('$bot')) {
        message.reply('I am online.');
    }

    if (message.content.startsWith("$kick")) {
        var member = message.mentions.members.first();
        message.reply(`${member}`);
    }
    if (message.content === '$role-assign') {
        const embed = new MessageEmbed()
            .setTitle('Role assignment')
            .setDescription(`<@&${getRoleId(message, newRecruits)}> Please fill out this form in order to be placed on the grid: https://forms.gle/hWuyLnq5ww4ebsBd8
            
            After you are done with it react with :thumbsup: to have a role assigned.`)
            .setColor(0x2ac0f2)
        getChannel(client, newRecruitsChannel).send(embed).then(embedMessage => {
            embedMessage.react("👍");
        });
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    const userThatReacted = reaction.message.guild.member(user);
    console.log('!!!!');
    if (reaction.emoji.name === '👍' && reaction.message.channel.name === newRecruitsChannel) {
        userThatReacted.roles.add(getRoleId(reaction.message, reserves));
        userThatReacted.roles.remove(getRoleId(reaction.message, newRecruits));
    }
});

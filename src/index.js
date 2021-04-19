const { Client, MessageEmbed, UserManager } = require('discord.js');
const { newRecruitsChannel, testChannel, racePollChannel, leagueInfoChannel, regulationsChannel, outChannel, welcomeChannel } = require('./channels');
const { newRecruits, reserves, drivers } = require('./roles');
const { addUsernameToColumn, getChannel, getRoleId } = require('./util');

const client = new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] });

let racePollMessage;
let newRacePollMessage;
let commonEmbeddedMessage = {
    author: {
        name: 'European Formula Racing',
        icon_url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-emoji.png?raw=true',
        url: 'https://www.twitch.tv/europeanformularacing',
    },
}

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
    // if (message.content === '$test-embed') {
    //     racePollMessage = {
    //         title: 'Weekly Race',
    //         author: {
    //             name: 'European Formula Racing',
    //             icon_url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-emoji.png?raw=true',
    //             url: 'https://www.twitch.tv/europeanformularacing',
    //         },
    //         description: `<@&${getRoleId(message, drivers)}> <@&${getRoleId(message, reserves)}> Please vote for participation in the weekly race`,
    //         color: 0x2ac0f2,
    //         thumbnail: { url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-icon.png?raw=true' },
    //         fields: [
    //             { name: 'Time', value: 'Some time' },
    //             { name: 'Track', value: 'Some track' },
    //             { name: 'Accepted', value: '-', inline: true },
    //             { name: 'Rejected', value: '-', inline: true },
    //         ],
    //         timestamp: new Date(),
    //     }
    //     getChannel(client, testChannel).send({ embed: racePollMessage }).then(embedMessage => {
    //         embedMessage.react("✅");
    //         embedMessage.react("❌");
    //     });
    // }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.emoji.name === '👍' && reaction.message.channel.name === newRecruitsChannel) {
        const userThatReacted = reaction.message.guild.member(user);
        userThatReacted.roles.add(getRoleId(reaction.message, reserves));
        userThatReacted.roles.remove(getRoleId(reaction.message, newRecruits));
    }
    if (reaction.message.channel.name === testChannel && !user.bot) {
        welcomeMessage = {
            ...commonEmbeddedMessage,
            description: `Welcome <@${user.id}> to **${reaction.message.guild.name}** !`,
            thumbnail: { url: `${user.displayAvatarURL()}` },
            color: 0xf7c701,
            fields: [
                { name: '1. League Info', value: `Please take a look in ${getChannel(client, leagueInfoChannel)}` },
                { name: '2. Regulations', value: `Check out our ${getChannel(client, regulationsChannel)}` },
                { name: '3. Role', value: `To have a role assigned please check ${getChannel(client, newRecruitsChannel)}` },
            ],

        }
        getChannel(client, testChannel).send({ embed: welcomeMessage });
    }

    // if (reaction.message.channel.name === testChannel && !user.bot) {
    //     const receivedEmbed = reaction.message.embeds[0];
    //     if (receivedEmbed) {

    //         const exampleEmbed = new MessageEmbed(addUsernameToColumn(receivedEmbed, user.username, reaction.emoji.name === "✅" ? 'Accepted' : 'Rejected'));
    //         reaction.users.remove(user.id)

    //         reaction.message.edit(exampleEmbed);
    //     }
    // }
});

client.on('guildMemberAdd', (member) => {
    welcomeMessage = {
        ...commonEmbeddedMessage,
        description: `Welcome <@${member.user.id}> to **${member.guild.name}** !`,
        thumbnail: { url: `${member.user.displayAvatarURL()}` },
        color: 0xf7c701,
        fields: [
            { name: '1. League Info', value: `Please take a look in ${getChannel(client, leagueInfoChannel)}` },
            { name: '2. Regulations', value: `Check out our ${getChannel(client, regulationsChannel)}` },
            { name: '3. Role', value: `To have a role assigned please check ${getChannel(client, newRecruitsChannel)}` },
        ],

    }
    member.roles.add(member.guild.roles.cache.find(role => role.name === newRecruits));
    getChannel(client, welcomeChannel).send({ embed: welcomeMessage });
});

client.on('guildMemberRemove', (member) => {
    getChannel(client, outChannel).send(`**${member.user.tag}** has left`);
})

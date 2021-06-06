const { Client, MessageEmbed } = require('discord.js');
const { testChannel, leagueInfoChannel, regulationsChannel, outChannel, welcomeChannel, formRegistrationsChannel, chatChannel, practiceChannel, racePollChannel, leagueWebsiteChannel, standingsChannel } = require('./channels');
const { newRecruits, reserves, drivers } = require('./roles');
const { getChannel, getEmbedFieldValueFromName, getRoleId, updateEmbedMessage, addUserToColumn, getDays, makeGrid, mapFieldsToGrid, mapTeamsToGrid, getNextTrack, shouldEndVote, getEmoji, getTeamFromRoles } = require('./util');
const fetch = require('node-fetch');

const client = new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] });

let votingFinished;
let commonEmbeddedMessage = {
    author: {
        name: 'European Formula Racing',
        icon_url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-emoji.png?raw=true',
        url: 'https://www.twitch.tv/europeanformularacing',
    },
}
let raceGrid;
let messageThatWasReactedOn;
let nextTrack;
let f1Teams;

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('The bot is ready');
    fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/tracks.json').then(response => {
        response.json().then((tracks) => {
            nextTrack = getNextTrack(tracks);
        })
    });
    fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/teams.json').then(teamsResponse => {
        teamsResponse.json().then((teams) => {
            f1Teams = teams;
        })
    });
    setInterval(() => {
        if (shouldEndVote(nextTrack)) {
            console.log('vote ended');
            messageThatWasReactedOn.reactions.removeAll();
            newEmbed = new MessageEmbed(makeGrid(messageThatWasReactedOn.embeds[0], raceGrid)).setDescription('Voting has finished, here is the grid for the next race.\nReact with ✅ if you would like to fill any last-minute empty seats');
            messageThatWasReactedOn.edit(newEmbed).then((message) => {
                message.react("✅");
                votingFinished = true;
                getChannel(client, chatChannel).send(`<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}> Race poll has ended. Grid is available in ${getChannel(client, racePollChannel)}`);
            });
        }
    }, getDays(1 / 24));
});

client.on('message', (message) => {
    if (message.content === '$next-track') {
        fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/tracks.json').then(response => {
            response.json().then((tracks) => {
                nextTrack = getNextTrack(tracks);

                message.reply(`the next race is held in ${nextTrack.name} ${nextTrack.flag}`);
                message.delete();
            })
        });
    }

    if (message.channel.name === standingsChannel) {
        if (message.content.indexOf('Standings of') > -1) {
            setTimeout(() => {
                getChannel(client, chatChannel).send(`<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}> General standings updated in ${getChannel(client, leagueWebsiteChannel)}`);
            }, 60000 * 5)
        }
    }

    if (message.channel.name === formRegistrationsChannel) {
        const discordUsername = getEmbedFieldValueFromName(message.embeds[0].fields, 'What is your Discord username?');
        const xboxGamertag = getEmbedFieldValueFromName(message.embeds[0].fields, 'What is your Xbox gamertag?');
        const member = message.guild.members.cache.find((member) => discordUsername.toLowerCase().indexOf(member.user.username.toLowerCase()) > -1 || member.user.username.toLowerCase().indexOf(discordUsername.toLowerCase()) > -1);
        member.setNickname(`${xboxGamertag}`);
        member.roles.add(getRoleId(message.guild, reserves));
        member.roles.remove(getRoleId(message.guild, newRecruits));

        getChannel(client, chatChannel).send(`Let's give a warm welcome to our newest member, <@${member.user.id}> !`);
    }

    if (message.member && message.member.hasPermission('ADMINISTRATOR')) { //message might be sent by bot
        if (message.content === '$restart') {
            getChannel(client, racePollChannel).send(`<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}>\n${getEmoji('red_flag')} Lobby restart !! ${getEmoji('red_flag')}`);
            message.delete();
        }

        if (message.content === '$start') {
            getChannel(client, racePollChannel).send(`<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}>\n${getEmoji('green_flag')} Let's gooo !! ${getEmoji('green_flag')}`);
            message.delete();
        }

        if (message.content === '$ready') {
            getChannel(client, racePollChannel).send(`<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}>\n${getEmoji('wet_tyre')}${getEmoji('intermediate_tyre')}${getEmoji('hard_tyre')}${getEmoji('medium_tyre')}${getEmoji('soft_tyre')}\nReady up !!`);
            message.delete();
        }

        if (message.content === '$race-poll') {
            votingFinished = false;
            message.delete();
            fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/tracks.json').then(response => {
                response.json().then((tracks) => {
                    fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/teams.json').then(teamsResponse => {
                        teamsResponse.json().then((teams) => {
                            f1Teams = teams;
                            raceGrid = mapTeamsToGrid(teams);
                            nextTrack = getNextTrack(tracks);

                            const racePollMessage = {
                                ...commonEmbeddedMessage,
                                description: 'Please vote for participation in the weekly race.\n Vote ends Friday 12 PM BST',
                                color: 0x2ac0f2,
                                thumbnail: { url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-icon.png?raw=true' },
                                fields: [
                                    { name: 'Track', value: `${nextTrack.name} ${nextTrack.flag}` },
                                    { name: 'Date', value: `${new Date(nextTrack.date).getDate()} ${new Date(nextTrack.date).toLocaleString('default', { month: 'long' })}` },
                                    { name: 'Time', value: '6 PM BST' },
                                    ...raceGrid.map((team) => {
                                        return {
                                            ...team,
                                            name: `${getEmoji(team.name)} ${team.name}`,
                                            value: '-',
                                        }
                                    })
                                ],
                                timestamp: new Date(),
                            }
                            getChannel(client, racePollChannel).send({ embed: racePollMessage, content: `<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}>` }).then(embedMessage => {
                                embedMessage.react("✅");
                                embedMessage.react("❌");
                            });
                        })
                    })
                });
            });
        }
    }
});

client.on('guildMemberAdd', (member) => {
    welcomeMessage = {
        ...commonEmbeddedMessage,
        thumbnail: { url: `${member.user.displayAvatarURL()}` },
        color: 0xf7c701,
        fields: [
            { name: '1. League Info', value: `Please take a look in ${getChannel(client, leagueInfoChannel)}` },
            { name: '2. Regulations', value: `Check out our ${getChannel(client, regulationsChannel)}` },
            { name: '3. Role', value: `To have a role assigned please complete this form: https://forms.gle/hWuyLnq5ww4ebsBd8` },
        ],

    }
    member.roles.add(getRoleId(member.guild, newRecruits));
    //user mention only work in message content, not embed
    getChannel(client, welcomeChannel).send({ embed: welcomeMessage, content: `Welcome <@${member.user.id}> to **${member.guild.name}** !` });
});

client.on('guildMemberRemove', (member) => {
    getChannel(client, outChannel).send(`**${member.user.tag}** has left`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.name === racePollChannel && !user.bot && !votingFinished) {
        const guildMembers = reaction.message.guild.members.cache
        const nickname = guildMembers.get(user.id).nickname;
        const discordUsername = user.username;
        const roles = guildMembers.get(user.id).roles.cache.map((role) => role.name);
        messageThatWasReactedOn = await reaction.message.channel.messages.fetch(reaction.message.id);
        const receivedEmbed = messageThatWasReactedOn.embeds[0];
        const usersTeam = getTeamFromRoles(roles, f1Teams);
        const isReserve = usersTeam === 'Reserve';
        const userWhoVoted = {
            id: user.id,
            nickname: nickname || discordUsername, //some users don't have nickname as it's null if nickname is same as username
        };

        if (usersTeam) {
            if (!raceGrid) {
                raceGrid = mapFieldsToGrid(receivedEmbed, guildMembers);
            }
            //remove from team
            raceGrid.forEach((team) => {
                if (team.drivers.find((driver) => driver.id === userWhoVoted.id)) {
                    team.drivers = team.drivers.filter((driver) => driver.id !== userWhoVoted.id);
                }
            });

            if (reaction.emoji.name === "❌") {
                //add to rejected columns
                addUserToColumn(raceGrid, 'Not participating', userWhoVoted);
            }

            if (reaction.emoji.name === "✅") {
                //add to team
                addUserToColumn(raceGrid, isReserve ? 'Reserves' : usersTeam, userWhoVoted);
            }

            if (receivedEmbed) {
                const newEmbed = new MessageEmbed(updateEmbedMessage(receivedEmbed, raceGrid));
                reaction.users.remove(user.id);
                reaction.message.edit(newEmbed);
            }
        } else reaction.users.remove(user.id);
    }
})

const { Client, MessageEmbed, UserManager } = require('discord.js');
const { newRecruitsChannel, testChannel, racePollChannel, leagueInfoChannel, regulationsChannel, outChannel, welcomeChannel, formRegistrationsChannel, chatChannel } = require('./channels');
const { newRecruits, reserves, drivers } = require('./roles');
const { getChannel, getEmbedFieldValueFromName, getRoleId, updateEmbedMessage, addUserToColumn } = require('./util');
const fetch = require('node-fetch');

const client = new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] });

let racePollMessage;
let nextTrack;
let commonEmbeddedMessage = {
    author: {
        name: 'European Formula Racing',
        icon_url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-emoji.png?raw=true',
        url: 'https://www.twitch.tv/europeanformularacing',
    },
}
let calendarTracks;
let f1Teams;
let raceGrid;

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('The bot is ready');
});

client.on('message', (message) => {
    if (message.content.includes('$bot')) {
        message.reply('I am online.');
    }

    if (message.content === '$next-track') {
        fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/tracks.json').then(response => {
            response.json().then((tracks) => {
                const now = Date.now();
                let nextTracks = tracks.map((track) => { return { ...track, date: new Date(track.date).getTime() } }).filter((track) => track.date > now);
                let nextTracksOrderedByDate = nextTracks.sort((a, b) => a.date - b.date);
                nextTrack = nextTracksOrderedByDate[0];

                message.reply(`the next race is held in ${nextTrack.name} ${nextTrack.flag}`);
                message.delete();
            })
        });
    }

    if (message.content.startsWith("$kick")) {
        var member = message.mentions.members.first();
        message.reply(`${member}`);
    }

    if (message.channel.name === formRegistrationsChannel) {
        const discordUsername = getEmbedFieldValueFromName(message.embeds[0].fields, 'What is your Discord username?');
        const xboxGamertag = getEmbedFieldValueFromName(message.embeds[0].fields, 'What is your Xbox gamertag?');
        const member = message.guild.members.cache.find((member) => discordUsername.toLowerCase().indexOf(member.user.username.toLowerCase()) > -1 || member.user.username.toLowerCase().indexOf(discordUsername.toLowerCase()) > -1);
        member.setNickname(`${xboxGamertag} - Res`);
        member.roles.add(getRoleId(message.guild, reserves));
        member.roles.remove(getRoleId(message.guild, newRecruits));

        getChannel(client, chatChannel).send(`Let's give a warm welcome to our newest member, <@${member.user.id}> !`);
    }
    if (message.content === '$race-poll') {
        fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/tracks.json').then(response => {
            response.json().then((tracks) => {
                fetch('https://raw.githubusercontent.com/Azhmo/efr/master/src/data/teams.json').then(teamsResponse => {
                    teamsResponse.json().then((teams) => {
                        f1Teams = teams;
                        raceGrid = f1Teams.map((team, index) => {
                            return {
                                name: team.name,
                                drivers: [],
                                inline: index < f1Teams.length - 1
                            }
                        });
                        raceGrid.push({
                            name: 'Reserves',
                            drivers: [],
                            inline: true,
                        });
                        raceGrid.push({
                            name: 'Not participating',
                            drivers: [],
                            inline: true,
                        });

                        calendarTracks = tracks;
                        const now = Date.now();
                        let nextTracks = calendarTracks.map((track) => { return { ...track, date: new Date(track.date).getTime() } }).filter((track) => track.date > now);
                        let nextTracksOrderedByDate = nextTracks.sort((a, b) => a.date - b.date);
                        let nextTrack = nextTracksOrderedByDate[0];

                        racePollMessage = {
                            title: 'Weekly Race',
                            author: {
                                name: 'European Formula Racing',
                                icon_url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-emoji.png?raw=true',
                                url: 'https://www.twitch.tv/europeanformularacing',
                            },
                            description: `<@&${getRoleId(message.guild, drivers)}> <@&${getRoleId(message.guild, reserves)}> Please vote for participation in the weekly race`,
                            color: 0x2ac0f2,
                            thumbnail: { url: 'https://github.com/Azhmo/efr/blob/master/src/assets/EFR-icon.png?raw=true' },
                            fields: [
                                { name: 'Track', value: `${nextTrack.name} ${nextTrack.flag}` },
                                { name: 'Date', value: `${new Date(nextTrack.date).getDate()} ${new Date(nextTrack.date).toLocaleString('default', { month: 'long' })}` },
                                { name: 'Time', value: '6 PM' },
                                ...raceGrid.map((team) => {
                                    return {
                                        ...team,
                                        value: '-',
                                    }
                                })
                            ],
                            timestamp: new Date(),
                        }
                        getChannel(client, testChannel).send({ embed: racePollMessage }).then(embedMessage => {
                            embedMessage.react("✅");
                            embedMessage.react("❌");
                        });
                    })
                })
            });
        });
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.name === testChannel && !user.bot) {
        const receivedEmbed = reaction.message.embeds[0];
        const nickname = reaction.message.guild.member(user).nickname;
        const usersTeam = nickname.split(" - ")[1];
        const isReserve = usersTeam === 'Res';
        const userWhoVoted = {
            id: user.id,
            nickname,
        };
        let newEmbed;

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
            newEmbed = new MessageEmbed(updateEmbedMessage(receivedEmbed, raceGrid));
            reaction.users.remove(user.id);
            reaction.message.edit(newEmbed);
        }
    }
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
            { name: '3. Role', value: `To have a role assigned please complete this form: https://forms.gle/hWuyLnq5ww4ebsBd8` },
        ],

    }
    member.roles.add(getRoleId(member.guild, newRecruits));
    getChannel(client, welcomeChannel).send({ embed: welcomeMessage });
});

client.on('guildMemberRemove', (member) => {
    getChannel(client, outChannel).send(`**${member.user.tag}** has left`);
})

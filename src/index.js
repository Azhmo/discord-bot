const { Client } = require('discord.js');
const handleNextRaceCommand = require('./commands/nextRace');
const handleLobbyRestart = require('./commands/restart');
const handleStart = require('./commands/start');
const handleReady = require('./commands/ready');
const handleLobbyUp = require('./commands/lobbyUp');
const handleFormRegistration = require('./eventHandlers/formRegistration');
const handleMemberAdd = require('./eventHandlers/memberAdd');
const handleMemberRemove = require('./eventHandlers/memberRemove');

const client = new Client({ partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'] });

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('The bot is ready');
});

client.on('message', (message) => {
    handleNextRaceCommand(message);

    handleFormRegistration(client, message);

    if (message.member && message.member.hasPermission('ADMINISTRATOR')) { //message might be sent by bot
        handleLobbyUp(client, message);
        handleLobbyRestart(client, message);
        handleStart(client, message);
        handleReady(client, message);
    }
});

client.on('guildMemberAdd', (member) => handleMemberAdd(client, member));

client.on('guildMemberRemove', (member) => handleMemberRemove(client, member));

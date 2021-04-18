const { Guild } = require('discord.js');

const guild = new Guild();

const getChannel = (client, channelName) => client.channels.cache.find(channel => channel.name === channelName);
const getRoleId = (message, roleName) => message.guild.roles.cache.find(role => role.name === roleName).id;
const addUsernameToColumn = (embedMessage, username, column) => {
    embedMessage.fields.forEach((field) => {
        if (field.name === column && field.value.indexOf(username) === -1) {
            field.value += '\n' + username;
        }
    });

    return embedMessage;
};

exports.getChannel = getChannel;
exports.getRoleId = getRoleId;
exports.addUsernameToColumn = addUsernameToColumn;
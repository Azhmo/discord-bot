const { Guild } = require('discord.js');

const guild = new Guild();

const getChannel = (client, channelName) => client.channels.cache.find(channel => channel.name === channelName);
const getRoleId = (message, roleName) => message.guild.roles.cache.find(role => role.name === roleName).id;

exports.getChannel = getChannel;
exports.getRoleId = getRoleId;
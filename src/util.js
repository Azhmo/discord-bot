const { Guild } = require('discord.js');

const guild = new Guild();

const getChannel = (client, channelName) => client.channels.cache.find(channel => channel.name === channelName);
const getRoleId = (guild, roleName) => guild.roles.cache.find(role => role.name === roleName).id;
const addUsernameToColumn = (embedMessage, username, column) => {
    embedMessage.fields.forEach((field) => {
        if (field.name === column && field.value.indexOf(username) === -1) {
            if (field.value === '-') {
                field.value = '';
            }
            field.value += '\n' + username;
        }
    });

    return embedMessage;
};
const removeValueFromField = (embedMessage, username) => {
    embedMessage.fields.forEach((field) => {
        if (field.value.indexOf(username) > -1) {
            field.value = field.value.replace(username, '');
            if (field.value === '') {
                field.value = '-';
            }
        }
    });

    return embedMessage;
};

const removeValueFromRejected = (embedMessage, username) => {
    embedMessage.fields.forEach((field) => {
        if (field.name === 'Rejected' && field.value.indexOf(username) > -1) {
            field.value = field.value.replace(username, '');
            if (field.value === '') {
                field.value = '-';
            }
        }
    });

    return embedMessage;
};

const getEmbedFieldValueFromName = (fields, fieldName) => fields.filter((field) => field.name === fieldName)[0].value;

exports.getChannel = getChannel;
exports.getRoleId = getRoleId;
exports.addUsernameToColumn = addUsernameToColumn;
exports.getEmbedFieldValueFromName = getEmbedFieldValueFromName;
exports.removeValueFromField = removeValueFromField;
exports.removeValueFromRejected = removeValueFromRejected;
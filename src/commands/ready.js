const { silverReserve, goldReserve, goldDriver, silverDriver } = require('./../roles');
const { getChannelById, getRoleId, getEmoji } = require('./../util');
const { goldRacePollChannel, silverRacePollChannel } = require('./../channels');

module.exports = (client, message) => {
    if (message.content === '$ready') {
        if (message.channel.id === goldRacePollChannel) {
            getChannelById(client, message.channel.id).send(`<@&${getRoleId(message.guild, goldDriver)}> <@&${getRoleId(message.guild, goldReserve)}>\n${getEmoji('wet_tyre')}${getEmoji('intermediate_tyre')}${getEmoji('hard_tyre')}${getEmoji('medium_tyre')}${getEmoji('soft_tyre')}\nReady up !!`);
        } else if (message.channel.id === silverRacePollChannel) {
            getChannelById(client, message.channel.id).send(`<@&${getRoleId(message.guild, silverDriver)}> <@&${getRoleId(message.guild, silverReserve)}>\n${getEmoji('wet_tyre')}${getEmoji('intermediate_tyre')}${getEmoji('hard_tyre')}${getEmoji('medium_tyre')}${getEmoji('soft_tyre')}\nReady up !!`);
        }
        message.delete();
    }
}
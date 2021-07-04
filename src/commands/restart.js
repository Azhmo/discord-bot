const { silverReserve, goldReserve, goldDriver, silverDriver } = require('./../roles');
const { getChannelById, getRoleId, getEmoji } = require('./../util');
const { goldRacePollChannel, silverRacePollChannel } = require('./../channels');

module.exports = (client, message) => {
    if (message.content === '$restart') {
        if (message.channel.id === goldRacePollChannel) {
            getChannelById(client, message.channel.id).send(`<@&${getRoleId(message.guild, goldDriver)}> <@&${getRoleId(message.guild, goldReserve)}>\n${getEmoji('red_flag')} Lobby restart!! ${getEmoji('red_flag')} `);
        } else if (message.channel.id === silverRacePollChannel) {
            getChannelById(client, message.channel.id).send(`<@&${getRoleId(message.guild, silverDriver)}> <@&${getRoleId(message.guild, silverReserve)}>\n${getEmoji('red_flag')} Lobby restart!! ${getEmoji('red_flag')} `);
        }
        message.delete();
    }
}
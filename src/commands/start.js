const { silverReserve, goldReserve, goldDriver, silverDriver } = require('./../roles');
const { getChannelById, getRoleId, getEmoji } = require('./../util');
const { goldRacePollChannel, silverRacePollChannel } = require('./../channels');

module.exports = (client, message) => {
    if (message.content === '$start') {
        if (message.channel.id === goldRacePollChannel) {
            getChannelById(client, message.channel.id).send(`<@&${getRoleId(message.guild, goldDriver)}> <@&${getRoleId(message.guild, goldReserve)}>\n${getEmoji('green_flag')} Let's gooo !! ${getEmoji('green_flag')}`);
        } else if (message.channel.id === silverRacePollChannel) {
            getChannelById(client, message.channel.id).send(`<@&${getRoleId(message.guild, silverDriver)}> <@&${getRoleId(message.guild, silverReserve)}>\n${getEmoji('green_flag')} Let's gooo !! ${getEmoji('green_flag')}`);
        }
        message.delete();
    }
}
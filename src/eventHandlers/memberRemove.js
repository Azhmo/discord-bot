const { getChannelById } = require('./../util');
const { outChannel } = require('./../channels');

module.exports = (client, member) => {
    getChannelById(client, outChannel).send(`**${member.user.tag}** has left`);
}
const { getChannelById, getEmbedFieldValueFromName, getRoleId } = require('./../util');
const { formRegistrationsChannel, generalChat } = require('./../channels');
const { silverReserve, newRecruits } = require('./../roles');

module.exports = async (client, message) => {
    if (message.channel.id === formRegistrationsChannel) {
        const discordUsername = getEmbedFieldValueFromName(message.embeds[0].fields, 'What is your Discord username?');
        const xboxGamertag = getEmbedFieldValueFromName(message.embeds[0].fields, 'What is your Xbox gamertag?');
        const member = message.guild.members.cache.find(
            (member) => discordUsername.toLowerCase().indexOf(member.user.username.toLowerCase()) > -1 || member.user.username.toLowerCase().indexOf(discordUsername.toLowerCase()) > -1
        );
        member.setNickname(`${xboxGamertag}`);
        await member.roles.add(getRoleId(message.guild, silverReserve));
        await member.roles.remove(getRoleId(message.guild, newRecruits));

        getChannelById(client, generalChat).send(`Let's give a warm welcome to our newest member, <@${member.user.id}> !`);
    }
}
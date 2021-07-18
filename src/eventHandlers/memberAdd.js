const { getChannelById, getRoleId } = require('./../util');
const { welcomeChannel, leagueInfoChannel, regulationsChannel } = require('./../channels');
const { newRecruits } = require('./../roles');

module.exports = (client, member) => {
    welcomeMessage = {
        author: {
            name: member.guild.name,
            icon_url: member.guild.iconURL(),
        },
        thumbnail: { url: `${member.user.displayAvatarURL()}` },
        color: 0xf7c701,
        fields: [
            { name: '1. League Info', value: `Please take a look in ${getChannelById(client, leagueInfoChannel)}` },
            { name: '2. Regulations', value: `Check out our ${getChannelById(client, regulationsChannel)}` },
            { name: '3. Role', value: `To have a role assigned please complete this form: https://forms.gle/hWuyLnq5ww4ebsBd8` },
        ],

    }
    member.roles.add(getRoleId(member.guild, newRecruits));
    //user mention only work in message content, not embed
    getChannelById(client, welcomeChannel).send({ embed: welcomeMessage, content: `Welcome <@${member.user.id}> to **${member.guild.name}** !` });
    client.users.cache.get(member.user.id).send(`Welcome to **${member.guild.name}** !\nYou need to fill this form to have a place on the grid: https://forms.gle/hWuyLnq5ww4ebsBd8`);
}
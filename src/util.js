const getChannelById = (client, channelId) => client.channels.cache.find(channel => channel.id === channelId);
const getRoleId = (guild, roleName) => guild.roles.cache.find(role => role.name === roleName).id;

const getEmoji = (name) => {
    const emojiList = [
        '<:EFR:772368443965571092>',
        '<:green_flag:847925591184375859>',
        '<:intermediate_tyre:847931248991273042>',
        '<:wet_tyre:847931217541857350>',
        '<:medium_tyre:847931282541248587>',
        '<:soft_tyre:847931282988990495>',
        '<:hard_tyre:847931283039584306>',
        '<:clean:848208902650331176>',
        '<:red_flag:848219377161601046>',
    ];

    return emojiList.find((emoji) => {
        return emoji.indexOf(name) > -1
    }) || '';
}


const getEmbedFieldValueFromName = (fields, fieldName) => fields.filter((field) => field.name === fieldName)[0].value;

exports.getRoleId = getRoleId;
exports.getEmbedFieldValueFromName = getEmbedFieldValueFromName;
exports.getEmoji = getEmoji;
exports.getChannelById = getChannelById;
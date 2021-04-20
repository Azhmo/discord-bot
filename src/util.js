const getChannel = (client, channelName) => client.channels.cache.find(channel => channel.name === channelName);
const getRoleId = (guild, roleName) => guild.roles.cache.find(role => role.name === roleName).id;
const updateEmbedMessage = (embedMessage, raceGrid) => {
    embedMessage.fields = [
        embedMessage.fields[0],
        embedMessage.fields[1],
        embedMessage.fields[2],
        ...raceGrid.map((team) => {
            return {
                name: team.name,
                value: team.drivers.length ? team.drivers.map((driver) => driver.nickname).join('\n') : '-',
                inline: team.inline,
            }
        })
    ]

    return embedMessage;
}

const addUserToColumn = (raceGrid, columnName, userWhoVoted) => {
    const column = raceGrid.find((team) => team.name === columnName);
    if (!column.drivers.find((driver) => driver.id === userWhoVoted.id)) {
        column.drivers.push(userWhoVoted);
    }
}

const getEmbedFieldValueFromName = (fields, fieldName) => fields.filter((field) => field.name === fieldName)[0].value;

exports.getChannel = getChannel;
exports.getRoleId = getRoleId;
exports.updateEmbedMessage = updateEmbedMessage;
exports.getEmbedFieldValueFromName = getEmbedFieldValueFromName;
exports.addUserToColumn = addUserToColumn;
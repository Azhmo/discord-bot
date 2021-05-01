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
                value: team.drivers.length > 0 ? team.drivers.map((driver) => driver.username).join('\n') : '-',
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

const makeGrid = (embedMessage, raceGrid) => {
    const reserves = raceGrid.filter((grid) => grid.name === 'Reserves');
    const teams = raceGrid.filter((grid) => grid.name !== 'Reserves' && grid.name !== 'Not participating');
    let teamsWithAvailableSeat = teams.filter((team) => team.drivers.length < 2);
    reserves[0].drivers.forEach((reserve, index) => {
        if (teamsWithAvailableSeat.length > 0) {
            reserves[0].drivers[index] = undefined;
            teamsWithAvailableSeat[0].drivers.push(reserve);
            teamsWithAvailableSeat = teamsWithAvailableSeat.filter((team) => team.drivers.length < 2);
        }
    });
    reserves[0].drivers = reserves[0].drivers.filter((driver) => !!driver);

    return updateEmbedMessage(embedMessage, [...teams, ...reserves]);
}

const getDays = (days) => days * 1000 * 3600 * 24;

exports.getChannel = getChannel;
exports.getRoleId = getRoleId;
exports.updateEmbedMessage = updateEmbedMessage;
exports.getEmbedFieldValueFromName = getEmbedFieldValueFromName;
exports.addUserToColumn = addUserToColumn;
exports.getDays = getDays;
exports.makeGrid = makeGrid;
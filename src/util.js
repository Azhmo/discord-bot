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

const mapFieldsToGrid = (embedMessage, guildMembers) => {
    const fields = embedMessage.fields;
    //exclude other fields
    return fields.map((field) => field).filter((field) => field.name !== 'Track' && field.name !== 'Time' && field.name !== 'Date').map((field) => {
        // get drivers username
        const drivers = field.value.split('\n');

        return {
            name: field.name,
            //find driver id and username
            drivers: drivers.map((driver) => {
                const memberFound = guildMembers.find((member) => {
                    //check if there is a '-' as empty driver
                    if (member.nickname && driver !== '-') {
                        return member.nickname.indexOf(driver) > -1;
                    }
                })

                if (memberFound) {
                    return {
                        id: memberFound.user.id,
                        username: memberFound.nickname.split(' - ')[0],
                    }
                }
            }).filter((driver) => driver !== undefined),
            inline: field.inline,
        }
    });
}

const mapTeamsToGrid = (teams) => {
    const raceGrid = teams.map((team, index) => {
        return {
            name: team.name,
            drivers: [],
            inline: index < teams.length - 1
        }
    })
    raceGrid.push({
        name: 'Reserves',
        drivers: [],
        inline: true,
    });
    raceGrid.push({
        name: 'Not participating',
        drivers: [],
        inline: true,
    });

    return raceGrid;
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

const getNextTrack = (tracks) => {
    const now = Date.now();
    const nextTracks = tracks.map((track) => { return { ...track, date: new Date(track.date).getTime() } }).filter((track) => track.date > now);
    const nextTracksOrderedByDate = nextTracks.sort((a, b) => a.date - b.date);

    return nextTracksOrderedByDate[0];
}

const shouldEndVote = (nextTrack) => {
    const now = Date.now();
    const date = now.getDate();
    const hour = now.getHours();
    const nextTrackDate = new Date(nextTrack.date).getDate();
    return nextTrackDate === date && hour === 11;
}

const getDays = (days) => days * 1000 * 3600 * 24;

exports.getChannel = getChannel;
exports.getRoleId = getRoleId;
exports.updateEmbedMessage = updateEmbedMessage;
exports.getEmbedFieldValueFromName = getEmbedFieldValueFromName;
exports.addUserToColumn = addUserToColumn;
exports.getDays = getDays;
exports.makeGrid = makeGrid;
exports.mapFieldsToGrid = mapFieldsToGrid;
exports.mapTeamsToGrid = mapTeamsToGrid;
exports.getNextTrack = getNextTrack;
exports.shouldEndVote = shouldEndVote;
const getChannel = (client, channelName) => client.channels.cache.find(channel => channel.name === channelName);
const getRoleId = (guild, roleName) => guild.roles.cache.find(role => role.name === roleName).id;
const updateEmbedMessage = (embedMessage, raceGrid) => {
    embedMessage.fields = [
        embedMessage.fields[0],
        embedMessage.fields[1],
        embedMessage.fields[2],
        ...raceGrid.map((team) => {
            return {
                name: `${getEmoji(team.name)} ${team.name}`,
                value: team.drivers.length > 0 ? team.drivers.map((driver) => driver.nickname).join('\n') : '-',
                inline: team.inline,
            }
        })
    ]
    return embedMessage;
}

const getEmoji = (teamName) => {
    const emojiList = [
        '<:ferrari:843212002364882986>',
        '<:mercedes:843211983745843241>',
        '<:alphatauri:843225114271416400>',
        '<:renault:843217119906627586>',
        '<:mclaren:843212127773917205>',
        '<:williams:843217071261483008>',
        '<:alfaromeo:843211936916570191>',
        '<:haas:843212018768281601>',
        '<:racingpoint:843212059013414942>',
        '<:redbull:843212058975666246>',
        '<:green_flag:847925591184375859>',
        '<:intermediate_tyre:847931248991273042>',
        '<:wet_tyre:847931217541857350>',
        '<:medium_tyre:847931282541248587>',
        '<:soft_tyre:847931282988990495>',
        '<:hard_tyre:847931283039584306>',
        '<:clean:848208902650331176>',
        '<:red_flag:848219377161601046>',
        ':no_entry:',
        ':blue_circle:',
        ':green_circle:',
    ];

    return emojiList.find((emoji) => {
        let emojiToSearchFor = '';

        if (teamName === 'Not participating') {
            emojiToSearchFor = 'no_entry';
        } else if (teamName === 'Reserves') {
            emojiToSearchFor = 'blue_circle';
        } else emojiToSearchFor = teamName.toLowerCase().split(' ').join('');

        return emoji.indexOf(emojiToSearchFor) > -1
    }) || '';
}

const mapFieldsToGrid = (embedMessage, guildMembers) => {
    const fields = embedMessage.fields;
    //exclude other fields
    return fields.map((field) => field).filter((field) => field.name !== 'Track' && field.name !== 'Time' && field.name !== 'Date').map((field) => {
        // get drivers username
        const drivers = field.value.split('\n');
        return {
            //map only team name (remove emoji from name)
            name: field.name.indexOf('<:') > -1 ? field.name.split('>')[1].trim() : (field.name.split(':')[2] ? field.name.split(':')[2].trim() : field.name),
            //find driver id and username
            drivers: drivers.map((driver) => {
                let usernameToLookFor;
                const memberFound = guildMembers.find((member) => {
                    usernameToLookFor = member.nickname || member.user.username;
                    //check if there is a '-' as empty driver
                    if (usernameToLookFor && driver !== '-') {
                        return usernameToLookFor.indexOf(driver) > -1;
                    }
                })

                if (memberFound) {
                    return {
                        id: memberFound.user.id,
                        nickname: usernameToLookFor,
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
    const now = new Date();
    const date = now.getDate();
    const hour = now.getHours();
    const nextTrackDate = new Date(nextTrack.date).getDate();
    return nextTrackDate === date && hour === 11;
}

const getDays = (days) => days * 1000 * 3600 * 24;

const getTeamFromRoles = (roles, teams) => {
    return roles.find((role) => teams.map((team) => team.name).indexOf(role) > -1 || role === 'Reserve');
}

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
exports.getEmoji = getEmoji;
exports.getTeamFromRoles = getTeamFromRoles;
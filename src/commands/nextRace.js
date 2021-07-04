const fetch = require('node-fetch');

module.exports = (message) => {
    if (message.content === '$next-race') {
        fetch('https://efr-be.herokuapp.com/api/nextTrack').then(response => {
            response.json().then((nextTrack) => {
                message.reply(`the next race is held in ${nextTrack.name} ${nextTrack.flag} on ${new Date(nextTrack.date).getDate()} ${new Date(nextTrack.date).toLocaleString('default', { month: 'long' })} at ${new Date(nextTrack.date).toLocaleString('default', { hour: 'numeric', hour12: true, timeZone: 'Europe/London' })} UK Time`);
                message.delete();
            })
        });
    }
}
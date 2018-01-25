const planUtils = require('planUtils');
const settings = require('settings');
const utils = require('utils');

const plans = {
    planRoom: function (room) {
        if (planUtils.numberOfContainers(room) < 2 ) {
            bootstrapRoom(room);
        }

    },

};

function bootstrapRoom(room) {
    utils.logMessage("Bootstrapping Room: " + JSON.stringify(room));
    const energyLocations = settings.rooms[room.name].energySources;
    utils.logMessage("Energy Locations: " + JSON.stringify(energyLocations));
    for (const e in energyLocations) {
        let locations = planUtils.nonWallsNextToLocation(room, energyLocations[e]);
        utils.logMessage("Empty Locations: " + JSON.stringify(locations));
        for (const l in locations) {
            const objects = room.lookAt(locations[l].x, locations[l].y);
            utils.logObject(objects);
        }
    }
}

module.exports = plans;
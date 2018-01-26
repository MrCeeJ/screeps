const planUtils = require('planUtils');
const settings = require('settings');
const utils = require('utils');

const plans = {
    planRoom: function (room, spawns) {
        if (planUtils.numberOfPlannnedContainers(room) < 2 ) {
            bootstrapRoom(room, spawns);
        } else if (planUtils.numberOfContainers(room) < 2 ) {
            utils.logMessage("Room still under construction");
        }
    },
};

function bootstrapRoom(room, spawns) {
    utils.logMessage("Bootstrapping Room: " + JSON.stringify(room));
    const energyLocations = settings.rooms[room.name].energySources;
    //utils.logMessage("Energy Locations: " + JSON.stringify(energyLocations));
    for (const e in energyLocations) {
        let locations = planUtils.nonWallsNextToLocation(room, energyLocations[e].pos);
        let goodLocations = [];
        //utils.logMessage("Empty Locations: " + JSON.stringify(locations));
        for (const l in locations) {
            const structures = room.lookForAt(LOOK_STRUCTURES,locations[l].x, locations[l].y);
            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES,locations[l].x, locations[l].y);

            if (_(structures).size() ===  0 && _(sites).size() ===0 ){
                utils.logObject("Empty space found at ["+locations[l].x+","+locations[l].y+"]: for ", energyLocations[e].pos);
                goodLocations.push(locations[l]);
            }
        }
        if (_(goodLocations).size() === 0) {
            utils.logMessage("Warning, unable to find good site for container");
        }
        else if (_(goodLocations).size() === 1) {
            buildContainersAndSpawnPaths(room, spawns, goodLocations[0]);
        }
        else {
            let positions = planUtils.getPositions(room, goodLocations);
            const target = _(positions).sortBy(s => _(s.findPathTo(spawns[0].pos)).size()).first();
            buildContainersAndSpawnPaths(room, spawns, target);
        }
    }
}

function buildContainersAndSpawnPaths(room, spawns, endLocation) {
    // utils.logMessage("Placing container site at ["+endLocation.x+","+endLocation.y+"]");
    room.createConstructionSite(endLocation.x, endLocation.y,STRUCTURE_CONTAINER);
    // using first spawn rather than closest
    const start = spawns[0].pos;
    utils.logMessage("Pathing to  ["+endLocation.x+","+endLocation.y+","+room.name+"]");
    const end = new RoomPosition(endLocation.x, endLocation.y, room.name);
    const path = room.findPath(start, end, {ignoreCreeps : true, ignoreRoads : true});
    for (const p in path) {
        // utils.logMessage("Placing road site at ["+path[p].x+","+path[p].y+"]");
        room.createConstructionSite(path[p].x, path[p].y,STRUCTURE_ROAD);
    }
}

module.exports = plans;
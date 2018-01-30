const planUtils = require('planUtils');
const utils = require('utils');

const plans = {
    planRoom: function (room, spawns) {
        return bootstrapRoom(room, spawns) || connectController(room);

    },
};

function bootstrapRoom(room, spawns) {
    if (planUtils.numberOfPlannedAndRealContainers(room) < 2 ) {
        utils.logMessage("Bootstrapping Room: " + JSON.stringify(room));
        const energyLocations = Memory.rooms[room.name].energySources;
        for (const e in energyLocations) {
            let locations = planUtils.nonWallsNextToLocation(room, energyLocations[e].pos);
            let goodLocations = [];
            for (const l in locations) {
                const structures = room.lookForAt(LOOK_STRUCTURES, locations[l].x, locations[l].y);
                const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, locations[l].x, locations[l].y);

                if (_(structures).size() === 0 && _(sites).size() === 0) {
                    utils.logObject("Empty space found at [" + locations[l].x + "," + locations[l].y + "]: for ", energyLocations[e].pos);
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
        return true;
    } else {
        return false;
    }

}

function connectController(room) {
    if (planUtils.numberOfContainers(room) < 0 ) {
        utils.logMessage("Room still under construction");
        let roads = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_ROAD)
            .value();

        let roadPositions = planUtils.getPos(roads);
        const closest = room.controller.pos.findClosestByRange(roadPositions);
        const path = room.findPath(closest, room.controller.pos, {ignoreCreeps : true, ignoreRoads : true});
        planUtils.buildRoadAlongPath(room, path);
        return true;
    }
    return false;
}

function buildContainersAndSpawnPaths(room, spawns, endLocation) {
    // utils.logMessage("Placing container site at ["+endLocation.x+","+endLocation.y+"]");
    room.createConstructionSite(endLocation.x, endLocation.y,STRUCTURE_CONTAINER);
    // using first spawn rather than closest
    const start = spawns[0].pos;
    utils.logMessage("Pathing to  ["+endLocation.x+","+endLocation.y+","+room.name+"]");
    const end = new RoomPosition(endLocation.x, endLocation.y, room.name);
    const path = room.findPath(start, end, {ignoreCreeps : true, ignoreRoads : true});
    planUtils.buildRoadAlongPath(room, path);

    let roads = _(room.find(FIND_STRUCTURES))
        .filter(s => s.structureType === STRUCTURE_ROAD).value();
    const closest = spawns[0].pos.findClosestByRange(roads);
    const spawnPath = room.findPath(closest.pos, spawns[0].pos, {ignoreCreeps : true, ignoreRoads : true});
    planUtils.buildRoadAlongPath(room, spawnPath);


}

module.exports = plans;
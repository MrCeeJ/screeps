const planUtils = require('planUtils');
const settings = require('settings');
const utils = require('utils');

const plans = {
    planRoom: function (room, spawns) {
        if (planUtils.numberOfPlannedAndRealContainers(room) < 2 ) {
            bootstrapRoom(room, spawns);
        } else if (planUtils.numberOfContainers(room) < 0 ) {
            utils.logMessage("Room still under construction");
            let roads = _(room.find(FIND_STRUCTURES))
                .filter(s => s.structureType === STRUCTURE_ROAD)
                .value();

          //  utils.logObject("Roads :",roads);
            let roadPositions = planUtils.getPos(roads);
           // utils.logObject("Road Pos :",roadPositions);
            const closest = room.controller.pos.findClosestByRange(roadPositions);
         //   utils.logObject("Closest road to controller :",closest);
         //   utils.logObject("Controller ::",room.controller.pos);
            const path = room.findPath(closest, room.controller.pos, {ignoreCreeps : true, ignoreRoads : true});
         //   utils.logObject("Path to controller :",path);
            for (const p in path) {
              //   utils.logMessage("Placing road site at ["+path[p].x+","+path[p].y+"]");
                 room.createConstructionSite(path[p].x, path[p].y,STRUCTURE_ROAD);
             }
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
    let roads = _(room.find(FIND_STRUCTURES))
        .filter(s => s.structureType === STRUCTURE_ROAD).value();
    const closest = spawns[0].pos.findClosestByRange(roads);
    const spawnPath = room.findPath(closest.pos, spawns[0].pos, {ignoreCreeps : true, ignoreRoads : true});
    for (const p in spawnPath) {
         utils.logMessage("Placing road site at ["+path[p].x+","+path[p].y+"]");
        //room.createConstructionSite(spawnPath[p].x, spawnPath[p].y,STRUCTURE_ROAD);
    }

}

module.exports = plans;
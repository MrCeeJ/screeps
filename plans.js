const planUtils = require('planUtils');
const utils = require('utils');
const tech = require('tech');

const plans = {
    planRoom: function (room, spawnIds) {
        if (planUtils.containsNoConstructionSites(room)) {
            Memory.rooms[room.name].techLevel = planUtils.calculateTechLevel(room);
            techPlans[Memory.rooms[room.name].techLevel](room, spawnIds);
        } else {
            utils.logMessage("Room: " + room.name + " still under construction.");
        }
    },
};

const BOOTSTRAP = function (room, spawnIds) {
    if (Memory[room.name].techLevel === 'NONE') {
        utils.logMessage("Bootstrapping Room: " + JSON.stringify(room));
        const energyLocationIds = Memory.rooms[room.name].energySourceIds;
        for (const e in energyLocationIds) {
            let locations = planUtils.nonWallsNextToLocation(room, Game.getObjectById(energyLocationIds[e]).pos);
            let goodLocations = planUtils.findSpacesWithoutBuildingsOrSites(room, locations);

            if (_(goodLocations).size() === 0) {
                utils.logMessage("Warning, unable to find good site for container");
            }
            else {
                let positions = planUtils.getPositions(room, goodLocations);
                const containerLocation = _(positions).sortBy(s => _(s.findPathTo(Game.getObjectById(spawnIds[0]).pos)).size()).first();
                planUtils.buildContainersAndSpawnPaths(room, spawnIds, containerLocation);
            }
        }
    } else
        utils.logMessage("Warning, attempted to bootstrap room in incorrect state :", Memory[room.name].techLevel);
};

CONNECT = function (room) {
    if (Memory[room.name].techLevel === 'BOOTSTRAP') {
        let roads = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_ROAD)
            .value();

        let roadPositions = planUtils.getPos(roads);
        const closest = room.controller.pos.findClosestByRange(roadPositions);
        const path = room.findPath(closest, room.controller.pos, {ignoreCreeps: true, ignoreRoads: true});
        planUtils.buildRoadAlongPath(room, path);
    } else
        utils.logMessage("Warning, attempted to connect room in incorrect state :", Memory[room.name].techLevel);
};

STORE = function (room) {
    if (Memory[room.name].techLevel === 'CONNECT') {
        utils.logMessage("Attempted to build storage in room:", room.name);
    }
    else
        utils.logMessage("Warning, attempted to connect room in incorrect state :", Memory[room.name].techLevel);
};

LINK = function (room) {

};


/**
 A map from current room tech level to actions to move to the next one.
 */
const techPlans = {
    'NONE': BOOTSTRAP,
    'BOOTSTRAP': CONNECT,
    'CONNECTED': STORE,
    'BASIC_STORAGE': LINK
};
module.exports = plans;
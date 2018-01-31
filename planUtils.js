const utils = require('utils');
const tech = require('tech');

const planUtils = {

    calculateTechLevel(room) {
        if (planUtils.numberOfContainers(room) < 2) {
            if (planUtils.numberOfPlannedAndRealContainers(room) < 2) {
                return 'NONE';
            }
            else return 'BOOTSTRAP';
        }
        else return 'CONNECTED';
    },
    numberOfContainers: function (room) {
        return _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
    },
    numberOfPlannedAndRealContainers: function (room) {
        let containers = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
        let sites = _(room.find(FIND_CONSTRUCTION_SITES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
        return containers + sites;
    },

    nonWallsNextToLocation: function (room, pos) {
        const area = room.lookAtArea((pos.y) - 1, (pos.x) - 1, (pos.y) + 1, (pos.x) + 1, true);
        let spaces = [];
        // utils.logObject("Checking room:", room);
        // utils.logObject("Checking position:", pos);
        // utils.logObject("Area examined :", area);
        for (const a in area) {
            if (area[a].type === "terrain" && area[a].terrain !== 'wall' && (pos.x !== area[a].x || pos.y !== area[a].y)) {
                spaces.push(area[a]);
            }
        }
        return spaces;
    },

    nonWallPositionsNextToCoordinates: function (room, x, y) {
        const area = room.lookAtArea(y - 1, x - 1, y + 1, x + 1, true);
        let spaces = [];
        for (const a in area) {
            if (area[a].type === "terrain" && area[a].terrain !== 'wall' && (x !== area[a].x || y !== area[a].y)) {
                spaces.push(new RoomPosition(area[a].x, area[a].y, room.name));
            }
        }
        return spaces;
    },
    containsNoConstructionSites: function (room) {
        let sites = _(room.find(FIND_CONSTRUCTION_SITES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
        return sites === 0;
    },

    findSpacesWithoutBuildingsOrSites: function (room, locations) {
        const spaces = [];
        for (const l in locations) {
            const structures = room.lookForAt(LOOK_STRUCTURES, locations[l].x, locations[l].y);
            const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, locations[l].x, locations[l].y);

            if (_(structures).size() === 0 && _(sites).size() === 0) {
                utils.logObject("Empty space found at [" + locations[l].x + "," + locations[l].y + "]: for ", Game.getObjectById(energyLocationIds[e]).pos);
                spaces.push(locations[l]);
            }
        }
        return spaces;
    },

    getPos: function (items) {
        const positions = [];
        utils.logObject("Pos objects :", items);
        for (const obj in items) {
            positions.push(items[obj].pos);
        }
        return positions;
    },
    getPositions: function (room, locations) {
        const positions = [];
        for (const loc in locations) {
            const pos = new RoomPosition(locations[loc].x, locations[loc].y, room.name);
            positions.push(pos);
        }
        return positions;
    },
    getMiningPositions: function (room, currentSpawn, energySources) {
        const positions = [];
        for (const source in energySources) {
            const spaces = planUtils.nonWallPositionsNextToCoordinates(room, Game.getObjectById(energySources[source]).pos.x, Game.getObjectById(energySources[source]).pos.y);
            utils.logObject("spaces :", spaces);
            const target = _(spaces).sortBy(s => _(s.findPathTo(currentSpawn.pos, {
                ignoreCreeps: true,
                ignoreRoads: true
            })).size()).first();
            positions.push(target);
        }
        return positions;
    },
    findEnergySourceIdsInRoom: function (room) {
        const containers = _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .value();

        const ids = [];
        for (const c in containers) {
            ids.push(containers[c].id);
        }
        return ids;
    },
    buildRoadAlongPath(room, path) {
        for (const p in path) {
            room.createConstructionSite(path[p].x, path[p].y, STRUCTURE_ROAD);
        }
    },

    buildContainersAndSpawnPaths(room, spawns, containerLocation) {
    room.createConstructionSite(containerLocation.x, containerLocation.y, STRUCTURE_CONTAINER);
    const start = spawns[0].pos;
    utils.logMessage("Pathing to  [" + containerLocation.x + "," + containerLocation.y + "," + room.name + "]");
    const end = new RoomPosition(containerLocation.x, containerLocation.y, room.name);
    const path = room.findPath(start, end, {ignoreCreeps: true, ignoreRoads: true});
    planUtils.buildRoadAlongPath(room, path);

    let roads = _(room.find(FIND_STRUCTURES))
        .filter(s => s.structureType === STRUCTURE_ROAD).value();
    const closest = spawns[0].pos.findClosestByRange(roads);
    const spawnPath = room.findPath(closest.pos, spawns[0].pos, {ignoreCreeps: true, ignoreRoads: true});
    planUtils.buildRoadAlongPath(room, spawnPath);
    }
};

module.exports = planUtils;
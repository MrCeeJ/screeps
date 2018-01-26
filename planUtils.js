const utils = require('utils');

const planUtils = {
    numberOfContainers: function (room) {
        return _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size();
    },
    numberOfPlannedContainers: function (room) {
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
            const spaces = planUtils.nonWallPositionsNextToCoordinates(room, energySources[source].x, energySources[source].y);
            const target = _(spaces).sortBy(s => _(s.findPathTo(currentSpawn.pos)).size()).first();
            positions.push(target);
        }
        return positions;
    }

};

module.exports = planUtils;
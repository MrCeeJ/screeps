const utils = require('utils');
const planUtils = require('planUtils');

let data = {
    reset: function () {
        utils.logMessage("Resetting memory data");
        Memory.rooms = {};
        Memory.resetData = false;
        const defaults = {
            name: "",
            techLevel : "",
            spawnIds: [],
            energySourceIds: [],
            linkSourceId: '',
            linkDestinationId: '',
            sourceContainerIds: [],
            maxCreeps: 6,
            maxWorkers: 2,
            maxMiners: 2,
            maxUpgraders: 1,
            maxTransporters: 1,
        };
        for (const i in Game.spawns) {
            const r = Game.spawns[i].room;
            let location = defaults;
            location.name = r.name;
            location.spawnIds = utils.getIds(r.find(FIND_MY_SPAWNS));
            location.energySourceIds = utils.getIds(r.find(FIND_SOURCES_ACTIVE));
            location.techLevel = planUtils.calculateTechLevel(r);
            Memory.rooms[r.name] = location;
        }
    }
};

module.exports = data;
let data = {
    reset: function () {
        Memory.rooms = {};
        const defaults = {
            name: "",
            spawns: [],
            energySources: [],
            linkSourceId: '',
            linkDestinationId: '',
            mineralSources: [],
            sourceContainerIds: ['', ''],
            maxCreeps: 6,
            maxWorkers: 2,
            maxMiners: 2,
            maxUpgraders: 1,
            maxTransporters: 1,
        };
        for (const i in Game.spawns) {
            const r = Game.spawns[i].room;
            Memory.rooms[r.name] = defaults;
            Memory.rooms[r.name].name = r.name;
            Memory.rooms[r.name].spawns = r.find(FIND_MY_SPAWNS);
            Memory.rooms[r.name].energySources = r.find(FIND_SOURCES_ACTIVE);
        }
    }
};

module.exports = data;
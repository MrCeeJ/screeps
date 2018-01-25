const utils = require('utils');

let settings = {
    reset: false,
    flagCount: 1,
    activeSpawns: [],
    rooms: {}
};

if (settings.rooms.size === 0 || settings.reset) {

    if (settings.rooms.size === 0) {
        utils.logMessage("No rooms found, updating settings file");
    }
    else if (settings.reset) {
        utils.logMessage("Reset was requested, updating settings file");
        settings.reset = false;
    }
    else {
        utils.logMessage("Problem encoutered, updating settings file");
    }
    settings.rooms = {};
    settings.flagCount = 1;
    for (const i in Game.spawns) {
        //noinspection JSUnfilteredForInLoop
        settings.activeSpawns.push(Game.spawns[i]);
    }

    for (const s in settings.activeSpawns) {
        //noinspection JSUnfilteredForInLoop
        let r = settings.activeSpawns[s].room;
        utils.logMessage("Adding data for spawn : "+settings.activeSpawns[s]);
        utils.logMessage("Adding data for room : "+r.name);
        settings.rooms[r.name] = {
            spawns: r.find(STRUCTURE_SPAWN),
            energySources: r.find(RESOURCE_ENERGY).pos,
            linkSourceId: '',
            linkDestinationId: '',
            mineralSources: [],
            sourceContainerIds: ['', ''],
            maxCreeps: 5,
            maxWorkers: 1,
            maxMiners: 2,
            maxUpgraders: 1,
            maxTransporters: 1,
        };
        for (let s in settings.energySources) {
            //noinspection JSUnfilteredForInLoop
            r.createFlag(s.pos, settings.flagCount, 'Flag' + settings.flagCount, COLOR_YELLOW, COLOR_GREY);
            settings.flagCount++;
        }
    }
} else {
    utils.logMessage("Data intact, no need to update settings file");

}
module.exports = settings;
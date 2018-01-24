let settings = {
    reset: false,
    flagCount: 1,
    activeRooms: Game.rooms,
    rooms: {
        // 'W29N34': {
        //     spawns : ['Spawn1'],
        //     energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
        //     linkSourceId : '',
        //     linkDestinationId : '',
        //     mineralSources : [],
        //     sourceContainerIds : ['', ''],
        //     maxCreeps : 5,
        //     maxWorkers : 1,
        //     maxMiners : 2,
        //     maxUpgraders : 1,
        //     maxTransporters : 1,
        // },
        // 'E62S63' : {
        //     energySources : [Game.flags['Flag3'].pos],
        //     mineralSources : [],
        //     sourceContainerIds : []
        // }
    }
};

if (settings.rooms.size === 0 || settings.reset) {
    settings.rooms = {};
    settings.flagCount = 1;
    settings.reset = false;
    settings.activeRooms = Game.rooms;

    for (let r in settings.activeRooms) {
        //noinspection JSUnfilteredForInLoop
        settings.rooms.put(r.name, {
            spawns: r.find(StructureSpawn),
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
            }
        );
        for (let s in settings.energySources) {
            //noinspection JSUnfilteredForInLoop
            r.createFlag(s.pos, settings.flagCount, 'Flag' + settings.flagCount, COLOR_YELLOW, COLOR_GREY);
            settings.flagCount++;
        }
    }
}
module.exports = settings;
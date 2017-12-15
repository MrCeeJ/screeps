var settings = {
    activeRooms : ['W29N34'],
    rooms : {
        'W29N34': {
            spawns : ['Spawn1'],
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            linkSourceId : '',
            linkDestinationId : '',
            mineralSources : [],
            sourceContainerIds : ['', ''],
            maxCreeps : 5,
            maxWorkers : 1,
            maxMiners : 2,
            maxUpgraders : 1,
            maxTransporters : 1,
        },
        // 'E62S63' : {
        //     energySources : [Game.flags['Flag3'].pos],
        //     mineralSources : [],
        //     sourceContainerIds : []
        // }
    }
};
module.exports = settings;
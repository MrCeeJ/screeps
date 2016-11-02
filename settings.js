var settings = {
    activeRooms : ['E63S63'],
    rooms : {
        'E63S63': {
            spawns : ['Spawn1'],
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            linkSourceId : '581364ef587daed572db91df',
            linkDestinationId : '58136064cba4c6a855d51b5c',
            mineralSources : [],
            sourceContainerIds : ['580f7870ff27e79264b0c4f2', 'ceac8f84dfeb65d00c15'],
            maxCreeps : 5,
            maxWorkers : 1,
            maxMiners : 2,
            maxUpgraders : 1,
            maxTransporters : 1,
        },
        'E62S63' : {
            energySources : [Game.flags['Flag3'].pos],
            mineralSources : [],
            sourceContainerIds : []
        }
    }
};
module.exports = settings;
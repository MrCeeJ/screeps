var settings = {
    maxCreeps : 7,
    maxWorkers : 2,
    maxMiners : 2,
    maxUpgraders : 1,
    maxTransporters : 2,
    startingRoom : 'E63S63',
    rangerRoom : 'E62S63',
    startingSpawn : 'Spawn1',
    rooms : {
        'E63S63': {
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            linkSourceId : '581364ef587daed572db91df',
            linkDestinationId : '58136064cba4c6a855d51b5c',
            mineralSources : [],
            sourceContainerIds : ['580f6b288c4693a4382fd0c1', '580f7870ff27e79264b0c4f2']
        },
        'E62S63' : {
            energySources : [Game.flags['Flag3'].pos],
            mineralSources : [],
            sourceContainerIds : []
        }
    }
};
module.exports = settings;
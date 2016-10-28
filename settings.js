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
            mineralSources : [],
            sourceContainerIDs : ['580f6b288c4693a4382fd0c1', '580f7870ff27e79264b0c4f2']
        },
        'E62S63' : {
            energySources : [Game.flags['Flag3'].pos],
            mineralSources : [],
            sourceContainerIDs : []
        }
    }
};
module.exports = settings;
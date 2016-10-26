var settings = {
    maxCreeps : 10,
    maxWorkers : 5,
    maxMiners : 2,
    maxUpgraders : 1,
    maxTransporters : 2,
    startingRoom : 'E63S63',
    startingSpawn : 'Spawn1',
    rooms : {
        'E63S63': {
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            mineralSources : [Game.flags['Flag3']],
            sourceContainerIDs : ['580f6b288c4693a4382fd0c1', '580f7870ff27e79264b0c4f2']
        }
    }
};
module.exports = settings;

//   _.filter(Game.flags, (flag) => flag.color == COLOR_GREEN && flag.secondaryColor == COLOR_GREEN);
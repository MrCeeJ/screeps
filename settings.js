var settings = {
    maxCreeps : 9,
    maxDrones : 4,
    maxMiners : 2,
    maxUpgraders : 1,
    maxTransporters : 2,
    startingRoom : 'W9S51',
    rooms : {
        'W9S51': {
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            mineralSources : [Game.flags['Flag3']],
            sourceContainerIDs : ['5809fd94e691a1b041d962b5', '5808e172c85d9b0937e9d690']
        }
    }

};
module.exports = settings;

//   _.filter(Game.flags, (flag) => flag.color == COLOR_GREEN && flag.secondaryColor == COLOR_GREEN);
var settings = {
    maxCreeps : 9,
    maxDrones : 4,
    maxMiners : 2,
    maxUpgraders : 1,
    maxTransporters : 0,
    startingRoom : 'E63S63',
    rooms : {
        'E63S63': {
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            mineralSources : [Game.flags['Flag3']],
            sourceContainerIDs : []
        }
    }

};
module.exports = settings;

//   _.filter(Game.flags, (flag) => flag.color == COLOR_GREEN && flag.secondaryColor == COLOR_GREEN);
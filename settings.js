var settings = {
    maxCreeps : 7,
    maxDrones : 4,
    maxMiners : 2,
    maxUpgraders : 1,
    maxTransporters : 0,
    rooms : {
        'W9S51': {
            energySources : [Game.flags['Flag1'].pos, Game.flags['Flag2'].pos],
            mineralSources : [Game.flags['Flag3']]
        }
    }

};
module.exports = settings;

//   _.filter(Game.flags, (flag) => flag.color == COLOR_GREEN && flag.secondaryColor == COLOR_GREEN);
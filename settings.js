var settings = {
    maxCreeps : 10,
    maxDrones : 6,
    maxMiners : 2,
    maxUpgraders : 2,
    rooms : {
        'W9S51': {
            energySources : [Game.flags['Flag1'], Game.flags['Flag2']],
            mineralSources : [Game.flags['Flag3']]
        }
    }

};
module.exports = settings;

//   _.filter(Game.flags, (flag) => flag.color == COLOR_GREEN && flag.secondaryColor == COLOR_GREEN);
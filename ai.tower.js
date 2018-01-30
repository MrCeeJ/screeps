const tower = {
    /**
     * A basic Tower.
     *
     * @param tower **/
    run: function (tower) {
        let creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (creep) {
            tower.attack(creep);
            return OK;
        }
        creep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function (c) {
                return c.hits < c.hitsMax;
            }
        });
        if (creep) {
            tower.heal(creep);
            return OK;
        }
        if (tower.energy > 500) {
            let structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER];

            let structures = tower.room.find(FIND_STRUCTURES, {
                filter: function (s) {
                    return s.hits < (s.hitsMax * .7) && _.includes(structureTypes, s.structureType);
                }
            });
            if (structures.length) {
                var orderedStructures = _.sortByOrder(structures, ['hits']);
                tower.repair(_.first(orderedStructures));
                return OK;
            } else if (Game.time % 5 == 0) {
                structureTypes = [STRUCTURE_WALL, STRUCTURE_RAMPART];
                structures = tower.room.find(FIND_STRUCTURES, {
                    filter: function (s) {
                        return _.includes(structureTypes, s.structureType);
                    }
                });
                if (structures.length) {
                    orderedStructures = _.sortByOrder(structures, ['hits']);
                    tower.repair(_.first(orderedStructures));
                    return OK;
                }
            }
        }
    }
};
module.exports = tower;
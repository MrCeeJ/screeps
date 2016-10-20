const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const tower = {

    /**
     * A basic Tower.
     *
     * @param {Creep} creep **/

    run: function (tower) {
        let creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (creep) {
            tower.attack(creep);
            return OK;
        }
        creep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(c) { return c.hits < c.hitsMax;}
        });
        if(creep) {
            tower.heal(creep);
            return OK;
        }
        if(tower.energy > 500) {
            const structureTypes = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART];

            var structures = tower.room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    return s.hits < (s.hitsMax*.7) && _.includes(structureTypes, s.structureType);
                }
            });
            var orderedStructures = _.sortByOrder(structures, ['hits']);
            tower.repair(_.first(orderedStructures));
            return OK;
        }
    }
};
module.exports = tower;
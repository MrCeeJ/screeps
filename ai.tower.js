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
        creep = this.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(c) { return c.hits < c.hitsMax;}
        });
        if(creep) {
            tower.heal(creep);
            return OK;
        }
        if(tower.energy > 500) {
            var structure = tower.findWeakestStructureOfType([STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART]);
            if (structure) {
                tower.repair(structure);
                return OK;
            }
        }
    }
};
module.exports = tower;
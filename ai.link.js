const utils = require('utils');
const settings = require('settings');
const ai = require('ai.toolkit');

const tower = {

    /**
     * A basic Link.
     *
     * @param {STRUCTURE_LINK} link **/

    run: function (link) {
        if (settings.rooms[link.room].linkDestinationId == link.id){
            return true;
        } else {
            if(link.energy > 250) {

            }
        }



            var links = link.room.find(FIND_STRUCTURES, s => s.structureType == STRUCTURE_LINK && s.id != link.id);

            var orderedStructures = _.sortByOrder(structures, ['hits']);
            tower.repair(_.first(orderedStructures));
            return OK;
        }
    }
};
module.exports = tower;
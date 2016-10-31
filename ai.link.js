const utils = require('utils');
const settings = require('settings');

const tower = {

    /**
     * A basic Link.
     *
     * @param link **/
    run: function (link) {
        const destinationId = settings.rooms[link.room.name].linkDestinationId;
        if (link.id == destinationId) {
            return true;
        } else if (link.energy > 100) {
            utils.logMessage('Transferring energy from !'+link.pos +" to "+ Game.getObjectById(destinationId).pos);
            link.transferEnergy(Game.getObjectById(destinationId));
            return true;
        }
        else {
            utils.logMessage('Insufficient energy for transfer!');
            return false;
        }
    }
};
module.exports = tower;
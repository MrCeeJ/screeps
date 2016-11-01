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
        } else if (link.cooldown == 0) {
            if (link.energy > 400) {
               // utils.logMessage('Transferring '+link.energy+' energy from ' + link.pos + " to " + Game.getObjectById(destinationId).pos);
                link.transferEnergy(Game.getObjectById(destinationId));
                return true;
            }
            else {
               // utils.logMessage('Insufficient energy for transfer! ('+link.energy+')');
                return false;
            }
        }
    }
};
module.exports = tower;
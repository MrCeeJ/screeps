const utils = require('utils');

const planUtils = {
    numberOfContainers: function (room) {
        return _(room.find(FIND_STRUCTURES))
            .filter(s => s.structureType === STRUCTURE_CONTAINER)
            .size()
    },

    nonWallsNextToLocation : function(room, pos) {
        const area = room.lookAtArea(pos.y+1, pos.x-1, pos.y-1, pos.x+1,true);
        let spaces = []
        for (const a in area) {
            if (area[a].terrain !== 'wall' && !(area[a].x === pos.x && area[a].y === pos.y )) {
                spaces.push(area[a]);
            }
        }
        return spaces;
    }



};

module.exports = planUtils;
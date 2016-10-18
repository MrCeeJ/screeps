
// nightshades hunting code
var targets = _(creep.room.find(FIND_HOSTILE_CREEPS))
    .filter(c => c.owner.name == "sevenless")
    .sortBy(c => c.pos.getRangeTo(tower))
    .map(c => c.id);


const containers = _(creep.room.find(FIND_STRUCTURES))
    .filter(c => c.structureType == STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > creep.carryCapacity)
    .sortBy(c => c.pos.getRangeTo(creep))


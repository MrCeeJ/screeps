var creepExtensions = {
    register: function(creep) {
        Creep.prototype.findClosestSpawn = function() {
            return this.pos.findClosestByPath(FIND_MY_SPAWNS);
        };

        Creep.prototype.findClosestPlaceToDumpEnergy = function() {
            var priority1 = this.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
        }
        });

            //if(priority1) { return priority1; }

            var priority2 = this.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
        });

            //if(priority2) { return priority2; }

            var priority3 = this.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity;
        }
        });

            //return priority3;

            //  if(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS).length > 0) {
            //      if(priority2) {
            //          return priority2;
            //      } else if (priority1) {
            //          return priority1;
            //      } else {
            //          return priority3;
            //      }
            //  } else {
            if (priority1) {
                return priority1;
            } else if (priority2) {
                return priority2;
            } else {
                return priority3;
            }
            //  }

        };

        Creep.prototype.findClosestContainerThatIsNotFull = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(c) {
                    return c.structureType == STRUCTURE_CONTAINER && c.store.energy < c.storeCapacity;
                }
            });
        };

        Creep.prototype.findClosestContainerWithEnergy = function() {
            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(c) {
                    return c.structureType == STRUCTURE_CONTAINER && c.store.energy > 0;
                }
            });
        };

        Creep.prototype.findSources = function() {
            return this.room.find(FIND_SOURCES);
        };

        Creep.prototype.findClosestSource = function() {
            return this.pos.findClosestByPath(FIND_SOURCES);
        };

        Creep.prototype.findClosestStructureNeedingRepair = function() {
            var reallyWeak = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(s) {
                    switch (s.structureType) {
                        case STRUCTURE_WALL:
                            return s.hits < 100;
                        default:
                            return s.hits < (s.hitsMax * .05);
                    }
                }
            });

            if (reallyWeak) return reallyWeak;

            return this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(s) {
                    switch (s.structureType) {
                        case STRUCTURE_WALL:
                            return 0; // Don't upgrade the walls too much... This needs some adjustments later.
                        default:
                            return s.hits < (s.hitsMax * .7);
                    }
                }
            });
        };

        Creep.prototype.findWeakestStructureOfType = function(structureTypes) {
            structureTypes = structureTypes || [];

            var structures = this.room.find(FIND_STRUCTURES, {
                filter: function(s) {
                    return s.hits < (s.hitsMax * .7) && _.includes(structureTypes, s.structureType);
                }
            });

            var orderedStructures = _.sortByOrder(structures, ['hits']);

            return _.first(orderedStructures);
        };

        Creep.prototype.findClosestConstructionSite = function() {
            return this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        };

        Creep.prototype.placeRoadUnderMe = function() {
            return this.pos.createConstructionSite(STRUCTURE_ROAD);
        };

        Creep.prototype.targetIsInRange = function(target, n) {
            return this.pos.getRangeTo(target) <= n;
        };
    }
};

module.exports = creepExtensions;
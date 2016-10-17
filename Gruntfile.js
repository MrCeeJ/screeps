module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'MrCeeJ@gmail.com',
                password: 'iSuohM219Sc2',
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['*.js']
            }
        }
    });
}
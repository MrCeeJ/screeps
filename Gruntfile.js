module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'mrceej@gmail.com',
                password: 'q0Y5cet3tt6R',
                branch: 'default',
                ptr: false
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['*.js'],
                        flatten: true
                    }
                ]
            }
        }
    });
};
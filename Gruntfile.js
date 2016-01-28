module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    less: {
      dist: {
        files: {
          "dist/frontendquillo.css": "less/frontendquillo.less"
        }
      }
    },

    githooks: {
      all: {
        "pre-commit": "less:dist"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-githooks');
};

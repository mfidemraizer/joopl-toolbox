module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: " "
      },
      dist: {
          src: 
          [
            /* Namespaces: */
            
            /* joopl */
            "src/InvalidOperationException.js",
            "src/Convert.js",

            /* joopl.collections */
            "src/collections/Enumerator.js",
            "src/collections/Enumerable.js",
            "src/collections/ListEnumerator.js",
            "src/collections/List.js",
            "src/collections/TypedList.js",
            "src/collections/ObservableChange.js",
            "src/collections/ObservableList.js",
            "src/collections/Index.js",
            "src/collections/OrderedStringIndex.js",
            "src/collections/IndexedList.js"
          ],
          dest: "bin/<%= pkg.name %>.js"
      }
    },

    preprocess : {
        options: {
          context : {
            DEBUG: true
          }
        },
        js : {
          src : 'bin/<%= pkg.name %>.js',
          dest : 'bin/<%= pkg.name %>.js'
        }
    },

    uglify: {
      complete: {
        files: {
          "bin/<%= pkg.name %>.min.js" : 
          ["bin/<%= pkg.name %>.js"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'preprocess', 'uglify'])
};
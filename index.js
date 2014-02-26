var fs, handle, path, tree, yaml, marked;

fs = require('fs');
yaml = require('js-yaml');
marked = require('marked'); // markdown processor   
path = require('path');
var util = require('gulp-util');

var through = require("through2");
var es = require("event-stream");


var generateTree = function(param){

  'use strict'

  var params = param || {},
      patternsPath = path.resolve(params.patternsPath || './src/patterns'),
      jsonPath = path.resolve(params.jsonPath || './src/json/')

  var stream = through.obj(function (file, enc, callback) {

      /* File passed in */
      
      var parsedFile = tree(patternsPath)


      //var treeobject = eval("(" + parseFile + ")")
      var s = parsedFile.children.filter(function(a, b){
        return a.children
      })

      /**
       * If patternsPath doesnt exist
       */
      
      fs.stat(patternsPath, function(err, stats){
        if(err && erro.errno == 34){
          this.emit('error', new PluginError('gulp-tree', 'Patterns directory doesnt exist'));
        }
      })


      /**
       * Write the file
       */
      
      fs.stat(jsonPath, function(err, stats){

        if(err && err.errno == 34){

          fs.mkdir(jsonPath, 755)

        }
      })

      var files = [];

      for(var i = 0; i< s.length; i++){
          
          if(s[i].children && s[i].children.length){
              
              files.push(jsonPath+ '/' + s[i].name + '.json')

              fs.writeFile(jsonPath + '/'+ s[i].name+".json", JSON.stringify(s[i].children, null, 4), function(err){
                  if(err) {
                      console.log(err);
                  } else {
                                          
                      console.log("Generated json in " + jsonPath);
                  }
              })  
          }
          

      }

      return files;

      
      
      

  });


  var tree = function(root){
      
      var info, ring;
      root = root.replace(/\/+$/, "");
      if (fs.existsSync(root)) {
          ring = fs.lstatSync(root);
      } else {
          return 'error: root does not exist';
      }
      info = {
          path: root.replace(process.cwd()+'/src/', ''),
          name: path.basename(root).replace(/^\d./, '')
      };


      if (ring.isDirectory()) {

          var children = fs.readdirSync(root)         
          
          var filtered = children.filter(function(c){
              
              return c != '.DS_Store' && path.extname(c) != ".html"

          })

          delete(info.path)
          delete(info.type)

          //info.type = 'folder';

          info.children = filtered.map(function(child) {
              return tree(root + '/' + child);
          });
      } else if (ring.isFile()) {

          var contents = fs.readFileSync(root, {encoding: 'utf8'});
          var extname = path.extname(root);
          var parsedContent = {
                      filename: root,
                      filenameExtension: extname,
                      yaml: '',
                      markdown: '', 
                      content: '',
                      meta: {}
                  };

          var lines = contents.split('\n');   
          
          var frontMatter = '';

          if (lines[0].trim() === '---' || lines[0].trim() == "") {
              var firstFrontMatterMarker = lines.shift();
              var line = '';
              while (line !== '---') {
                  frontMatter = frontMatter + line + "\n"; // since we split by \n we'll add it back here and stay true to the source doc
                  line = lines.shift();
              }
          }
          parsedContent.yaml = frontMatter;
          parsedContent.meta = yaml.load(frontMatter);
          
          parsedContent.markdown = lines.join('\n');
          parsedContent.content = parsedContent.markdown;

          if(parsedContent.meta && Object.keys(parsedContent.meta).length > 1){
              info.meta = parsedContent.meta
          }          
          
          if(parsedContent.meta){
              info.name = parsedContent.meta.name 
          }
          
          
      } else if (ring.isSymbolicLink()) {
          info.type = 'link';
      } else {
          info.type = 'unknown';
      }
      return info;

  }

  return stream;

}

module.exports = generateTree;
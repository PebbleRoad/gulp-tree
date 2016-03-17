var fs, handle, jsyaml, path, tree, yaml;

fs = require('fs');
jsyaml = require('js-yaml');
path = require('path');

var through = require("through2");

var generateTree = function(param){

  'use strict'

  var params = param || {},
      patternsPath = path.resolve(params.patternsPath || './src/patterns'),
      jsonPath = path.resolve(params.jsonPath || './src/json/'),
      appPath = path.resolve(params.appPath || './src/')

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

          fs.mkdir(jsonPath)

        }
      })

      var files = [];

      for(var i = 0; i< s.length; i++){

          if(s[i].children && s[i].children.length){

              files.push(jsonPath+ '/' + s[i].slug + '.json')

              fs.writeFile(jsonPath + '/'+ s[i].slug+".json", JSON.stringify(s[i].children, null, 4), function(err){
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

  var excludedExtension = ['.png', '.jpg', '.git', '.jpeg', '.gif', '.html'];
  var tree = function(root){

      var info, ring;
      root = root.replace(/\/+$/, "");
      if (fs.existsSync(root)) {
          ring = fs.lstatSync(root);
      } else {
          return 'error: root does not exist';
      }
      info = {
          path: root.replace(path.join(appPath), ''),
          name: path.basename(root).replace(/^\d./, ''),
          slug: path.basename(root)
      };

      if (ring.isDirectory()) {

          var children = fs.readdirSync(root)

          var filtered = children.filter(function(c){

              var filepath = root + '/' + c,
                  isFile = fs.lstatSync(filepath).isFile(),
                  content = true;

              if(isFile && fs.readFileSync(filepath) == ""){
                content = false
              }

              return c != '.DS_Store' && excludedExtension.indexOf(path.extname(c)) == -1 && content

          })

          delete(info.path)

          info.children = filtered.map(function(child) {
              return tree(root + '/' + child);
          });


      } else if (ring.isFile()) {

          var contents = fs.readFileSync(root, {encoding: 'utf8'});
          var extname = path.extname(root);

          var re = /^(-{3}(?:\n|\r)([\w\W]+?)-{3})?([\w\W]*)*/
                , results = re.exec(contents.trim())
                , conf = {}
                , yamlOrJson;

          if((yamlOrJson = results[2])) {

            if(yamlOrJson.charAt(0) === '{') {
              conf = JSON.parse(yamlOrJson);
            } else {
              conf = jsyaml.load(yamlOrJson);
            }
          }

          if(conf.name){

              info.name = conf.name
          }else{

              return true;
          }


          /**
           * Add meta variables
           */

          info.meta = {};

          for(var key in conf){
              if(key != "name" && key != "description"){
              if(conf.hasOwnProperty(key)){
                info.meta[key] = conf[key]
              }
            }
          }

          if(Object.keys(info.meta).length < 1){
            delete(info.meta)
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

# gulp-tree

> Tree creates a structured hierarchical JSON from a folder structure

## Usage

First, install `gulp-tree` as a development dependency:

```shell
npm install --save-dev gulp-tree
```

Then, add it to your `gulpfile.js`:

```javascript
var tree = require("gulp-tree");

gulp.src('./src/*.html')
    .pipe(tree({
        patternsPath: './src/patterns',
        jsonPath: './src/json/',
        appPath: './src/'
    }))
```

## API

### tree(options)

#### options.patternsPath
Type: `String|Number`

Default: `./src/patterns`

Directory where the patterns are located

#### options.jsonPath
Type: `String`

Default: './src/json'

Directory where the json should be saved

## Usage

Tree creates a structured hierarchical JSON from a folder structure


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

var path = require('path')
var fs   = require('fs')

module.exports = function(publicPath, dest, filename) {
  filename = filename || 'rev-manifest.json'

  return function() {
    this.plugin("done", function(stats) {
      var stats    = stats.toJson()
      var chunks   = stats.assetsByChunkName
      var manifest = {}

      for (var key in chunks) {
        var originalFilename = key + '.js'
        manifest[path.join(publicPath, originalFilename)] = path.join(publicPath, chunks[key])
      }

      fs.writeFileSync(
        path.resolve(process.env.PWD, dest, filename),
        JSON.stringify(manifest)
      )
    })
  }
}

#!/usr/local/bin/node
var sharp   = require('sharp')
var fs      = require('fs')
var isImage = require('is-image')
var argv = require('minimist')(process.argv.slice(2), {
    default : {
        width       : 900,
        height      : 600,
        background  : 'white'
    },
    alias: {
        w: 'width',
        h: 'height',
        b: 'background'
    }
})

if (argv._.length < 1) {
    console.log('Missing parameter "folder"')
    process.exit(-1)
}

// Args
var folder          = argv._[0].startsWith('/') ? argv._[0] : `${process.cwd()}/${argv._[0]}`
folder              = folder.replace(/\/+$/, '') // remove trailing slash
var folder_resized  = `${folder}-resized`
var width           = argv.width
var height          = argv.height
var background      = argv.background

// Create folder if not exist
if (!fs.existsSync(folder_resized)){
    fs.mkdirSync(folder_resized);
}

// Resize
fs.readdirSync(folder).forEach((file) => {
    var path        = `${folder}/${file}`
    var path_resized  = `${folder_resized}/${file}`
    
    if (isImage(path)) {
        fs.readFile(path, (err, data) => {
            if (err) throw err
            sharp(path)
                .resize(width, height)
                .background(background)
                .embed()
                .toFile(path_resized, function(err) {
                    console.log(`* ${path_resized}`)
                })
        })
    }
})

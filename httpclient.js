const fs = require('fs');
const { Readable } = require('stream');
const http = require('http');
const path = require('path');
const STATIC_PATH = path.join(__dirname, "dist/");
const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    json: 'application/json',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};


const folderIndex = (folder) => new Readable({
    async read() {
        const files = [];
        const folders = [];
        const rel = folder.substring(STATIC_PATH.length);
        const items = await fs.promises.readdir(folder, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) folders.push(item.name + '/');
            else files.push(item.name);
            console.log(files, folders)
        }
    }
});

const prepareFile = async (url) => {
    const name = url === '/' ? 'index.html' : url;
    const filePath = path.join(STATIC_PATH, name);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const stat = await fs.promises.lstat(filePath).catch(() => false);
    const exists = !!stat;
    const isDirectory = stat && stat.isDirectory();
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : STATIC_PATH + '404.html';
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const factory = isDirectory ? folderIndex : fs.createReadStream;
    const stream = factory(streamPath);
    return { found, ext: isDirectory ? 'html' : ext, stream };
};

 client = http.createServer(async (req, res) => {
    console.log("create server")
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
  }) 

  module.exports = client;
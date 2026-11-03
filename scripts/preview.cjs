'use strict';
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),prefix='/week9-pixel-studio/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8'};
function createPreview(){return http.createServer(async(req,res)=>{
 const send=(status,body,type='text/plain; charset=utf-8')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);};
 try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.writeHead(302,{Location:prefix});return res.end();}if(!url.pathname.startsWith(prefix))return send(404,'Not a public study route.');let relative=decodeURIComponent(url.pathname.slice(prefix.length));if(relative.endsWith('/')||!relative)relative+='index.html';const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep))return send(403,'Outside the website.');const real=await fs.realpath(file);if(!real.startsWith(root+path.sep))return send(403,'Outside the website.');send(200,await fs.readFile(real),types[path.extname(real)]||'application/octet-stream');}catch{send(404,'Not found.');}
});}
if(require.main===module){const port=Number(process.env.PORT)||8749;createPreview().listen(port,'127.0.0.1',()=>console.log('Pixel Studio preview: http://127.0.0.1:'+port+prefix));}
module.exports={createPreview};

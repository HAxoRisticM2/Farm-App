import { readFileSync } from 'fs';
import { createServer } from 'http';
import { parse } from 'url';
import { fileURLToPath } from 'url';
import path from 'path';
import slugify from 'slugify';

import replaceTemplate from './modules/replaceTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

///////////////////BLOCKING ,SYNCRHONOUS WAY

// const txt= fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(txt)

// const txtIn=`this is what i am trying to write dwon on the new file .\n ${txt}.\n created on${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', txtIn);
// console.log(txtIn);

///////////////////UNBLOCKING ,ASYNCRHONOUS WAY

// fs.readFile('./txt/start.txt','utf-8', (err,data1) =>{
//     if (err) return console.log('ERROOOR!!!!!!!!!!!!')

//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2) =>{
//         console.log(data2)
//         fs.readFile('./txt/append.txt','utf-8', (err,data3) =>{
//             console.log(data3)

//             fs.writeFile('./txt/final.txt',`${data2}.\n${data3}`,'utf-8',err =>{
//                 console.log('written')
//             })
//         })
//     })
// })
// console.log('logg')
const tempOverview = readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

//////////////////////////SEVER///

const server = createServer((req, res) => {
  const { query, pathname } = parse(req.url, true);

  //OVERVIEW TEMPLATE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead('200', { 'content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    //PRODUCT TEMPLATE
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //CARD TEMPLATE
  } else if (pathname === '/api') {
    res.writeHead('200', { 'content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead('404', { 'content-type': 'text/html' });
    res.end('<h1>PAGE NOT FOUND</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to the requests on port 8000 👌');
});

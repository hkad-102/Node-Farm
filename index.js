const fs = require('fs');
const http = require('http');
const url = require('url');

//////////////////////////////////////
// FILES

//blocking synchronous way
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8', );
// console.log(textInput)
// const textOut = `This is what we know about Avacado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File is updated')

//Non-blocking Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {
//                 console.log('Your file has been written')
//             })
//         })
//     })
// })
// console.log('Will read file!');


//////////////////////////////////////
// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%ORGANIC%}/g, product.organic)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output;

}

const tempOverview =  fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard =  fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct =  fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data =  fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);
    
const server = http.createServer((req, res) => {
    const pathName = req.url;

    const { query, pathname } = url.parse(req.url, true)

    //overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('') //we put join here to convert it into string
        //console.log(cardHTML)
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHTML)
        res.end(output)
    
    //product page
    }else if (pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)

        res.end(output)

    // API
    }else if (pathname === '/api'){
       res.writeHead(200, {'Content-type': 'application/json'});
       res.end(data)

    //404 page
    }else {
        //we can send the headers also here in Content type we specify that it is of html type now the browser is expecting the html
        //we can also specify our own headers like my-own-header 
        //one more thing about headers is that we can only specify before declaring the header type
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        })
        res.end('<h1>Page not found</h1>') //if we don't provide this case then the loader keeps loading and try to find the response from the server
        //we can also send the status code
    }
})

server.listen(8000, 'localhost', () => {
    console.log('Listening to the request on the port no. 8000')
})

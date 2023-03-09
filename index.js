const express = require('express');
const url = require('url');
const moviesRouter=require('./Routes/moviesRouter');
//var express = require('express');
var app = express();
const fs=require('fs');
//import morgon to check server response

//const { request } = require('http');


////step2****************api***************************/////



app.use(express.json());

////step3******creating our custom middleware**** adding a new property to request object***********************/////
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next();
})

/*const logger=function(req,res,next){
    console.log("custom middleware is called");
    next();
}

app.use(logger);*/
////////////////////***********api use moviesRoute*************** */
app.use('/api/v1/movies',moviesRouter);




//////////////////***********api done*************** */

//////////////////step 1***********routing*************** */
const html = fs.readFileSync('./Template/index.html', 'utf-8',)
let products = JSON.parse(fs.readFileSync('./Data/products.json','utf-8'))
const  replaceHtml = require('./Modules/replaceHtml');
let productListHtml = fs.readFileSync('./Template/product-list.html', 'utf-8');
let productDetailHtml=fs.readFileSync('./Template/product-details.html', 'utf-8')

const getHome=(request,response)=>{
    let {query, pathname: path} = url.parse(request.url, true);
        
    
    response.writeHead(200, {
        //property with speacial character should come inside  '  qotes'
                   'Content-Type' : 'text/html',
                   //custom header
                    'my-header': 'Hellow, world'
                });

    response.end(html.replace('{{%CONTENT%}}', 'this is home' ));
   
};

//query parameter needed to be handled
const getProduct=(request,response)=>{
    const id=request.query.id;
    if(!id){
        let productHtmlArray = products.map((prod) => {
               return replaceHtml(productListHtml, prod);
        })
        let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','));
           response.writeHead(200, {'Content-Type': 'text/html' });
        response.end(productResponseHtml);
       } else {
        let prod = products[id]
           let productDetailResponseHtml = replaceHtml(productDetailHtml, prod);
        response.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));
       }
   
};

app.get('/',getHome);
app.get('/Home',getHome);
app.get('/Products',getProduct);
app.get('/Products/:id',getProduct);



module.exports=app;
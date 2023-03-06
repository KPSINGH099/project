const { response } = require('express');
const url = require('url');
var express = require('express');
var app = express();
const fs=require('fs');
const { request } = require('http');
var PORT = 3000;

////step2****************api***************************/////
let movies=JSON.parse(fs.readFileSync('./data/movies.json'));


app.use(express.json());

////step3******creating our custom middleware**** adding a new property to request object***********************/////
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next();
})


//Route handeler function for api feth ,fetch all,create
const getAllmovies=(req,res)=>{
    res.status(200).json({
        status:"sucescc",
        count:movies.length,
        data:{
            movies:movies
        }
    })
}

const getmovie=(req,res)=>{
    const id=req.params.id*1;

    let movie=movies.find(el=>el.id===id);
    
    if(!movie){
//404 data not found
       return  res.status(404).json({
            status:"fail",
           message:'movie with ID ' +id+' does not exists'
        })
    }
    //200 fetched sucessfully
    res.status(200).json({
        status:"sucescc",
    //property defined in our custom middleware
        requestedAt:req.requestedAt,
       data:{
            movie:movie
        }
    })
}

const createMovie=(req,res)=>{
    const newId=movies[movies.length - 1].id + 1;
    const newMovie=Object.assign({id:newId},req.body);
    movies.push(newMovie);

    //201 we added new movie
    fs.writeFileSync('./data/movies.json',JSON.stringify(movies),(err)=>{
        console.log(err);
        res.status(201).json({
            status:"sucescc",
            data:{
                movies:newMovie
            }
        })
    })
}

app.get('/api/v1/movies',getAllmovies);
app.get('/api/v1/movies/:id',getmovie);
app.post('/api/v1/movies',createMovie);
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

app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});

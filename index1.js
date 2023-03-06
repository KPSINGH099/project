var express = require('express');
var app = express();
const fs=require('fs');
var PORT = 3000;

let movies=JSON.parse(fs.readFileSync('./data/movies.json'));

app.use(express.json());
	
//Route handeler function
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

app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});

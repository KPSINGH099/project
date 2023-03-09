const fs=require('fs');
let movies=JSON.parse(fs.readFileSync('./data/movies.json'));
exports.getAllmovies=(req,res)=>{
    res.status(200).json({
        status:"sucescc",
        count:movies.length,
        data:{
            movies:movies
        }
    })
}

exports.getmovie=(req,res)=>{
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
    res.status(201).json({
        status:"sucess",
     data:{
            movie:movie
        }
    })
}

//this is bug we can not see response in postman but data being added in json file

exports.createMovie=(req,res)=>{
    console.log(req.body);

    const newId=movies[movies.length - 1].id + 1;
    const newMovie=Object.assign({id:newId},req.body);
    movies.push(newMovie);
    //fs.writeFileSync('./data/movies.json',JSON.stringify(movies),(err)=>{
    res.status(201).json({
        status:"sucesss",
    //property defined in our custom middleware
       data:{
            movie:newMovie
        }
    })
//})
   
};

//without fs.writefilesync it is genrating response in postman
//with fs.writefilesync it is working completitely fine in vscode also records are being added
//into our movies.json file but giving error in postman 
exports.updatemovie=(req,res)=>{
    const id=req.params.id*1;

    let movietoupdate=movies.find(el=>el.id===id);
    
    let index= movies.indexOf(movietoupdate);
    
    let output=Object.assign(movietoupdate,req.body);
    
    movies[index]=movietoupdate;

    //fs.writeFileSync('./data/movies.json',JSON.stringify(movies),(err)=>{
    //200 fetched sucessfully
    res.status(200).json({
        status:"sucess",
     data:{
            updatedmovie:output
        }
    })
//})
}
//delete is working fine
exports.deleteemovie=(req,res)=>{
    const id=req.params.id*1;

    let movietodelete=movies.find(el=>el.id===id);
    
    let index= movies.indexOf(movietodelete);
    
    movies.splice(index,1);

    fs.writeFileSync('./data/movies.json',JSON.stringify(movies),(err)=>{
    //200 fetched sucessfully
    res.status(204).json({
        status:"sucess",
     data:{
            movietodeleted:null
        }
    })
})
}
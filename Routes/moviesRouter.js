const express = require('express');
const moviesController=require('./../Controller/moviesController')
//seperating routes

const router=express.Router();

router.route('/')
                            .get(moviesController.getAllmovies)
                            .post(moviesController.createMovie);

router.route('/:id')
.get(moviesController.getmovie)
.patch(moviesController.updatemovie)
.delete(moviesController.deleteemovie);  

module.exports=router;

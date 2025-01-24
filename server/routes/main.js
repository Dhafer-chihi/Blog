const express = require('express');
const router = express.Router();
const Post = require('../models/Post')


// Routes
// Index - index page

// router.get('' , async (req , res)=>{
//     const locals = {
//         title : "Nodejs Blog",
//         description : "Simple blog created with NodeJs, Express and MongoDB"
//     }
//     try{
//         const data = await post.find();
//         res.render('index' , {locals , data});
//     }catch(error){
//         console.log(error);
        
//     }
// });


router.get('' , async (req , res)=>{
    try{
        const locals = {
            title : "Nodejs Blog",
            description : "Simple blog created with NodeJs, Express and MongoDB"
        }

        let perPage = 4 ;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort : {createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
                
        const nextPage = parseInt(page) + 1;

        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        
        res.render('index' , {
            locals,
            data,
            current : page,
            // if nextpage = hasNextPage else nextPage = null
            nextPage : hasNextPage ? nextPage : null
        });
    }catch(error){
        console.log(error);
        
    }
});


// function insertPost() {
//     Post.insertMany([
//         {
//             title : "Building a blog",
//             body : "The is a blog text",
//         },
//         {
//             title : "Building a blog1",
//             body : "The is a blog text",
//         },
//         {
//             title : "Building a blog2",
//             body : "The is a blog text",
//         },
//         {
//             title : "Building a blog3",
//             body : "The is a blog text",
//         },
//         {
//             title : "Building a blog4",
//             body : "The is a blog text",
//         },
//         {
//             title : "Building a blog5",
//             body : "The is a blog text",
//         },
//         {
//             title : "Building a blog6 ",
//             body : "The is a blog text",
//         },
//     ])
// }
// insertPost();






router.get('/about' , (req, res)=>{
    res.render('about');
})

module.exports = router;

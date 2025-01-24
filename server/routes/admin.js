const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { post } = require('./admin');

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET



/**
 * 
 * Check Login - Middleware 
 */

const authMiddleware = (req , res , next)=>{
    const token = req.cookies.token;
    
    if (!token){
        return res.status(401).json({message : 'Unauthorized'})
    }

    try {
        const decoded = jwt.verify(token , jwtSecret)
        req.userId = decoded.userId;
        next()
        
    } catch (error) {
        return res.status(401).json({message : 'Unauthorized'})
    }
}



/**
 * GET /
 * HOME
 */

router.get('/admin' , async (req , res)=>{
    const locals = {
        title : "Admin",
        description : "Simple blog created with NodeJs, Express and MongoDB"
    }
    try{
        res.render('admin/index' , {locals , layout : adminLayout});
    }catch(error){
        console.log(error);
        
    }
});

/**
 * POST /
 * Admin - Check Login
 */



router.post('/admin' , async (req , res)=>{
   
    try{
        const {username , password} = req.body;
        const user = await User.findOne({ username });
        if (!user){
            return res.status(401).json({ message : 'Invalid User' });
        }

        const isPasswordValid = await bcrypt.compare(password , user.password)
        if (!isPasswordValid){
            return res.status(401).json({ message : 'Invalid User' });
        }


        const token = jwt.sign({userId : user._id},jwtSecret)
        res.cookie('token' , token , {httpOnly: true})
        res.redirect('/dashboard')

        
    }catch(error){
        console.log(error);
        
    }
});


/**
 * GET /
 * Admin - Dashboard
 */
router.get('/dashboard' , authMiddleware ,async (req , res)=>{
    try {
        const locals = {
            title : 'Dashboard',
            description : 'Simple blog created with Node js , express and mongodb.'
        }
        const data = await Post.find()
        res.render('admin/dashboard' , {
            locals , data , layout : adminLayout
        })
    } catch (error) {
        
    }
    
})

/**
 * GET /
 * Admin - Create new post
 */

router.get('/add-post' , authMiddleware ,async (req , res)=>{
    try {
        const locals = {
            title : 'Add Post',
            description : 'Simple blog created with Node js , express and mongodb.'
        }
        const data = await Post.find()
        res.render('admin/add-post' , {
            locals , layout : adminLayout
        })
    } catch (error) {
        
    }
    
})

/**
 * POST /
 * Admin - Create new post
 */

router.post('/add-post' , authMiddleware ,async (req , res)=>{
    try {
        try {
            const newPost = new Post({
                title : req.body.title,
                body : req.body.body
            })
            await Post.create(newPost)
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error);
            
        }
    } catch (error) {
        console.log(error);
        
    }
    
})

/**
 * GET /
 * Admin - Edit post
 */

router.get('/edit-post/:id' , authMiddleware ,async (req , res)=>{
    try {
        const locals = {
            title : 'Edit Post',
            description : 'Simple blog created with Node js , express and mongodb.'
        }
        const post_id = req.params.id
        const data = await Post.findOne({_id : post_id})
        res.render('admin/edit-post' , {
            data , locals , layout : adminLayout
        })
    } catch (error) {
        console.log(error);
        
    }
    
})


/**
 * PUT /
 * Admin - Edit post
 */

router.put('/edit-post/:id' , authMiddleware , async(req , res)=>{
    try {
        const post_id = req.params.id
        await Post.findByIdAndUpdate(post_id , {
            title : req.body.title,
            body : req.body.body,
            updatedAt : Date.now()
        })
        
        res.redirect(`/edit-post/${post_id}`)
    } catch (error) {
        console.log(error);
        
    }
})



/**
 * DELETE /
 * Admin - Delete post
 */

router.delete('/delete-post/:id' ,async (req ,  res)=>{
    try {
        const post_id = req.params.id
        //await Post.deleteOne({ _id : req.params.id})
        await Post.findByIdAndDelete(post_id)
        res.redirect('/dashboard')
        
    } catch (error) {
        console.log(error);
    }
    
})



// router.post('/admin' , async (req , res)=>{
   
//     try{
//         const {username , password} = req.body;
//         if (req.body.username === 'username' && req.body.password === 'password'){
//             res.send('You are logged in')
//         }else{
//             res.send('Wrong username or password')
//         }

        
//     }catch(error){
//         console.log(error);
        
//     }
// });


/**
 * POST /
 * Admin - Register
 */



router.post('/register' , async (req , res)=>{
   
    try{
        const {username , password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 10)

        try {
            const user = await User.create({username , password : hashedPassword})
            res.status(201).json({message : 'User created' , user})
        } catch (error) {
            if (error.code === 11000){
                res.status(409).json({message : 'User already in use'})
            }
            res.status(500).json({message : 'Internal server error'})
        }

        
    }catch(error){
        console.log(error);
        
    }
});

/**
 * GET /
 * Admin - Logout
 */

router.get('/logout' , authMiddleware , async(req, res)=>{
    res.clearCookie('token')
    res.redirect('/')
})



module.exports = router;

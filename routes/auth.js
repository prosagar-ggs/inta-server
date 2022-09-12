const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secret')
// const requireLogin = require('../middleware/requireLogin');


// router.get('/topsecret/',requireLogin, (req, res) => {
//     console.log(req.headers)
//     // console.log(req.user)
//     res.send("secret information")
// })


router.post('/signup', (req, res) => {
    // console.log(req.body)
    const {name, email, password} = req.body
    // validations
        if(!name || !email || !password ) {
            return res.status(400).json({error:"name,password and email are required" })
        }
        
        User.findOne({email:email})
            .then(
                (savedUser)=>{
                    if(savedUser != null){
                        return res.status(400).json({error:"user is already registered"})
                    }
                    bcrypt.hash(password,12)
                        .then((hashedPassword)=>{
                            const user = new User({
                                name,
                                email,
                                password : hashedPassword
                            
                            })
                            user.save()
                            .then(
                                user => {
                                    res.json({message:"finally did it, u are captured"})
                            
                                }
                            )
                            .catch(
                                err=>{
                                    console.log(err)
                                }
                            )
                    }
                    )
                    
                }
            )
            .catch(
                err=>{
                    console.log(err)
                }
            )

})


router.post('/login', (req, res)=>{
    const {email,password} = req.body
    //console.log(req.body)
        if(!email || !password){
            return res.status(400).json({"error" : "Invalid email or password"})
        }
        User.findOne({email:email})
            .then(
                (savedUser)=>{
                    if(!savedUser){
                        return res.status(400).json({"error" : "Email or password was incorrect"})
                    }

                    bcrypt.compare(password,savedUser.password)
                    .then(
                        (doMatch)=>{
                            if(doMatch == true){
                                const token = jwt.sign({ _id:savedUser._id }, JWT_SECRET)
                                return res.json({message: "your signed successfully!!",token:token})

                            }
                            else{
                                return res.status(400).json({error: "Invalid password"})
                            }
                        }
                    )
            }
        )


    
})



module.exports = router
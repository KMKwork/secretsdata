//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app=express();


console.log(process.env.API_KEY);  //to know what is in the api key in .env file

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
          email:String,
          password:String
});

secret = process.env.SECRET;       //it will get the secret data from the env file
userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
          res.render("home");
});

app.get("/login",function(req,res){
          res.render("login");
});

app.post("/login",function(req,res){
          const username = req.body.username;
          const password = req.body.password;
          User.findOne({email:username},function(err,founduser){
                    if(err){
                              console.log(err);
                    }else{
                              if(founduser){
                                        if(founduser.password===password){
                                                  res.render("secrets");
                                        }
                              }
                    }
          });
});
app.get("/register",function(req,res){
          res.render("register");
});


app.post("/register",function(req,res){
          const newUser = new User({
                    email:req.body.username,
                    password:req.body.password
          });
          newUser.save(function(err){
                    if(err){
                              console.log(err);
                    }else{
                              res.render("secrets");
                    }
          });
});








app.listen(3000,function(){
          console.log("server started successfully !");
});
const express = require("express");
const app = new express();
const date = require(__dirname+"/date.js");

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

const items = [];
const workItems = [];


app.listen(3000,function(){
    console.log("Server started");
})

app.get("/",function(req,res){

    const day = date.getDate();
    res.render("list",{listTitle: day, listItems: items});
})

app.post("/",function(req,res){
    if(req.body.list==="Work"){
        workItems.push(req.body.newItem);
        res.redirect("/work");
    }
    else{
        items.push(req.body.newItem);
        res.redirect("/");
    }
})

app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List", listItems: workItems});
})
const express = require("express");
const app = new express();
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
// var _ = require('lodash');

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin_Vivek:vivek123@cluster1.ee4m9nd.mongodb.net/toDoListDB",{useNewUrlParser: true});

const itemsSchema = {
    name: String
}

const Items = mongoose.model("Item",itemsSchema);

const item1 = new Items({
    name: "Welcome to to do list!"
})

const item2 = new Items({
    name: "Click + sign to add more!"
})

const items = [item1, item2];
const workItems = [];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);



app.listen(process.env.PORT || 3000,function(){
    console.log("Server started");
})

app.get("/",function(req,res){
    const day = date.getDate();
    Items.find({},function(err, data){
        if(err){
            console.log(err);
        }
        else{
            res.render("list",{listTitle: "Today", listItems: data});
        }
    });
})

app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    if(itemName!=""){
        const item = new Items({
            name: itemName
        })
        if(listName==="Today"){
            item.save();
            res.redirect("/");
        }
        else{
            List.findOne({name: listName}, function(err, foundList){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+listName);
            })
        }
    }
    else{
        res.redirect('back');
    }    
})



app.get("/:typeOfList",function(req,res){
    const customListName = req.params.typeOfList;
   console.log("saved successfully")
   List.findOne({name: customListName}, function(err, foundList){
    if(err){
        console.log(err);
    }
    else if(foundList){
        res.render("list",{listTitle: foundList.name, listItems: foundList.items});
    }
    else{
        const list = new List({
            name: customListName,
            items: []
        });
       list.save();
       res.redirect("/"+customListName);
    }
   })
})

app.post("/delete", function(req, res){
    if(req.body.listName==="Today"){
        Items.findByIdAndRemove(req.body.checkbox, {}, function(err){
            if(err){
                console.log(err);
            }
        })
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name: req.body.listName}, {$pull: {items: {_id: req.body.checkbox}}},function(err, foundList){
            if(err){
                console.log(err);
            }
            res.redirect('back')
           })
        

    }
})
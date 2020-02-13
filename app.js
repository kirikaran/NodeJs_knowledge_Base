const express =require('express');
const path=require('path');
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/nodekb');
let db=mongoose.connection;

//check connection
db.once('open',function(){
    console.log('connected to MongoDB');
});

//check for DB errors
db.on('error',function(err){
    console.log(err);
});

//init app
const app=express();

//Bring in Model
let Article=require('./models/article');
//load engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
//home route


app.get('/',function(req,res){
   Article.find({},function(err,articles){
       if(err){
           console.log(err);
       }else{
   
           //console.log(articles)
           res.render('index',{

            title:'Articles',
            articles:articles
        });
    
}
   });
});
    

//Add Route
app.get('/articles/add',function(req,res){
    res.render('add_article',{
        tittle:'Add Article'
    })
})

//start server
app.listen(3000,function(){
    console.log('server started on port 3000...');
});
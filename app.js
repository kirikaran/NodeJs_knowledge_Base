const express =require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

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

//body-parser middleware
app.use(bodyParser.urlencoded({extended:false}))

//parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname,'public')));

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

//Get Single Article
app.get('/article/:id', function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('article',{
            article:article
        });
    });
});
    

//Add Route
app.get('/articles/add',function(req,res){
    res.render('add_article',{
        tittle:'Add Article'
    })
})

//Add submit post route
app.post('/articles/add',function(req,res){
    let article=new Article();
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }else {
            res.redirect('/')
        }
    });
});

//start server
app.listen(3000,function(){
    console.log('server started on port 3000...');
});
const express =require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const expressValidator =require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');

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

//Express Session Middleware
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true
}));

//Express Message Moddleware
app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.message=require('express-messages')(req,res);
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(parm,msg,value){
        var namespace =parm.split('.')
        , root =namespace.shift()
        , formParam=root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';

        }
        return{
            param :formParam,
            msg:msg,
            value:value
        };
    }
}));

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
    req.checkBody('title','title is required').notEmpty();
    req.checkBody('author','author is required').notEmpty();
    req.checkBody('body','body is required').notEmpty();

    //Get errors
    let errors=req.validationErrors();

    if(errors){
        res.render('add_article',{
            title:'Add Article',
            errors:errors
        })
    }else{
        let article=new Article();
        article.title=req.body.title;
        article.author=req.body.author;
        article.body=req.body.body;
    
        article.save(function(err){
            if(err){
                console.log(err);
                return;
            }else {
                req.flash('success','Article Added');
                res.redirect('/')
            }
        });

    }


   
});

//Load Edit Form
app.get('/article/edit/:id', function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('edit_article',{
            title:'Edit Article',
            article:article
        });
    });
});

//Update submit post route
app.post('/articles/edit/:id',function(req,res){
    let article={};
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    let query={_id:req.params.id}

    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }else {
            req.flash('succes','article updated');
            res.redirect('/')
        }
    });
});

//Delete Article
app.delete('/article/:id',function(req,res){
    let query= {_id:req.params.id}

    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    })
})

    

//start server
app.listen(3000,function(){
    console.log('server started on port 3000...');
});
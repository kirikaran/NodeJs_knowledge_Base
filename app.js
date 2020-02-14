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

//home route//Bring in Article Article Model
let Article=require('./models/article');
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



//Route Files
let articles=require('./routes/articles');
app.use('/articles',articles);

//start server
app.listen(3000,function(){
    console.log('server started on port 3000...');
});
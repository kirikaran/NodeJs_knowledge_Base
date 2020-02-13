const express =require('express');
const path=require('path');

//init app
const app=express();

//load engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
//home route
app.get('/',function(req,res){
    let articles=[
        {
            id:1,
            title:'Articles One',
            author:'Brand SGIC',
            body:'this is article one'
        },
        {
            id:2,
            title:'Articles Two',
            author:'Brand SGIC',
            body:'this is article two'
        },
        {
            id:3,
            title:'Articles Three',
            author:'Brand SGIC',
            body:'this is article three'
        }
    ]
    res.render('index',{

        tittle:'Articles',
        articles:articles
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
}
)
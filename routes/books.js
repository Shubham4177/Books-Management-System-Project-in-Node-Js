var express = require('express');
var pool=require('./pool');
var upload=require('./multer'); 
var router = express.Router();
var LocalStorage=require('node-localstorage').LocalStorage;
localStorage=new LocalStorage('./scratch');

/* GET use to show book interface */
router.get('/bookinterface', function(req, res, next) {
  try{
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  if(admin)
  res.render('bookinterface',{status:false,message:''})
  else
  {
    res.render('logininterface2',{message:''})
  }
  }
  catch(e)
  {
    res.render('logininterface2',{message:''})
  }
})



router.get('/displayposter', function(req, res, next) {
  res.render('displayposter',{data:req.query})
})


router.post('/edit_poster',upload.single('poster'),function(req,res){


  pool.query("update  bookdetails set poster=? where bookid=?",[req.file.originalname,req.body.bookid],function(error,result){

    if(error)
    {
      res.redirect('fetch_all_books')
    }
    else
    {
      res.redirect('fetch_all_books')
    }
  })
})




// router.get('/logininterface', function(req, res, next) {
//   res.render('logininterface')
// })


router.get('/fetch_all_subjects',function(req,res){
  pool.query("select * from subjects",function(error,result){
    if(error)
    {
      res.status(500).json([])
    }
    else{
      res.status(200).json(result)
    }
  })
})


router.get('/fetch_all_title',function(req,res){
  pool.query("select * from booktitle where subjectid=?",[req.query.subjectid],function(error,result){
    if(error)
    {
      res.status(500).json([])
    }
    else{
      res.status(200).json(result)
    }
  })
})



router.post('/submit_book_details',upload.single('poster'),function(req,res){

  console.log("BODY:",req.body)
  console.log("FILE:",req.file)

  pool.query("insert into bookdetails ( subjectid, titleid, author, publisher, price, offer, status, poster)values(?,?,?,?,?,?,?,?)",[req.body.subjectid,req.body.titleid,req.body.author,req.body.publisher,req.body.price,req.body.offer,req.body.status,req.file.originalname],function(error,result){

    if(error)
    {
      res.render('bookinterface',{status:false,message:'Server Error...'})
    } 
    else
    {
      console.log(req.body.status)
      res.render('bookinterface',{status:true,message:'Record Submitted Successfully... '})
    }
  })
})


router.get('/fetch_all_books',function(req,res){
 
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(!admin)
    res.render('logininterface2',{message:''})
    else
  pool.query("select BD.*,(select BS.subjectname from subjects BS where BS.subjectid=Bd.subjectid) as subjectname , (select BT.titlename from booktitle BT where BT.titleid=BD.titleid) as title from bookdetails BD",function(error,result){
    if(error)
    {
      res.render('DisplayAllBooks',{data:[]})
    }
    else{
      console.log(result)
      res.render('DisplayAllBooks',{data:result})
    }
  })
}) 



router.get('/edit_book_data',function(req,res){
  pool.query("select BD.*,(select BS.subjectname from subjects BS where BS.subjectid=Bd.subjectid) as subjectname , (select BT.titlename from booktitle BT where BT.titleid=BD.titleid) as title from bookdetails BD where BD.bookid=?",[req.query.bookid],function(error,result){
    if(error)
    {
      res.render('displaybyid',{data:[]})
    }
    else{
      console.log(result)
      res.render('displaybyid',{data:result[0]})
    }
  })
})




router.post('/edit_book_details',function(req,res){
if(req.body.btn=="Edit")
{
  pool.query("update  bookdetails set subjectid=?, titleid=?, author=?, publisher=?, price=?, offer=?, status=?where bookid=?",[req.body.subjectid,req.body.titleid,req.body.author,req.body.publisher,req.body.price,req.body.offer,req.body.status,req.body.bookid],function(error,result){

    if(error)
    {console.log(error)
      res.redirect('/books/fetch_all_books')
    }
    else
    {
    
      res.redirect('/books/fetch_all_books')
    }
  })
}
else
{
  pool.query("delete from bookdetails where bookid=?",[req.body.bookid],function(error,result){

    if(error)
    {console.log(error)
      res.redirect('/books/fetch_all_books')
    }
    else
    {
    
      res.redirect('/books/fetch_all_books')
    }
  })
}
})



module.exports = router;

var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const pictures = fs.readdirSync(path.join(__dirname, '../pictures'));
  res.render('pictures', {pictures: pictures});
});


router.post('/', function(req, res, next) {
  console.log(req.files);
  const file = req.files.file;
  const folderDownloadPaht = '../pictures';
  const folderDownLoadPathToCreate = path.join(__dirname, '../pictures');
  
  try {
    // fs.existsSync = path came up as exists !!
    
    if(!fs.existsSync(folderDownLoadPathToCreate)){
      // console.log("file path dont exists make it!!");
      fs.mkdirSync(folderDownLoadPathToCreate);
      fs.writeFileSync(path.join(__dirname, folderDownloadPaht, file.name), file.data);
    }else{
      // console.log("file path exists write file");
      fs.writeFileSync(path.join(__dirname, folderDownloadPaht, file.name), file.data);
    }
  } catch (error) {
    console.log("error writing file: ", error);
  }
  // var check = fs.writeFileSync(path.join(__dirname, '../', file.name), file.data);
  // console.log("written check: ", check);
  res.end();
});

router.get('/:name', function(req, res,next){

  const pictureName = req.params.name;
  console.log("name: ", pictureName);

  const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
  let found;

  console.log("pictures: ", pictures );
  // console.log("found: ", pictures.filter((name) =>{
  //   return name.includes(pictureName);
  // }));

  found = pictures.filter((name) =>{
    return name.includes(pictureName);
  });
  // console.log("found: ", found);

  // index = pictures.filter((name)=>{
  //   return name.indexOf(pictureName);
  // });
  // console.log("index: ", index);

  res.render('pictures',{pictures: found });
});

module.exports = router;

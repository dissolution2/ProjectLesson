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



module.exports = router;

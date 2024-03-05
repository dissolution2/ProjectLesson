var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
var path = require('path');

const { requiresAuth } = require('express-openid-connect');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   const pictures = fs.readdirSync(path.join(__dirname, '../pictures'));
//   res.render('pictures', {pictures: pictures});
// });


/** locally saved images */
// router.post('/', function(req, res, next) {
//   console.log(req.files);
//   const file = req.files.file;
//   const folderDownloadPaht = '../pictures';
//   const folderDownLoadPathToCreate = path.join(__dirname, '../pictures');
  
//   try {
//     // fs.existsSync = path came up as exists !!
//     if(!fs.existsSync(folderDownLoadPathToCreate)){
//       // console.log("file path dont exists make it!!");
//       fs.mkdirSync(folderDownLoadPathToCreate);
//       fs.writeFileSync(path.join(__dirname, folderDownloadPaht, file.name), file.data);
//     }else{
//       // console.log("file path exists write file");
//       fs.writeFileSync(path.join(__dirname, folderDownloadPaht, file.name), file.data);
//     }
//   } catch (error) {
//     console.log("error writing file: ", error);
//   }
//   // var check = fs.writeFileSync(path.join(__dirname, '../', file.name), file.data);
//   // console.log("written check: ", check);
//   res.end();
// });

// router.get('/:name', function(req, res,next){

//   const pictureName = req.params.name;
//   console.log("name: ", pictureName);

//   const pictures = fs.readdirSync(path.join(__dirname, '../pictures/'));
//   let found;

//   console.log("pictures: ", pictures );
//   // console.log("found: ", pictures.filter((name) =>{
//   //   return name.includes(pictureName);
//   // }));

//   found = pictures.filter((name) =>{
//     return name.includes(pictureName);
//   });
//   // console.log("found: ", found);

//   // index = pictures.filter((name)=>{
//   //   return name.indexOf(pictureName);
//   // });
//   // console.log("index: ", index);
//   const index = pictures.indexOf(pictureName);
//   if(index === -1){
//     console.log("index: ", 'not found');
//   }else{
//     console.log("index: ", index);
//   }


//   res.render('pictures',{pictures: found });
// });

/** AWS database  */
router.post('/', requiresAuth, async function(req, res, next) {
  const file = req.files.file;
  console.log(req.files);
  await s3.putObject({
    Body: file.data,
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Key: "public/" + file.name
  }).promise();
  res.end();
});

router.get('/', requiresAuth, async function(req, res, next) {

  var params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Delimiter: '/',
    Prefix: 'public/'
  };

  var allObjects = await s3.listObjects(params).promise();
  var keys = allObjects?.Contents.map(x => x.Key);

  console.log("objects: ", allObjects);
  console.log("keys: ", keys);

  const pictures = await Promise.all(keys.map(async (key)=>{
    let my_file = await s3.getObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: key
    }).promise();
    return {
      src: Buffer.from(my_file.Body).toString('base64'),
      name: key.split("/").pop()
    }
  }))
  
  res.render('pictures', {pictures: pictures});
});


// router.get('/:name', async function(req, res, next) {

//   var params = {
//     Bucket: process.env.CYCLIC_BUCKET_NAME,
//     Delimiter: '/',
//     Prefix: 'public/'
//   };

//   var allObjects = await s3.listObjects(params).promise();
//   var keys = allObjects?.Contents.map(x => x.Key);

//   const pictures = await Promise.all(keys.map(async (key)=>{
//     let my_file = await s3.getObject({
//       Bucket: process.env.CYCLIC_BUCKET_NAME,
//       Key: key
//     }).promise();
//     return {
//       src: Buffer.from(my_file.Body).toString('base64'),
//       name: key.split("/").pop()
//     }
//   }))
  


//   res.render('pictures', {pictures: pictures});
// });

module.exports = router;

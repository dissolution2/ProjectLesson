var express = require('express');
var router = express.Router();
const AWS = require("aws-sdk");
// const s3 = new AWS.S3();
// const fs = require('fs');
// var path = require('path');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   const pictures = fs.readdirSync(path.join(__dirname, '../pictures/')).slice(0,3);
//   res.render('index', { pictures: pictures, title: 'Express' });
// });

// const s3 = new AWS.S3({
//   accessKeyId: "+ASIAZA75AAFWYIGJZ6FH",
//   secretAccessKey: "+G1dXZuHfR6n25jpHGAWC696a/8fF/PBXwiJc3zc",
//   sessionToken:"IQoJb3JpZ2luX2VjEH0aCXVzLWVhc3QtMiJGMEQCIHJmSDSLhgNQ4VEDAQi/mPETFJcHaCwl3fMoESfQ4DebAiA/+XOdE98DkqJtPszTx4PRuQAIaSGZF9S51oMyV8scQSqrAgh2EAAaDDYyMDYxNjQ4MzE4MSIMGh/LXQhsAxoHg+PzKogCooSncllSgD3NJnYq49v44jJjveY3VDc2rcMvZZuLYh2nCR4OxSv3Ccg/yV0AZ9Nqe3g//qDpT1bsbE7xRb2ORsYIFZWaN+uDYGW8RIrhxuxD+FyxoZHQLXqc5dgp2Crzv8pBBa03gwvquUz7Br+/FkamZGV0lAXpR0usE6qLScwRzsVsD8LrTM903+cGcgZg639CIgXzdP5rQqU+03sRbBUmr9umeNmVGmG9lgqiirLnNwm0OBAkd+Ycy7ngZkwhb/RKGlVX9ctDfkzidNzfpnSgiKJaRTIYCSORv2MQcBITNopCkKUOMEUQ0r2+U3blzm66i0NVZ1CAHKRJFG8vM8KmjWmXfDlFMMGFl68GOp4BQikmU/ezjHfqls5TbS9ZZuXPwV76daMCSFIKkn7lYzUr9+NQtqzGXagyeCrP1WaXoNAIQUZz9m/lLfTv6sixfgplrzeZT4yjmKZEnW3Pnhs3I2jMNfqpHLgIQ5um8TPOKmHUaJcg9KkryrIgluoNmZSEUAafGIxqSQw07mSWjdw65pKteBVJGMBOsuU3VzE4gN5cM8yJIVeVIY5xX4M="
// });

// const credentials = new AWS.Credentials({
//   accessKeyId: '+ASIAZA75AAFWYIGJZ6FH',
//   secretAccessKey: '+G1dXZuHfR6n25jpHGAWC696a/8fF/PBXwiJc3zc',
// });

// // Set AWS region
// AWS.config.update({ region: 'eu-central-1', credentials: credentials });
const s3 = new AWS.S3();

router.get('/', async function(req, res, next) {
  // const userInfo = req.oidc;
  // console.log("userInfo: ", userInfo);

  var params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Delimiter: '/',
    Prefix: 'public/'
  };
  
  var allObjects = await s3.listObjects(params).promise();
  var keys = allObjects?.Contents.map( x=> x.Key).slice(0,3);
  
  const pictures = await Promise.all(keys.map(async (key) => {
    let my_file = await s3.getObject({
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: key,
    }).promise();
    return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split("/").pop()
    }
  }))
  res.render('index', { 
    pictures: pictures, 
    title: 'Express',
    isAuthenticated: req.oidc.isAuthenticated()
   });
});

router.get('/logout', async function(req, res, next) {
  // const userInfo = req.oidc;
  // console.log("userInfo: ", userInfo);


  res.render('index', { 
    title: 'Express'
   });
});

module.exports = router;

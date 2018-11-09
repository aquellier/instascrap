'use strict';

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');

const visualRecognition = new VisualRecognitionV3({
  iam_apikey: '05ddXf06q1Ra78pEwNdO2bScxE_PPEplNQOIln2KI8N0',
  version: '2018-06-11'
});

const params = {
  // An image file (.jpg, .png) or .zip file with images
  // images_file: fs.createReadStream('./screenshots/car.png')
  images_file: fs.createReadStream('screenshots/man_35.png')
};

visualRecognition.detectFaces(params, function(err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(res, null, 2));
  }
});

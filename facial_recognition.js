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

function person(ageMin, ageMax, ageProbability, gender, genderProbability){
  this.ageMin = ageMin;
  this.ageMax = ageMax;
  this.ageProbability = ageProbability;
  this.gender = gender;
  this.genderProbability = genderProbability;
}

visualRecognition.detectFaces(params, function(err, res) {
  if (err) {
    console.log(err);
  } else {
    const faceInfos = res.images[0].faces[0]
    const ageMin = faceInfos.age.min
    const ageMax = faceInfos.age.max
    const ageProbability = faceInfos.age.score
    const gender = faceInfos.gender.gender
    const genderProbability = faceInfos.gender.score
    const userInfos = new person(ageMin, ageMax, ageProbability, gender, genderProbability);

    console.log(userInfos);
  }
});

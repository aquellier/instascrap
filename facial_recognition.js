const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const CREDS = require('./creds');
const fs = require('fs');

const visualRecognition = new VisualRecognitionV3({
  iam_apikey: CREDS.apikey,
  version: '2018-06-11'
});

const params = { images_file: fs.createReadStream('screenshots/man_35.png') };

function user(ageMin, ageMax, ageProbability, gender, genderProbability){
  this.ageMin = ageMin;
  this.ageMax = ageMax;
  this.ageProbability = ageProbability;
  this.gender = gender;
  this.genderProbability = genderProbability;
}


visualRecognition.detectFaces(params, function(err, res) {
  if (err) {
    console.log("There is an error");
  } else {
    const faceInfos = res.images[0].faces[0]
    const ageMin = faceInfos.age.min
    const ageMax = faceInfos.age.max
    const ageProbability = faceInfos.age.score
    const gender = faceInfos.gender.gender
    const genderProbability = faceInfos.gender.score
    var userInfos = new user(ageMin, ageMax, ageProbability, gender, genderProbability);
    console.log(userInfos);
    return userInfos;
  }
});


// console.log(userInfos);

const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const CREDS = require('./creds');
const fs = require('fs');
const usersPictures = ['screenshots/man_35.jpg', 'screenshots/man_50.jpg', 'screenshots/woman_30.jpg', 'screenshots/woman_65.jpg'];


let users = [];
function addUserInfos(picture) {
  const visualRecognition = new VisualRecognitionV3({
    iam_apikey: CREDS.apikey,
    version: '2018-06-11'
  });

  const params = { images_file: fs.createReadStream(picture) };

  function user(id, ageMin, ageMax, ageProbability, gender, genderProbability){
    this.id = id;
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
      const id = users.length;
      const faceInfos = res.images[0].faces[0];
      const ageMin = faceInfos.age.min;
      const ageMax = faceInfos.age.max;
      const ageProbability = faceInfos.age.score;
      const gender = faceInfos.gender.gender;
      const genderProbability = faceInfos.gender.score;
      const userInfos = new user(id, ageMin, ageMax, ageProbability, gender, genderProbability);
      // console.log(userInfos);
      users.push(userInfos);
    }
  });
}
// usersPictures.forEach((picture) => {
//   addUserInfos(picture);
// });

// setTimeout(() => {
//   console.log(users);
// }, 3000);

const puppeteer = require('puppeteer');
const fs = require('fs');
const CREDS = require('./creds');

// Dom Elements
const loginPage = 'https://www.instagram.com/accounts/login/';
const usernameInput = 'input[name="username"]';
const passwordInput = 'input[name="password"]';
const submitButton = 'button[type="submit"]';
// const searchBar = 'input[type="text"]';
const userToSearch = 'nicolekidman';
const searchUser = `https://www.instagram.com/${userToSearch}`;
// Cannot search followers directly with URL, I get redirected on user's profile
// const searchFollowers = `https://www.instagram.com/${userToSearch}/followers`;
const followersWindow = `a[href='/${userToSearch}/followers/']`;
const firstFollower = 'a[class="FPmhX notranslate _0imsa "]';

// GetPictures on a followerpage
// const getPictures = () => {
//   let pictures = [];
//   let elements = document.getElementsByClassName("_9AhH0");
//   for (let element of elements)
//       pictures.push(element);
//   return pictures;
// }


(async() => {
  // headless false for visual debugging in browser
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(loginPage, {waitUntil: 'networkidle2'});
  // Type username
  await page.click(usernameInput);
  await page.keyboard.type(CREDS.username);

  // Type password, submit and wait 3 sec
  await page.click(passwordInput);
  await page.keyboard.type(CREDS.password);
  await page.click(submitButton);
  await page.waitFor(3000);

  // Search User with URL
  await page.goto(searchUser);
  await page.click(followersWindow);
  await page.waitFor(3000);

  // Pb: each time you launch the programm, the list changes and you get a different
  // list of followers
  // Edit: Tricky, the same popup renders a list of followers for the profile
  // searched (12 profiles) and also suggestions of people to follow (10 profiles)
  let followersList = await page.evaluate(() => {
    let followers = [];
    let elements = document.getElementsByClassName('FPmhX notranslate _0imsa ');
    for (let element of elements)
        followers.push(element.textContent);
      // Take the actual followers and not the suggestions
      // followers.length = 12;
    return followers;
  });

  // Print followersList and save in a file
  console.log(followersList);
  fs.writeFileSync('./textfiles/followersList.txt', followersList.join('\n') + '\n');

  // await browser.close();
})();

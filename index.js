const puppeteer = require('puppeteer');
const CREDS = require('./creds');

// Dom Elements
const loginPage = 'https://www.instagram.com/accounts/login/';
const usernameInput = 'input[name="username"]';
const passwordInput = 'input[name="password"]';
const submitButton = 'button[type="submit"]';
// const searchBar = 'input[type="text"]';
const userToSearch = 'nicolekidman';
const searchUser = `https://www.instagram.com/${userToSearch}`;
// Cannot search followers directly, I get redirected on user's profile
// const searchFollowers = `https://www.instagram.com/${userToSearch}/followers`;
const followers = `a[href='/${userToSearch}/followers/']`;

const firstFollower = 'a[class="FPmhX notranslate _0imsa "]';


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
  // Type password and submit
  await page.click(passwordInput);
  await page.keyboard.type(CREDS.password);
  await page.click(submitButton);
  await page.waitFor(3000);
  // Search User with URL
  await page.goto(searchUser);
  await page.click(followers);
  await page.waitFor(3000);
  await page.screenshot({ path: 'screenshots/insta.png' });
  const followersLength = await page.$$('.FPmhX notranslate _0imsa ');
  console.log(followersLength);

  // Pb: each time you launch the programm, the list changes and you get a different
  let firstFollowers = await page.evaluate(() => {
    let data = [];
    let elements = document.getElementsByClassName('FPmhX notranslate _0imsa ');
    for (var element of elements)
        data.push(element.textContent);
    return data;
  });
  console.log(firstFollowers);

  // Go to first follower profile
  await page.click(firstFollower);
  // await browser.close();
})();

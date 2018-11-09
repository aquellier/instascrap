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



(async() => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  // headless false for visual debugging in browser
  page.setViewport({width: 1000, height: 600, deviceScaleFactor: 2});
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
  await page.click(followersWindow, {waitUntil: 'networkidle2'});
  await page.waitFor(3000);
  // Go to first Follower
  await page.click(firstFollower, {waitUntil: 'networkidle2'});
  await page.waitFor(5000);
  // The following function works fine on homepage with DOM elements but not
  // when I try to use it on a user's profile picture, maybe because react is the root component?

  // async function screenshotDOMElement(selector, padding = 0) {
  //   const rect = await page.evaluate(selector => {
  //     const element = document.querySelector(selector);
  //     const {x, y, width, height} = element.getBoundingClientRect();
  //     return {left: x, top: y, width, height, id: element.id};
  //   }, selector);

  //   return await page.screenshot({
  //     path: 'element.png',
  //     clip: {
  //       x: rect.left - padding,
  //       y: rect.top - padding,
  //       width: rect.width + padding * 2,
  //       height: rect.height + padding * 2
  //     }
  //   });
  // }
  // await screenshotDOMElement('#react-root > section > main > div > header > div > div > div', 16);

  // Dirty way, clip hardcoded to screenshot profile picture
  await page.screenshot({
    path: 'screenshots/profilepicture.png',
    clip: {x: 100, y: 130, width: 160, height: 160}
  });
})();


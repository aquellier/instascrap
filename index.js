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



(async() => {
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
  await page.waitFor(3000)
  // Search User with URL
  await page.goto(searchUser);
  await page.click(followers);
  await page.waitFor(3000)
  await page.screenshot({ path: 'screenshots/insta.png' });
  // await browser.close();
})();

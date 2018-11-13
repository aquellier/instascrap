const puppeteer = require('puppeteer');
const fs = require('fs');
const CREDS = require('./creds');

// Dom Elements
const loginPage = 'https://www.instagram.com/accounts/login/';
const usernameInput = 'input[name="username"]';
const passwordInput = 'input[name="password"]';
const submitButton = 'button[type="submit"]';

const text = fs.readFileSync('./textfiles/followersList.txt', "utf-8");
const usersToSearch = text.split("\n");

async function saveFollowersInfos(follower) {
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
  await page.goto(`https://www.instagram.com/${follower}`);

  console.log(follower);
  // Dirty way, clip hardcoded to screenshot profile picture
};

usersToSearch.forEach((user) => {
  saveFollowersInfos(user);
});

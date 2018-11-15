import { addUserInfos } from './facial_recognition';

const puppeteer = require('puppeteer');
const fs = require('fs');
const CREDS = require('./creds');
// Dom Elements
const loginPage = 'https://www.instagram.com/accounts/login/';
const usernameInput = 'input[name="username"]';
const passwordInput = 'input[name="password"]';
const submitButton = 'button[type="submit"]';
const users = ["venturafloriana", "himmisharma66"];


async function scrapeInfiniteScrollItems(
  page,
  extractFollowers,
  followersTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  // Next line returns undefined
  let x;
  try {
    while (items.length < followersTargetCount) {
      items = await page.evaluate(extractFollowers);
      childToSelect = items.length;
      await page.hover(`div.isgrP > ul > div > li:nth-child(${childToSelect})`);
    }
  } catch(e) { }
  return items;
}

async function screenShotProfile(username, number) {
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
  await page.goto(`https://www.instagram.com/${username}`);
  await page.screenshot({
    path: `./screenshots/profile${number}.png`,
    clip: {x: 100, y: 130, width: 160, height: 160}
  });
  await browser.close();
}

users.forEach((user, index) => {
  screenShotProfile(user, index);
  addUserInfos(`./screenshots/profile${index}.png`);
});





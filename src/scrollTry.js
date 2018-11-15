const puppeteer = require('puppeteer');
const CREDS = require('./creds');

// Dom Elements
const loginPage = 'https://www.instagram.com/accounts/login/';
const usernameInput = 'input[name="username"]';
const passwordInput = 'input[name="password"]';
const submitButton = 'button[type="submit"]';
const userToSearch = 'nicolekidman';
const searchUser = `https://www.instagram.com/${userToSearch}`;
const followers = `a[href='/${userToSearch}/followers/']`;
const firstFollower = 'a[class="FPmhX notranslate _0imsa "]';
const closeButton = 'button[class="ckWGn"]';

// Extract followers from a user profile
const extractFollowers = () => {
  let followers = [];
  let elements = document.getElementsByClassName('FPmhX notranslate _0imsa ');
  for (let element of elements)
      followers.push(element.textContent);
    // Take the actual followers and not the suggestions
    // followers.length = 12;
  return followers;
}

// Scrolling Function
async function scrapeInfiniteScrollItems(
  page,
  extractFollowers,
  followersTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  // Next line returns undefined
  const scrollBox = await page.$eval('div.isgrP > ul > div.PZuss', (uiElement) => {
    return uiElement;
  });
  console.log(scrollBox);
  // Next line returns an ElementHandle
  const scrollBox2 = await page.$('.PZuss');
  console.log(scrollBox2);

  let scrollBoxHeight = await page.$eval('.PZuss', el => el.scrollHeight);
  console.log(scrollBoxHeight);
  try {
    while (items.length < followersTargetCount) {
      items = await page.evaluate(extractFollowers);
      console.log(extractFollowers());
      // await page.evaluate('scrollBox.scrollTo(0, scrollable_popup.scrollHeight)');
      // await page.waitForFunction(`scrollBox.scrollHeight > ${previousHeight}`);
      // await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}



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
  await page.waitFor(2000);

  // Search User with URL
  await page.goto(searchUser);
  await page.click(followers);
  await page.waitFor(2000);
  // console.log(context.page);

  const findFollowers = await scrapeInfiniteScrollItems(page, extractFollowers, 100);
  console.log(findFollowers);
  await page.screenshot({ path: '../screenshots/insta.png' });


})();


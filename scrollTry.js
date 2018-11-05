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
// Cannot search followers directly with URL, I get redirected on user's profile
// const searchFollowers = `https://www.instagram.com/${userToSearch}/followers`;
const followers = `a[href='/${userToSearch}/followers/']`;
const firstFollower = 'a[class="FPmhX notranslate _0imsa "]';
const closeButton = 'button[class="ckWGn"]';
// const firstPicture = 'div[class="_9AhH0"]';

// Extract followers from a user profile
// Edit: Tricky, the same popup renders a list of followers for the profile
// searched (12 profiles) and also suggestions of people to follow (10 profiles)
const extractFollowers = () => {
  let followers = [];
  let elements = document.getElementsByClassName('FPmhX notranslate _0imsa ');
  for (let element of elements)
      followers.push(element.textContent);
    // Take the actual followers and not the suggestions
    // followers.length = 12
  return followers;
}

// GetPictures on a followerpage
// const getPictures = () => {
//   let pictures = [];
//   let elements = document.getElementsByClassName("_9AhH0");
//   for (let element of elements)
//       pictures.push(element);
//   return pictures;
// }

// Scrolling Function
async function scrapeInfiniteScrollItems(
  page,
  extractFollowers,
  followersTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  // const scrollBox = await page.evaluate(() => document.querySelector('.PZuss'));
  // Returns undefined
  let scrollBoxHeight;
    while (items.length < followersTargetCount) {
      items = await page.evaluate(extractFollowers);
      // The following line gives me the original size of the popup scroll Window
      scrollBoxHeight = await (await (await page.$('.PZuss')).getProperty('scrollHeight')).jsonValue();
      console.log(items);
      console.log(scrollBox);
      // Still not able to grab the scrollBox itself
      // await page.evaluate('scrollBox.scrollTo(0, scrollBox.scrollHeight)');
      // await page.waitForFunction(`scrollBoxHeight > ${previousHeight}`);
      // await page.waitFor(scrollDelay);
    }
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

  // Pb: each time you launch the programm, the list changes and you get a different
  // list of followers
  const findFollowers = await scrapeInfiniteScrollItems(page, extractFollowers, 100);
  console.log(findFollowers);
  await page.screenshot({ path: 'screenshots/insta.png' });

  // Go to first follower profile
  // await page.click(firstFollower);
  // pictures = await page.evaluate(getPictures);

  // await page.click(closeButton);
  // await browser.close();
})();


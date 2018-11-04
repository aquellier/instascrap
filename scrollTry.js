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

// Function extractFollower
function extractFollowers() {
  const extractedFollowers = document.querySelectorAll('.FPmhX notranslate _0imsa ');
  const followers = [];
  for (let element of extractedElements) {
    followers.push(element.textContent);
  }
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
  const scrollable_popup = '.PZuss';
  console.log('Hello Debug1');
  try {
    let previousHeight;
    while (items.length < followersTargetCount) {
      items = await page.evaluate(extractFollowers);
      // Not showing in the browser from, the code is breaking at this point
      console.log('Hello2');
      previousHeight = await page.evaluate('scrollable_popup.scrollHeight');
      await page.evaluate('window.scrollTo(0, scrollable_popup.scrollHeight)');
      await page.waitForFunction(`scrollable_popup.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
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
  await page.waitFor(3000);

  // Search User with URL
  await page.goto(searchUser);
  await page.click(followers);
  await page.waitFor(3000);
  await page.screenshot({ path: 'screenshots/insta.png' });

  // Pb: each time you launch the programm, the list changes and you get a different
  // list of followers
  // Edit: Really tricky, the same popup renders a list of followers for the profile
  // searched (12 profiles) and also suggestions of people to follow (10 profiles)
  const findFollowers = await scrapeInfiniteScrollItems(page, extractFollowers, 100);
  console.log(findFollowers);

  // Go to first follower profile
  // await page.click(firstFollower);
  // await browser.close();
})();

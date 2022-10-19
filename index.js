/* scripts from our own package */
import openTwitterWithScraper from "./src/openTwitterWithScraper.js";
import collectTweets from './src/collectTweets.js';
import saveTweets from './src/saveTweets.js';

/* runtime */
(async () => {
  const SEARCH_TERM = "in our dna";
  const SEARCH_START_DATE = "2021-01-01";
  const SEARCH_END_DATE = "2022-10-01"; //format: YYYY-MM-DD

  // step 1: launch puppeteer browser
  const page = await openTwitterWithScraper(
    SEARCH_TERM, SEARCH_START_DATE, SEARCH_END_DATE
  );

  // step 2: scrape and parse the tweets that turn up as search results
  const collectedTweets = await collectTweets(page, {
    tweetLimit: 30,
    // timeLimit: 600000 // 10mins (in milliseconds)
    // what other options can we think about for this function?
  });

  // step 3: save the tweets into a local .json file i'
  saveTweets(collectedTweets);

})();

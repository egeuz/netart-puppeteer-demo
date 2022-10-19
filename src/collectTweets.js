// step 2: scrape tweets and parse them into data points in JSON format 
async function collectTweets(page, opts) {
  let collectedTweets = []; // an empty array to store our tweets
  let isLooping = true;

  //scraping loop
  do {
    // wait a little bit before each scrape action to wait for new data to load
    await page.waitForTimeout(4000); //4 seconds, in milliseconds

    // the $$eval function selects elements from the HTML of the open webpage
    // all the scraping happens in this line
    const newTweets = await page.$$eval('article', parseTweets);

    // add newly collected tweets to the final array
    collectedTweets.push(...newTweets);
    collectedTweets = filterUniqueTweets(collectedTweets);

    // check if we're still looping
    isLooping = checkLoopCondition(collectedTweets, opts);

    // finally, scroll down in the page to load new tweets
    await page.mouse.wheel({ deltaY: 1350 });

  } while (isLooping); //continue looping as long as this is true
  //once looping is done, return the final tweet array as output
  return collectedTweets;
}

// step 2.1 parse HTML tweet data into a JS object format
function parseTweets(HTMLTweets) {
  /* 
    all the parsing happens in this function

    we'll use the array.map() function to loop through
    each tweet HTML element that we selected with the $$eval function,
    and parse information out of it, converting it into a JS object
    with distinct data points at the end.

    The resulting variable, JSONTweets becomes an array
    of JS objects, each containing data about a single tweet

    since we're handling HTML elements, we have all our usual DOM API
    tools at our disposal (but only inside of this function!) like
    querySelector, getAttribute, innerText, etc.

    learn more about .map() here:
    (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  */
  const JSONTweets = HTMLTweets.map(function (HTMLTweet) {
    // get tweet author's username and twitter handle
    const [author_username, author_handle] = Array.from(
      HTMLTweet.querySelectorAll('div[data-testid="User-Names"] a')
    ).map(usernameHTML => usernameHTML.innerText);
    // get publish date of the tweet
    const tweet_pubdate = HTMLTweet
      .querySelector("time")
      .getAttribute('datetime');
    // get actual tweet text
    const tweet_text = HTMLTweet.querySelector('div[data-testid="tweetText"').innerText;
    // if there are images, get urls to the images
    const tweet_images = Array.from(HTMLTweet.querySelectorAll('img')).map(img => img.src);
    // get reply/retweet/like metadata
    const num_replies = HTMLTweet.querySelector('div[data-testid="reply"]').innerText;
    const num_retweets = HTMLTweet.querySelector('div[data-testid="retweet"]').innerText;
    const num_likes = HTMLTweet.querySelector('div[data-testid="like"]').innerText;
    // assemble all the datapoints in a JS object
    const JSONTweet = {
      author_username,
      author_handle,
      pubdate: tweet_pubdate,
      text: tweet_text,
      images: tweet_images,
      num_replies,
      num_retweets,
      num_likes
    }
    return JSONTweet;
  });
  return JSONTweets;
}

function filterUniqueTweets(tweets) {
  // function adapted from: https://stackoverflow.com/questions/43245563/filter-array-to-unique-objects-by-object-property
  return tweets.filter((tweet, index, self) => {
    const originalTweetIndex = self.findIndex(tw => tw.text === tweet.text);
    return index === originalTweetIndex;
  })
}

function checkLoopCondition(tweets, opts) {
  //if this function returns false, we stop looping
  if (opts.tweetLimit) {
    // stop scraping when we hit the tweetLimit we set
    return tweets.length < opts.tweetLimit;
  } // you can add additional measures to stop looping as else if statements
  else {
    return true; // if no stop conditions are met, just keep looping
  }
}

export default collectTweets;
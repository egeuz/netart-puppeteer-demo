import fs from 'fs'; //lets you read/write files

function saveTweets(tweets) {
  const filename = "./dna_tweets.json";
  fs.writeFileSync(filename, JSON.stringify(tweets));
  console.log(`saved ${tweets.length} tweets to ${filename}`);
}

export default saveTweets;
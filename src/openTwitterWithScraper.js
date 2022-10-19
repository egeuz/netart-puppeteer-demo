import puppeteer from 'puppeteer';



export default async function openTwitterWithScraper(searchTerm, startDate, endDate) {
  // this is a query url that twitter uses 
  // for its onsite advanced search function
  const url = `https://twitter.com/search?q=${searchTerm}%20until%3A${endDate}since%3A${startDate}&src=typed_query&f=live`
  // const url = `https://twitter.com/search?f=live&q=${searchTerm} until%3A${endDate} since%3A${startDate}&srcDate=typed_query&f=live`;
  // now we initialize a browser run by puppeteer
  const browser = await puppeteer.launch({
    // launch options
    headless: false, //so we can see the scraping in action
    defaultViewport: {width: 1440, height: 900} //force desktop CSS
  });
  const page = await browser.newPage(); //create new tab
  // send the puppeteer browser to our twitter search url
  await page.goto(url, { waitUntil: 'networkidle0' });
  // now we return the puppeteer page object
  // so it can be used in our other functions
  return page;
}
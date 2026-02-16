import puppeteer from "puppeteer";
import fs from "fs/promises";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  
async function scrapeTariffPrograms() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  console.log("Opening tariff programs page...");
  await page.goto("https://dataweb.usitc.gov/tariff/programs", {
    waitUntil: "networkidle2"
  });

  console.log("Waiting for table rows...");
  await page.waitForSelector("tr.hover-row");

  const rowCount = await page.$$eval("tr.hover-row", rows => rows.length);
console.log("Programs found:", rowCount);

const results = {};

for (let i = 0; i < rowCount; i++) {
  console.log(`Scraping program ${i + 1}/${rowCount}`);

  // click row INSIDE browser context (no detached nodes)
  const code = await page.evaluate((index) => {
    const rows = document.querySelectorAll("tr.hover-row");
    const row = rows[index];
    if (!row) return null;

    const code = row.querySelector("th").innerText.trim();
    row.click();
    return code;
  }, i);

  if (!code) continue;

  // wait until countries table appears
  let countries = [];

  // check if countries table exists
  const tableExists = await page.$(".usa-table tbody tr td");
  
  if (tableExists) {
    // multi-country program
    countries = await page.$$eval(
      ".usa-table tbody tr td",
      cells => cells.map(c => c.innerText.trim())
    );
  } else {
    // single-country program → read "Group Name"
    const groupName = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll(".grid-col-6 p"));
      const groupLabelIndex = labels.findIndex(el => el.innerText.includes("Group Name"));
      if (groupLabelIndex === -1) return null;
  
      const value = labels[groupLabelIndex + 1];
      return value ? value.innerText.trim() : null;
    });
  
    if (groupName) countries = [groupName];
  }
  

  results[code] = countries;

  await sleep(800);
}

  await browser.close();

  await fs.writeFile(
    "data/tariffPrograms.json",
    JSON.stringify(results, null, 2)
  );

  console.log("✅ DONE!");
  console.log("Programs scraped:", Object.keys(results).length);
}

scrapeTariffPrograms();

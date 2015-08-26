var config = {
  url: {
    login: 'https://twitter.com/login',
    yourFollower: 'https://analytics.twitter.com/accounts/8da3rj/audience_insights?audience_types=followers%2C&audience_interactions=%2C&audience_ids=*%2C&custom_types=%2C&targeting_criteria=[object+Object]%2C[object+Object]&attribute_group=overview',
    organicAudience: 'https://analytics.twitter.com/accounts/8da3rj/audience_insights?audience_types=organic%2C&audience_interactions=impression%2C&audience_ids=506035855%2C&custom_types=%2C&targeting_criteria=%5Bobject+Object%5D%2C%5Bobject+Object%5D',
    home: 'https://analytics.twitter.com/user/DNVGL_Energy/home',
  },
  credentials: {
    username: 'surferstat1',
    password: 'soumen1001'
  },
  page: {
    yourFollower: './xlsx/yourFollower.xlsx',
    organicAudience: './xlsx/organicAudience.xlsx',
    home: './xlsx/home.xlsx',
  },
  body: {
    yourFollower: null,
    organicAudience: null,
    home: null,
  }
};
var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var fs = require('fs');

var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

var scrapper = require('./scrapping');

driver.get(config.url.login)
  .then(function() {
    return driver.findElement(By.xpath('//*[@id="page-container"]/div/div[1]/form/fieldset/div[1]/input'));
  })
  .then(function(username) {
    return username.sendKeys(config.credentials.username);
  })
  .then(function() {
    return driver.findElement(By.xpath('//*[@id="page-container"]/div/div[1]/form/fieldset/div[2]/input'));
  })
  .then(function(password) {
    return password.sendKeys(config.credentials.password);
  })
  .then(function() {
    return driver.findElement(By.xpath('//*[@id="page-container"]/div/div[1]/form/div[2]/button'));
  })
  .then(function(btn) {
    return btn.click();
  })
  .then(function() {
    return driver.get(config.url.yourFollower);
  })
  .then(function() {
    driver.wait(until.elementLocated(By.className("panel-group"), 10));
  })
  .then(function() {
    return driver.findElement(By.xpath('//html'));
  })
  .then(function(body) {
    return body.getInnerHtml();
  })
  .then(function(content) {
    scrapper.audienceAnalytics(content, config.page.yourFollower);
    return;
  })
  .then(function() {
    return driver.get(config.url.organicAudience);
  })
  .then(function() {
    driver.wait(until.elementLocated(By.className("panel-group"), 10));
  })
  .then(function() {
    return driver.findElement(By.xpath('//html'));
  })
  .then(function(body) {
    return body.getInnerHtml();
  })
  .then(function(content) {
    scrapper.audienceAnalytics(content, config.page.organicAudience);
    return;
  })
  .then(function() {
    return driver.get(config.url.home);
  })
  .then(function() {
    driver.wait(until.elementLocated(By.className("tweet-details"), 10));
  })
  .then(function() {
    return driver.findElement(By.xpath('//html'));
  })
  .then(function(body) {
    return body.getInnerHtml();
  })
  .then(function(content) {
    fs.writeFileSync('a.html', content);
    scrapper.audienceAnalytics(content, config.page.home);
    return;
  })
  .then(function() {
    return driver.quit();
  });


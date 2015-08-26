var cheerio = require("cheerio");
var jsonXlsx = require("icg-json-to-xlsx");

/**
 ** body- The HTML content
 ** filename- Name of the output Excel file
 **/
exports.audienceAnalytics = function(body, filename) {
  var $ = cheerio.load(body),
    fieldsObject = [];
  $(".panel-group").each(function(panelindex, panel) {
    var className = $(this).attr('class');
    var tabNameArr = className.split(" ");
    tabNameArr.splice(tabNameArr.indexOf("panel-group"), 1);
    var tabName = tabNameArr[0];
    if (tabName !== "overview") {

      $(this).find(".top-n-panel").each(function(i, element) {
        var fieldName = $(this).find(".panel-name").text();
        $(this).find(".top-n-panel-row").each(function(index, row) {
          var key = $(this).find(".main-name").text(),
            value = $(this).find(".statistic-number").text();
          fieldsObject.push({
            "Tabs": tabName,
            "Fields": fieldName,
            "Categories": key,
            "Percentage": value
          });
        });
      });

      $(".vertical-bar-panel").each(function(i, element) {
        var fieldName = $(this).find(".panel-name").text();
        $(this).find(".vertical-bar-label").each(function(index, row) {
          var key = $(this).find(".vertical-bar-main-label").text(),
            value = $(this).find(".vertical-bar-number-label").text();
          fieldsObject.push({
            "Tabs": tabName,
            "Fields": fieldName,
            "Categories": key,
            "Percentage": value
          });
        });
      });
    }
  });

  jsonXlsx.writeFile(filename, fieldsObject, {
    sheetName: "Followers"
  });

};


exports.homeAnalytics = function(body, filename) {
  var $ = cheerio.load(body),
    monthlyAnalytics = [];

  $(".home-page").each(function(arrIndex, monthlyData) {
    var startDate = new Date($(this).data("start")),
      month = startDate.getMonth() + 1 + "/" + startDate.getFullYear(),
      tweets = $(this).find(".metric-tweets").text(),
      impressions = $(this).find(".metric-tweetviews").text(),
      visits = $(this).find(".metric-profile-views").text(),
      mentions = $(this).find(".metric-mentions").text(),
      newFollowers = $(this).find(".metric-followers").text(),
      topTweet, tweetImpressions, topMention, engagement, topFollower, followedBy;

    $(this).find(".home-panel-wrap").each(function(i, panel) {
      if ($(this).data("type") === "top_tweet") {
        topTweet = $(this).find(".tweet-text").text();
        tweetImpressions = $(this).find(".home-panel-title").find("small").text().split(" ")[9];
      }
      if ($(this).data("type") === "top_mention") {
        topMention = $(this).find(".tweet-screen-name").text();
        engagement = $(this).find(".home-panel-title").find("small").text().split(" ")[9];
      }
      if ($(this).data("type") === "top_follower") {
        topFollower = $(this).find(".profile-card-screenname").find("a").text();
        followedBy = $(this).find(".home-panel-title").find("small").text().split(" ")[10];
      }
    });
    monthlyAnalytics.push({
      "Month": month,
      "Tweets": tweets,
      "Tweet impressions": impressions,
      "Profile visits": visits,
      "Mentions": mentions,
      "New followers": newFollowers,
      "Top Tweet": topTweet,
      "Top Tweet Impressions": tweetImpressions,
      "Top Mention by": topMention,
      "Top Mention Engagements": engagement,
      "Top Follower": topFollower,
      "Top Follower followed by": followedBy
    });
  });


  jsonXlsx.writeFile(filename, monthlyAnalytics, {
    sheetName: "Home"
  });

};

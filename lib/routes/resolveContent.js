"use strict";

const logger = require("../logger");
const { getDeployedVersion } = require("./resolveContentHelpers");
const feedUrls = require("../feedUrls");
const helper = require("../helper");
const { parse } = require("rss-to-json");
const striptags = require("striptags");
const { decode } = require("html-entities");

module.exports = {
  resolveContent,
  renderViewModel
};

async function getTypeSpecificViewData(req, content) {

  if (content) {
    console.log("getTypeSpecificViewData", req.path);
    if (req.path === "/grid") {
      return {
        template: "gridview",
        headers: {
          "cache-control": "no-store",
          "Edge-control": "max-age=180"
        }
      };
    } else if (req.path === "/") {
      return {
        template: "scrollview",
        headers: {
          "cache-control": "no-store",
          "Edge-control": "max-age=180"
        }
      };
    } else if (req.path === "/feed") {
      return {
        template: "mediumview",
        headers: {
          "cache-control": "no-store",
          "Edge-control": "max-age=180"
        }
      };
    }

  } else {
    return {
      template: "404",
      headers: {
        "cache-control": "no-store",
        "Edge-control": "max-age=180"
      }
    };
  }
}

async function buildViewModel(req, res, content) {
  if (!content) {
    res.status(404);

    return {
      template: "404",
      meta: {
        version: getDeployedVersion()
      },
      headers: {
        "cache-control": "no-store",
        "Edge-control": "max-age=120"
      }
    };
  }

  const [viewData] = await Promise.all([
    getTypeSpecificViewData(req, content)
  ]);

  return {
    content,
    ...viewData
  };
}

async function renderViewModel(content, req, res, next) {
  let viewModel;
  try {
    viewModel = await buildViewModel(req, res, content);
  } catch (error) {
    logger.error(`Failure to build view model for content: ${content}`, error);
    return next(error);
  }
  // res.set(viewModel.headers);
  try {
    res.render(viewModel.template, viewModel, (err, html) => {
      if (err) return next(err);
      res.send(html);
    });
  } catch (error) {
    logger.error(`res.render failed for content: ${content}\nViewmodel ${viewModel}`, error);
    return next(error);
  }
}

function decodeHtmlEntities(text) {
  const decodedString = decode(text);
  return decodedString;
}

// Input list of feeds with articles. Output list of articles with feedinfo per article.
function mapToArticlesArrayWithFeedInfoPerArticle(feedResponse) {
  const articleBatch = feedResponse.items.map((article) => {
    article.date = new Date(article.published);
    article.title = striptags(helper.decodeHtml(article.title)) || "";
    if (article.title.includes("&#")) { //decode unicode
      try {
        article.title = decodeURIComponent(article.title);
      } catch(e) {
        console.error("Failed to decodeURIComponent", article.title);
      }
      try {
        article.title = decodeHtmlEntities(article.title);
      } catch(e) {
        console.error("Failed to decodeHtmlEntities", article.title);
      }
    }
    article.description = article.description || "";
    // article.description = striptags(article.description, ["table", "script", "style"]);

    if (article.description['$text']) { //Engadget
      article.description = article.description['$text'];
    }

    if (Array.isArray(article.description)) {
      article.description = article.description.join(" ");
    }

    if (article.content_encoded) { //exists in https://feeds.arstechnica.com/arstechnica/index
      article.description += article.content_encoded;
    }


    if (!article.description.replace) {
      console.warn("The description is not a string");
      console.warn(article);
    }

    article.description = article.description.replace(/(<style[\w\W]+style>)/g, "");
    article.description = article.description.replace(/(<script[\w\W]+script>)/g, "");
    article.feedInfo = {
      author: feedResponse.title,
      source: feedResponse.link,
    };

    if (article?.media?.thumbnail?.url) {
      article.imgUrl = article.media.thumbnail.url;
    } else if (article?.image) {
      article.imgUrl = article.image;
    }

    function findImageInUnexpectedProp(obj) {
      for (let prop in obj) {
        if (typeof obj[prop] === "object") {
          findImageInUnexpectedProp(obj[prop]); // Call the function recursively for nested objects
        } else if (typeof obj[prop] === "string" && obj[prop].includes(".jpg")) {
          return true; // Return true if a property is a string with the value "x"
        }
      }
      return false; // Return false if no property is a string with the value "x"
    }
    if (!article.imgUrl && !article.description.includes(".jpg")) {
      const found = findImageInUnexpectedProp(article);
      if (found) {
        console.log("Article with image in unexpected field", article);
      }
    }

    return article;
  });
  return articleBatch;
}

async function resolveContent(req, res, next) {
  const input = feedUrls;
  const feeds = await fetchJsonForAllNewsFeeds(input);
  const articleArraysPerFeedSource = feeds.map((feed) => mapToArticlesArrayWithFeedInfoPerArticle(feed));
  const allArticles = [].concat.apply([], articleArraysPerFeedSource);
  const allCategories = allArticles
    .filter((x) => x && x.category && typeof (x.category) === "string")
    .map((x) => {
      return { cat: x.category };
    });
  const uniqueCategories = helper.getUniqueByValue(allCategories, "cat");
  const content = {
    items: helper.shuffleArray(allArticles),
    categories: uniqueCategories.map((x) => {
      return { title: x.cat, url: `/category/${x}` };
    })
  };
  await renderViewModel(content, req, res, next);
}


/*
  Typical response per feedUrl is:
  ----------------------------------
  {
    category:(0) []
    description:''
    image:''
    items: [
      {
        author:undefined
        category:'Personal'
        content:undefined
        created:1632997345000
        date:undefined
        description: htmlString,
        enclosures:(0) []
        feedInfo:undefined
        id:undefined
        link:'http://www.quirksmode.org/blog/archives/2021/09/new_business_wa.html'
        media:{}
        published:1632997345000
        title:'New business wanted'
      }
    ]
    link:'http://www.quirksmode.org/blog/'
    title:'QuirksBlog'
  }
*/

async function fetchJsonForAllNewsFeeds(feeds) {
  const feedUrls = feeds.map((feed) => feed.url);
  const promiseArray = feedUrls.map((url) => parse(url));
  const results = await Promise.allSettled(promiseArray);
  /*eslint-disable*/
  results.forEach((result, i) => {
    if (result.status === "rejected") console.log(`${feedUrls[i]} failed`);
  })
  return results.filter((result) => result.status === "fulfilled").map((result) => result.value)
    .filter(value => value); //A feedURL can respond but contain null, so make sure to filter existing values
}

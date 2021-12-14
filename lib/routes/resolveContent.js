"use strict";

const config = require("exp-config");
const fetch = require("../fetch");
const logger = require("../logger");
const { getDeployedVersion } = require("./resolveContentHelpers");
const helper = require("../helper");
const moment = require("moment");
const { parse } = require("rss-to-json");
const striptags = require("striptags");
const { response } = require("express");

module.exports = {
  resolveContent,
  renderViewModel
};

async function getTypeSpecificViewData(req, content) {

  if (content) {
    return {
      template: "section",
      headers: {
        "cache-control": "no-store",
        "Edge-control": "max-age=180,dca=esi"
      }
    };
  } else {
    return {
      template: "404",
      headers: {
        "cache-control": "no-store",
        "Edge-control": "max-age=180,dca=esi"
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
        "Edge-control": "max-age=120,dca=esi"
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

// Input list of feeds with articles. Output list of articles with feedinfo per article.
function mapToArticlesArrayWithFeedInfoPerArticle(feedResponse) {
  const articleBatch = feedResponse.items.map((article) => {
    article.date = new Date(article.published);
    article.title = striptags(helper.decodeHtml(article.title)) || "";
    article.description = article.description || "";
    // article.description = striptags(article.description, ["table", "script", "style"]);
    article.description = article.description.replace(/(<style[\w\W]+style>)/g, "");
    article.description = article.description || "";
    article.description = article.description.replace(/(<script[\w\W]+script>)/g, "");
    article.feedInfo = {
      author: feedResponse.title,
      source: feedResponse.link,
    };
    return article;
  });
  return articleBatch;
}

async function resolveContent(req, res, next) {
  const feeds = await fetchJsonForAllNewsFeeds();

  const articleArraysPerFeedSource = feeds.map((feed) => mapToArticlesArrayWithFeedInfoPerArticle(feed));
  const allArticles = [].concat.apply([], articleArraysPerFeedSource);
  const allCategories = allArticles
    .filter((x) => x && x.category && typeof (x.category) === "string")
    .map((x) => {
      return { cat: x.category };
    })
    .map((x) => {
      return {
        ...x,
        pubDate: new Date(x.published)
      };
    });
  const uniqueCategories = helper.getUniqueByValue(allCategories, "cat");
  const content = {
    items: helper.shuffleArray(allArticles),
    categories: uniqueCategories.map((x) => {
      return { title: x.cat, url: `/category/${x}`};
    })
  };
  await renderViewModel(content, req, res, next);
}

const feeds = [
  { url: "http://feeds.feedburner.com/alistapart/main", color: "tan" },
  { url: "https://arstechnica.com/feed/", color: "#e95c33" },
  { url: "http://feeds.feedburner.com/Devlounge", color: "dodgerblue" },
  { url: "https://hacks.mozilla.org/feed/", color: "orangered" },
  { url: "https://feeds.feedburner.com/codinghorror", color: "magenta" },
  { url: "https://www.joelonsoftware.com/feed/", color: "gold" },
  { url: "https://www.reddit.com/r/tech/new/.rss", color: "blue" },
  { url: "https://www.wired.com/rss/", color: "#900C3F" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", color: "#900C3F" },
  { url: "https://cdn.feedcontrol.net/8/1114-wioSIX3uu8MEj.xml", color: "#900C3F" },
  // { url: "http://www.quirksmode.org/blog/index.xml", color: "darkgray" },
  // { url: "https://javascriptweblog.wordpress.com/feed/", color: "#900C3F" },
  { url: "https://tympanus.net/codrops/feed/", color: "#ddd" },
  { url: "https://lifehacker.com/rss", color: "#ddd" },
  { url: "http://rss.slashdot.org/Slashdot/slashdotMain", color: "#ddd" },
  { url: "https://www.theverge.com/rss/index.xml", color: "#ddd" },
  { url: "https://mashable.com/feeds/rss/all", color: "#ddd" },
  { url: "https://feeds.skynews.com/feeds/rss/technology.xml", color: "#ddd" },
  { url: "https://ahrefs.com/blog/feed/", color: "#ddd" },
  //NEWS
  { url: "http://feeds.bbci.co.uk/news/world/rss.xml", color: "rgb(33, 33, 33)" },
  { url: "https://feeds.npr.org/1008/rss.xml/", color: "mediumseagreen" },
  // { url: "https://www.di.se/rss", color: "#da000d" },
  // { url: "http://dn.se/rss", color: "rgb(244, 0, 14)" },
  // { url: "https://feeds.expressen.se/nyheter/", color: "darkblue" },
];

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

async function fetchJsonForAllNewsFeeds() {
  const feedUrls = feeds.map((feed) => feed.url);
  const promiseArray = feedUrls.map((url) => parse(url));
  const results = await Promise.allSettled(promiseArray);
  return results.filter((result) => result.status === "fulfilled").map((result) => result.value);
}

"use strict";

const fetch = require("../fetch");
const logger = require("../logger");
const { getDeployedVersion } = require("./resolveContentHelpers");
const helper = require("../helper");
const { parse } = require("rss-to-json");
const striptags = require("striptags");

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
    }
    return {
      template: "scrollview",
      headers: {
        "cache-control": "no-store",
        "Edge-control": "max-age=180"
      }
    };
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
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html').body.textContent;
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
        try {
          article.title = decodeHtmlEntities(article.title);
        } catch(e) {
          console.error("Failed to decodeHtmlEntities", article.title);
        }
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

const feedUrls = [
  "https://feeds.feedburner.com/codinghorror", // klassiker
  "https://www.gamereactor.se/rss/rss.php?texttype=1",
  "https://lifehacker.com/rss", // bra
  "https://gizmodo.com/rss", // image and a bit of text
  "https://www.pixel-studios.com/blog/feed/", // intressant för webbutvecklare
  "https://feeds.npr.org/1004/rss.xml", // feta bilder
  "https://feeds.feedburner.com/time/world", // feta bilder och långa texter
  "https://www.politico.eu/feed/", // massa långa texter
  "https://tutorial45.com/blog/feed/", // typescript! bra

  // APPLE
  "https://feeds.macrumors.com/MacRumors-All", // bra med många bilder
  // "http://www.macworld.com/index.rss", // bra
  // "https://appleinsider.com/rss/news/", // bra


  // //More tech
  // "https://www.techhive.com/feed", // bra
  // "https://www.technologyelevation.com/feed", // rich lists like best phones 2024
  // "http://feeds.arstechnica.com/arstechnica/technology-lab", // bra
  // "https://feeds.feedburner.com/thenextweb", // bra
  // "https://www.joelonsoftware.com/feed/", // lite för bloggig men rätt kul

//--------------------------------någon av dessa ger 500-error
  // "https://firstfinger.in/rss/",
  // "https://techtoday.co/feed/",
  // "https://www.xavor.com/feed/",
  // "https://technoclik.com/feed/",
//--------------------------------



  // "https://ciente.io/feed/", // rich
  // "https://infogad.com/feed/", // rich
  // "https://feeds.feedburner.com/technologycrowds", // dotnet
  // "https://nextotech.com/feed/",  // freelancer, solar panels etc


  // "https://stephenajulu.com/blog/feed.xml",
  // "https://www.knowledgehut.com/blog/feed",
  // "https://www.techrepublic.com/rssfeeds/articles/",
  // "https://www.webproeducation.org/feed/",
  // "https://9jatide.com/feed/",
  // "https://blog.grio.com/feed",
  // "http://www.huffingtonpost.com/feeds/verticals/technology/index.xml",
  // "https://laptopfaster.com/feed/",
  // "https://www.techpreview.org/feed/",
  // "https://digitalspicy.com/feed/",
  // "https://rudylearningaboutstartups.blogspot.com/feeds/posts/default?alt=rss",
  // "https://www.techieowl.com/feed/",
  // "https://thejollyteapot.com/feed.rss",
  // "https://www.techopedia.com/feed",
  // "https://techtalksick.com/feed/",
  // "https://techspices.com/feed/",
  // "http://feeds.howtogeek.com/HowToGeek",
  // "http://www.technobuffalo.com/feed/",
  // "https://readdive.com/feed/",
  // "https://www.enowsoftware.com/solutions-engine/rss.xml",
  // "https://10xds.com/rss",
  // "https://technologynetworkonline.com/feed/",
  // "https://www.techdiagnose.com/feed/",
  // "https://www.techinvicto.com/feed/",
  // "https://datacrayon.com/rss.xml",
  // "https://infomativebeats.com/feed/",
  // "https://www.iqbrain.in/feed/",
  // "https://www.thecoreitech.com/feed/",
  // "https://technologyspell.com/feed/",
  // "http://www.digitaltechnologyreview.com/feeds/posts/default?alt=rss",
  // "https://techbuzzweb.com/feed/",
  // "https://digitaladdictsblog.com/feed/",
  // "https://zybermedia.net/feed/",
  // "https://technologyfacts34.blogspot.com/feeds/posts/default?alt=rss",
  // "https://toolandgadget.com/feed/",
  // "https://www.internetnewsflash.com/feed/",
  // "https://wiraltech.com/feed/",
  // "https://www.technologydrift.com/feed/",
  // "https://techviewz.com/feed/",
  // "https://www.techsmartworld.com/feed/",
  // "https://getintoic.com/feed/",
  // "http://www.imore.com/feed",
  // "https://angelistech.com/feed/",
  // "https://tech4two.com/feed/",
  // "https://techcrude.com/feed/",
  // "https://www.trootech.com/blog/feed",
  // "https://recknsense.com/feed/",
  // "https://www.techisolutions.guru/feed/",
  // "http://feeds.feedburner.com/blogspot/URgaW",
  // "https://www.tech786.in/feed/",
  // "https://computernxtechnology.com/feed/",
  // "https://technodossier.com/feed/",
  // "https://topfiveinfo.com/feed/",
  // "https://zainssblog.blogspot.com/feeds/posts/default?alt=rss",
  // "https://techfiddle.com/feed/",
  // "https://www.crunchmetrics.ai/blog/feed/",
  // "https://www.innovatechnews.com/feed/",
  // "https://www.wideinfoweb.org/feed/",
  // "https://www.saabyconsulting.com/feed",
  // "https://www.innovationscouts.tech/innovationscouts/blog/feed/",
  // "https://www.techspertservices.com/blog/rss.xml",
  // "https://www.nonteek.com/en/category/technology/feed/",
  // "https://apnitech.com/feed/",
  // "https://techiteasily.com/feed/",
  // "https://education1797.wordpress.com/feed/",
  // "https://www.ninedotsdigital.com/feed/",
  // "https://www.techspooks.com/feed",
  // "https://technological-sci.blogspot.com/feeds/posts/default",
  // "https://technewschronicle.com/feed",
  // "https://myinnerpc.com/feed/",
  // "https://dailypoint002.blogspot.com/feeds/posts/default",
  // "https://informationtoday24x7.blogspot.com/feeds/posts/default",
  // "https://kaizensk.com/feed/",
  // "http://reviewtech.info/feed/",
  // "https://techspit.com/feed/",
  // "https://reegetechreviews.com/feed/",
  // "https://thebloomtalks.com/feed/",
  // "https://edgvio.com/feed/",
  // "https://feeds.feedburner.com/blogspot/oKCTSI",
  // "https://aptira.com/feed/",
  // "http://blog.ihs.com/ihs-technology/rss",
  // "https://www.aidaio.com/feed/",
  // "https://www.energyio.tech/feed/",
  // "https://www.techened.com/feed/",
  // "https://www.makeuseof.com/",
  // "https://hyperhci.com/feed/",
  // "https://blog.shawjj.com/feed",
  // "https://tech2020.news.blog/feed/",
  // "https://theblogofnewworld.blogspot.com/feeds/posts/default?alt=rss",
  // "https://hackernoon.com/feed",
  // "https://meta3wire.org/feed/",
  // "https://feeds.feedburner.com/techgyd",
  // "http://www.theinquirer.net/feeds/rss",
  // "https://feeds.feedburner.com/TalkTechToMe-All",
  // "https://www.greenbot.com/feed/"

  // RATAT
  // "https://umbrellatech.co/feed/", // how to video surveillance
  // "https://www.apartmenttherapy.com/main.rss", // meh, bara 1 rad text. fin bild dock

  // "http://feeds.feedburner.com/venturebeat/SZYF", // images and some text
  // "https://readwrite.com/feed/?x=1", // duplicate images
  // "https://www.topbug.net/feed/", // c++ och iptunnlar
  // "https://winspymobile.com/feed/", // price in feed name
  // "https://www.datadriveninvestor.com/feed/", // business
  // "http://www.theregister.co.uk/headlines.atom", // kortisar, meh
  // "https://www.techmeme.com/feed.xml?x=1", // dåliga rubriker
  // "https://hackaday.com/blog/feed/", // jättekul men orkar inte hacka
  // "https://www.slashgear.com/feed/", // för mycket bil och mc
  // "https://gigaom.com/feed/", // på tok för business
  // "http://tech.firstpost.com/feed", // 404?
  // "http://feeds.findlaw.com/FLTechnologist",  // 404?
  // "https://feeds.feedburner.com/techdirt/feed", // bra nyheter om tex godot men har fel encoding html i rubrikerna
  // "http://www.extremetech.com/feed", // cant parse
  // "https://www.geekwire.com/feed/", // cant parse
  // "https://siliconangle.com/feed/", // broken posts
  // "https://www.technologyreview.com/topnews.rss",// MIT - deep stuff. robotar etc. meh
  // "http://www.technewsworld.com/perl/syndication/rssfull.pl", // dublettbilder
  // "https://forkast.news/feed/", // crpyto etc
  // "https://dongknows.com/feed/", // för lite text, länkar mest bara vidare
  // "https://techengage.com/feed/", // länkar mest bara vidare
  // "https://www.trustedreviews.com/feed", // duplicate images. bra mix...ps5 till kamera
  // "https://alicekeeler.com/feed/", // teaching tech. meh
  // "https://techmused.com/feed/",// för generellt, typ hurfunkaripadresser
  // "https://techguy.co.ke/feed/", // för generellt, typ biltips
  // "https://www.ishir.com/feed", // har poster som datascience vs data engineering. men för djup
  // "https://www.ilounge.com/feed", // whatsappn, mac etc. helt okej
  // "https://www.freesoftwaretips.tech/feed/", // rätt bra guider om allt från servers till windows. men kanske inget för RSS
  // "https://www.area19delegate.org/feed/", // meh.
  // "https://www.wired.com/rss/", // meh. för kort
  // "https://supertechman.com.au/feed", // källa funkar ej
  // "https://mashable.com/feeds/rss/all", // ganska bra men meh
  // "https://www.techgliding.com/feeds/posts/default?alt=rss", // golfbilar

  // "https://www.droidviews.com/feed/", // 4 meningar med read more
  // "https://www.droid-life.com/feed/", // trasiga bilder men bra mobilnyheter
  // "https://fossbytes.com/feed/?x=1", // bra bilder, kort text, mycket OS-grejor

  // "https://techenger.com/feed", // generell skit
  // "https://www.adaltas.com/en/rss.xml", // för smalt tech
  // "https://www.thepourquoipas.com/blog-feed.xml", // ai ai ai
  // "https://feeds.a.dj.com/rss/RSSWorldNews.xml", // WSJ ? bara 1 rad text
  // "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", // okej
  // "https://feeds.feedburner.com/TechCrunch/", // lite för mycket formattering med fonter etc


  // WORLD NEWS WITH NOT ENUFF TEXT
  // "https://www.heraldsun.com.au/rss",
  // "https://www.ft.com/rss/home/uk",
  // "http://feeds.bbci.co.uk/news/world/rss.xml",
  // "https://feeds.feedburner.com/venturebeat/SZYF",
  // "https://www.themoscowtimes.com/rss/news",
  // "https://www.cbsnews.com/latest/rss/technology",
  // "http://feeds.feedburner.com/euronews/en/home/",
  // "https://feeds.feedburner.com/TheBalticTimesNews",
  // "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  // "http://www.theverge.com/rss/frontpage",

  // ANDROID
  // // "https://www.androidcentral.com/rss.xml",
  // "https://bgr.com/tech/feed/", // mycket apple. bra
  // "http://feeds.feedburner.com/ausdroid/feed",


  // BAD DEV
  // "http://feeds.feedburner.com/Devlounge", // okej
  // "https://hacks.mozilla.org/feed/", // smal
  // "https://www.technologyreview.com/feed/", // MIT
  // // "http://www.quirksmode.org/blog/index.xml", //too much code as html
  // // "https://javascriptweblog.wordpress.com/feed/", //too much code as html
  // "http://feeds.feedburner.com/alistapart/main", // lite för filosofiskt
  // "https://arstechnica.com/feed/", // meh. för mycket AT&T
  // "http://www.techspot.com/backend.xml", // at&t

  // "https://www.gamereactor.se/rss/rss.php?texttype=2",
  // "https://www.gamereactor.se/rss/rss.php?texttype=3",
    // "https://www.im4rent.com/feed/", // tyler pearson. lite kort text
  // "https://www.engadget.com/rss.xml", // visar ingen källa
  // "https://feeds.feedburner.com/RedmondPie", // bild, bara 1 mening med länk till urposten - istället för att visa det intressanta
  // "http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", // bara 1 mening
  // "https://techlates.com/feed/", // just 1 post?
  // "https://www.digitaltrends.com/feed/", // inte så bra, lite för kort
  // "https://techmub.com/feed/", // too businessy
  // "http://feeds.bbci.co.uk/news/technology/rss.xml", // bara 1 mening men informativt, bättre än de flesta korta
  // "https://libertyondemand.biz/feed/", // 404?
  // "https://techplanet.today/feed", // java...
  // "https://feeds.feedburner.com/IeeeSpectrumFullText", // mycket videos, mycket ai

  //// MEH



  // "https://gadgetenclave.com/feed/", // för djup
  // "https://tecuy.com/feed/", // tips om socialmediasajter osv
  // "https://neoxtech.net/feed/", // helt okej
  // "https://techaeris.com/feed/", // google chrome news. bra. fast baraa 1 rad och länkar
  // "https://www.slashinsider.com/feed/", // lagom... fast supernishashade nasa-tech
  // "https://www.cnet.com/rss/news/", // one liner
  // "https://bitshift.news/rss.xml", // one liners
  // "https://techcrunch.com/feed/", // personal use only
  // "https://www.zdnet.com/news/rss.xml", // 404?
  // "https://www.ecoustics.com/feed/", // bara en fil bild och en rad text. hifi
  // "https://calsoftinc.com/blogs/feed", // wordy
    // "http://www.infoworld.com/index.rss", // bra.. fast java
  // "https://feeds.boingboing.net/boingboing/iBag", // spel, bra bilder. fast lite för mycket om skola
  // "https://pypixel.com/feed/", // rich.. fast lite för fokad på ett bolag
  // "https://mobilesyrup.com/feed/", // okej...men lite för mycket canada us nyheter
  // "http://feed.androidauthority.com", // bra recensioner av lurar med bild men lite för mycket android
].map(x => ({ url: x }));;

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

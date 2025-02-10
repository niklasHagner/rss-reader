const feedUrls = [
  "https://feeds.feedburner.com/codinghorror", // klassiker
  "https://www.gamereactor.se/rss/rss.php?texttype=1",
  "https://lifehacker.com/rss", // bra
  "https://gizmodo.com/rss", // image and a bit of text
  "https://www.pixel-studios.com/blog/feed/", // intressant för webbutvecklare
  "https://feeds.npr.org/1004/rss.xml", // feta bilder
  "https://feeds.feedburner.com/time/world", // feta bilder och långa texter
  "https://www.politico.eu/feed/", // massa långa texter
  // "https://tutorial45.com/blog/feed/", // typescript ibland, autocad ibland

  // APPLE
  "https://feeds.macrumors.com/MacRumors-All", // bra med många bilder
  // "http://www.macworld.com/index.rss", // bra
  // "https://appleinsider.com/rss/news/", // bra


  // //More tech
  // "https://www.xavor.com/feed/", // mycket 'best practices för secure android apps'
  "https://www.techhive.com/feed", // bra
  // "https://www.technologyelevation.com/feed", // rich lists like best phones 2024
  // "http://feeds.arstechnica.com/arstechnica/technology-lab", // bra
  // "https://feeds.feedburner.com/thenextweb", // bra
  // "https://www.joelonsoftware.com/feed/", // lite för bloggig men rätt kul

//--------------------------------någon av dessa ger 500-error
  // "https://firstfinger.in/rss/",
  // "https://techtoday.co/feed/",
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
  // "https://www.innovationscouts.tech/innovationscouts/blog/feed/",
  // "https://www.techspertservices.com/blog/rss.xml",
  // "https://www.nonteek.com/en/category/technology/feed/",
  // "https://apnitech.com/feed/",
  // "https://techiteasily.com/feed/",

  // "https://technewschronicle.com/feed",
  // "https://myinnerpc.com/feed/",
  // "https://dailypoint002.blogspot.com/feeds/posts/default",
  // "https://informationtoday24x7.blogspot.com/feeds/posts/default",
  // "https://www.techened.com/feed/",
  // "https://www.makeuseof.com/",
  "https://blog.shawjj.com/feed",
  "https://tech2020.news.blog/feed/",

  // RATAT
  // "https://feeds.feedburner.com/TalkTechToMe-All", // Slutade 2022
  // "https://meta3wire.org/feed/", // Slutade 2023
  // "https://technological-sci.blogspot.com/feeds/posts/default", // meh, blandar flutter med svarta hål
  // "https://education1797.wordpress.com/feed/", // Slutade 2021
  // "https://www.aidaio.com/feed/", // Slutade 2020
  // "https://aptira.com/feed/", // Slutade 2022
  // "https://theblogofnewworld.blogspot.com/feeds/posts/default?alt=rss", // Slutade blogga 2020
  // "https://umbrellatech.co/feed/", // how to video surveillance
  // "https://www.apartmenttherapy.com/main.rss", // meh, bara 1 rad text. fin bild dock
  // "https://hackernoon.com/feed", // bilderna är 404

  // "http://feeds.feedburner.com/venturebeat/SZYF", // images and some text
  // "https://readwrite.com/feed/?x=1", // duplicate images
  // "https://www.topbug.net/feed/", // c++ och iptunnlar
  // "https://winspymobile.com/feed/", // price in feed name
  // "https://feeds.feedburner.com/techgyd", // Small business tips
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
  // "https://www.androidcentral.com/rss.xml",
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


module.exports = feedUrls;

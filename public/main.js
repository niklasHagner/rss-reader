
(function () {
  document.addEventListener("DOMContentLoaded", domReady);
})();


function domReady() {
  const readerView = document.querySelector("#reader-view-article");
  if (readerView) {
    setUpReaderView(readerView);
  } else {
    setupGridView();
  }
}

function setupGridView() {
  const buttons = Array.from(document.querySelectorAll(".expand"));
  buttons.forEach(x => x.addEventListener("click", (e) => {
    if (e.target.innerText === "EXPAND") {
      e.target.innerText = "COLLAPSE";
    } else {
      e.target.innerText = "EXPAND";
    }
    const article = e.target.closest(".grid-item");
    article.classList.toggle("grid-item--expanded");
   } ));
}

function setUpReaderView() {
  const readerView = document.querySelector("#reader-view-article");
  const readerViewScrollContainer = document.querySelector("#reader-view");

  if (!readerView) {
    return
  }
  const buttons = Array.from(document.querySelectorAll(".sidebar header button"));
  buttons.forEach(x => x.addEventListener("click", (e) => { sortFeeds(e); } ));
  const teaserListEl = document.querySelector(".teaser-list");
  const teasers = Array.from(document.querySelectorAll(".teaser"));
  teasers.forEach((teaser) => { teaser.addEventListener("click", onClickTeaser) });

  function onClickTeaser(e) {
    e.preventDefault();
    teasers.forEach((x) => x.classList.remove("active"));
    const teaser = e.target.closest(".teaser");
    teaser.classList.add("active");
    const title = decodeURIComponent(teaser.getAttribute("data-title"));
    const description = decodeURIComponent(teaser.getAttribute("data-description"));
    const author = decodeURIComponent(teaser.getAttribute("data-author"));
    const link = decodeURIComponent(teaser.getAttribute("data-link"));

    if(readerViewScrollContainer) {
      readerViewScrollContainer.scrollTop = 0;
    }

    readerView.innerHTML = `
      <article>
        <h1>${title}</h1>
        ${ (link && author) ? `<p class="article__meta"><a target="_blank" href="${link}">Link</a> <span style="font-size: 0.8em">by ${author}</span></p>` : '' }
        <section class="article__description">${description}</section>
      </article>
    `;
  }

  function sortFeeds(e) {
    buttons.forEach(x => x.classList.remove("active"));
    const buttonEl = e.target.closest("button");
    buttonEl.classList.add("active");

    let sortType = "random";
    if (buttonEl.classList.contains("button--sort-new")) {
      sortType = "new";
    } else if (buttonEl.classList.contains("button--sort-old")) {
      sortType = "old";
    } else if (buttonEl.classList.contains("button--sort-source")) {
      sortType = "source";
    }

    let newlySortedElements = [];
    const originalTeaserElements = Array.from(document.querySelectorAll(".teaser"));

    switch(sortType) {
      case "random":
        newlySortedElements = shuffleArray(originalTeaserElements);
        break;
      case "new":
        newlySortedElements = originalTeaserElements.slice().sort((a,b) => {
          const aText = a.querySelector(".teaser__published").innerText;
          const bText = b.querySelector(".teaser__published").innerText;
          const aValue = new Date(aText);
          const bValue = new Date(bText);
          return aValue - bValue;
        }).reverse();
        break;
      case "old":
        newlySortedElements = originalTeaserElements.slice().sort((a,b) => {
          const aText = a.querySelector(".teaser__published").innerText;
          const bText = b.querySelector(".teaser__published").innerText;
          const aValue = new Date(aText);
          const bValue = new Date(bText);
          return aValue - bValue;
        });
        break;
      case "source":
        newlySortedElements = originalTeaserElements.slice().sort((a,b) => {
            const aValue = a.querySelector(".teaser__author").innerText;
            const bValue = b.querySelector(".teaser__author").innerText;
            if(aValue < bValue) { return -1; }
            if(aValue > bValue) { return 1; }
            return 0;
          });
        break;
    }

    var batch = document.createDocumentFragment();
    newlySortedElements.forEach(function(x) {
      batch.appendChild(x); //Note: if this is changed to cloneNode - remember to setup clickEvents again
    });

    teaserListEl.innerHTML = "";
    teaserListEl.appendChild(batch);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
}


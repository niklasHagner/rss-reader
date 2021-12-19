
(function () {
  document.addEventListener("DOMContentLoaded", domReady);
})();


function domReady() {
  const teaserListEl = document.querySelector(".teaser-list");
  const buttons = Array.from(document.querySelectorAll(".sidebar header button"));
  buttons.forEach(x => x.addEventListener("click", (e) => { sortFeeds(e); } ));

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


//CSS script
$(document).ready(function() {
  const rows = 6; //change this also in css
  const cols = 7; //change this also in css
  const staggerTime = 50;
  let autoClicker = false;
  const urls = [];
  const fullName = [];

  my_data = shuffle(my_data);
  my_data.forEach(el => {
    urls.push(`./img/${el.src}.webp`);
    fullName.push(`${el.firstName} ${el.lastName}`);
  });

  const $gallery = $(".demo__gallery");
  const $help = $(".demo__help");

  let partsArray = [];
  const reqAnimFr = (function() {
    return (
      window.requestAnimationFrame ||
      function(cb) {
        setTimeout(cb, 1000 / 60);
      }
    );
  })();

  for (let row = 1; row <= rows; row++) {
    partsArray[row - 1] = [];
    for (let col = 1; col <= cols; col++) {
      $gallery.append(
        `<div class="show-front demo__part demo__part-${row}-${col}" row="${row}" col="${col}">
          <div class="demo__part-back">
            <div class="demo__part-back-inner"></div>
          </div>
          <div class="demo__part-front">
            <div class="demo__part-front-name hide"></div>
          </div>
        </div>`
      );
      partsArray[row - 1][col - 1] = new Part();
    }
  }

  const $parts = $(".demo__part");
  const $image = $(".demo__part-back-inner");
  for (let i = 0; i < $parts.length; i++) {
    $parts
      .find(".demo__part-front")
      .eq(i)
      .css("background-image", `url(${urls[i].replace(".jpg", "-thumb.jpg")})`);
    $parts
      .find(".demo__part-front-name")
      .eq(i)
      .html(`${fullName[i]}`);
  }

  setTimeout(function() {
    document.querySelector(".demo__help").style.display = "none";
  }, 3000);

  const containerGrid = document.querySelector(".demo_container").style;
  $gallery.on("click", ".demo__part-front", function() {
    autoClicker = true;
    document.querySelector(".demo__infomation").classList.remove("hide");
    if (window.innerWidth < 1401){
      document.querySelector(".closeBtn").classList.remove("hide");
    }
    if (window.innerWidth > 1400) containerGrid.gridTemplateColumns = "5fr 4fr";

    //until here
    $image.css(
      "background-image",
      $(this)
        .css("background-image")
        .replace("-thumb", "")
    );
    let row = +$(this)
      .closest(".demo__part")
      .attr("row");
    let col = +$(this)
      .closest(".demo__part")
      .attr("col");
    waveChange(row, col);

    const thisName = this.children[0].innerHTML;
    const index = my_data.findIndex(el => {
      return `${el.firstName} ${el.lastName}` === thisName;
    });
    const item = my_data[index];

    $(".selector_infomation").html("");
    if (item.favoriteQuote)
      $(".selector_infomation").append(
        `<div class="favorite-quote"><i class="fas fa-quote-left fa-2x"></i><span>${
          item.favoriteQuote
        }</span></div>`
      );
    if (item.skills == true)
      $(".selector_infomation").append(
        `${item.skills
          .map(skill => `<div class="skill-tag">${skill}</div>`)
          .join("")}`
      );
    if (item.firstName && item.lastName)
      $(".selector_infomation").append(
        `<h3>Full name:</h3>${item.firstName} ${item.lastName}`
      );
    if (item.title)
      $(".selector_infomation").append(` <h3>Title:</h3>${item.title}`);
    if (item.nationality)
      $(".selector_infomation").append(
        `<h3>Nationality:</h3>${item.nationality}`
      );
    if (item.whySofterDeveloper)
      $(".selector_infomation").append(
        `<h3>Why software developer?</h3>${item.whySofterDeveloper}`
      );
    if (item.longTermVision)
      $(".selector_infomation").append(
        `<h3>Long-term vision:</h3>${item.longTermVision}`
      );

    if (item.motivatesMe)
      $(".selector_infomation").append(
        `<h3>What motivate me?</h3>${item.motivatesMe}`
      );
  });

  $gallery.on("mouseover", ".demo__part-front", function() {
    if (event.target.children[0] != undefined)
      if (event.target.children[0].classList.contains("hide")) {
        event.target.children[0].classList.remove("hide");
      }
  });
  $gallery.on("mouseleave", ".demo__part-front", function() {
    if (event.target.children[0] != undefined)
      if (!event.target.children[0].classList.contains("hide")) {
        event.target.children[0].classList.add("hide");
      }
  });
  $gallery.on("mouseover", ".demo__part-front-name", function() {
    if (event.target.classList.contains("hide")) {
      event.target.classList.remove("hide");
    }
  });
  $gallery.on("mouseleave", ".demo__part-front-name", function() {
    if (!event.target.classList.contains("hide")) {
      event.target.classList.add("hide");
    }
  });
  function clickDemoBack() {
    autoClicker = true;
    if (!isShowingBack()) return;
    setTimeout(function() {
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
          partsArray[row - 1][col - 1].showing = "front";
        }
      }
    }, staggerTime + $parts.length * staggerTime / 10);
    showFront(0, $parts.length);
  }
  $(".closeBtn").click(function() {
    document.querySelector(".demo__infomation").classList.add("hide");
    clickDemoBack();
  });
  $gallery.on("click", ".demo__part-back", function() {
    clickDemoBack();
  });

  function showFront(i, maxI) {
    if (i >= maxI) return;
    $parts.eq(i).addClass("show-front");

    reqAnimFr(function() {
      showFront(i + 1);
    });
  }

  function isShowingBack() {
    return (
      partsArray[0][0].showing == "back" &&
      partsArray[0][cols - 1].showing == "back" &&
      partsArray[rows - 1][0].showing == "back" &&
      partsArray[rows - 1][cols - 1].showing == "back"
    );
  }

  function Part() {
    this.showing = "front";
  }

  function waveChange(rowN, colN) {
    if (rowN > rows || colN > cols || rowN <= 0 || colN <= 0) return;
    if (partsArray[rowN - 1][colN - 1].showing == "back") return;
    $(".demo__part-" + rowN + "-" + colN).removeClass("show-front");
    partsArray[rowN - 1][colN - 1].showing = "back";
    setTimeout(function() {
      waveChange(rowN + 1, colN);
      waveChange(rowN - 1, colN);
      waveChange(rowN, colN + 1);
      waveChange(rowN, colN - 1);
    }, staggerTime);
  }
  $(window).resize(function() {
    if ($(window).width() > 1400) {
      containerGrid.gridTemplateColumns = "5fr 4fr";
    } else {
      containerGrid.gridTemplateColumns = "1fr";
    }
  });
  function shuffle(arr) {
    let ctr = arr.length;
    let temp;
    let index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = arr[ctr];
      arr[ctr] = arr[index];
      arr[index] = temp;
    }
    return arr;
  }
  setInterval(function() {
    const galleryDiv = document.querySelector(".demo__gallery").children;
    if (!autoClicker) {
      const randomEl = Math.floor(Math.random() * galleryDiv.length);
      galleryDiv[randomEl].classList.contains("show-front")
        ? galleryDiv[randomEl].children[1].click()
        : window.innerWidth > 1400
          ? galleryDiv[randomEl].children[1].click()
          : document.querySelector(".closeBtn").click();
    }

    autoClicker = false;
  }, 5000);
});

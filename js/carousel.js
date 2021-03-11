class Carousel {

  static emptyCard = '<div class="empty-card">\n' +
    '  <div class="grey" style="height: 120px; width: 100%">\n' +
    '  </div>\n' +
    '  <br>\n' +
    '  <div class="grey pad" style="height: 10px; width: 80%;">\n' +
    '  </div>\n' +
    '  \n' +
    '  <div class="grey pad" style="height: 10px; width: 60%;">\n' +
    '  </div>\n' +
    '  <br>\n' +
    '  <div class="grey pad" style="height: 10px; width: 50%;">\n' +
    '  </div>\n' +
    '</div>';

  constructor(option) {
    this.container = option.container;
    this.icon = option.icon;
    this.title = option.title;
    this.subtitle = option.subtitle;
    this.fetchCards = option.fetchCards;
    this.chunkSize = Math.floor(Math.random() * 10) + 2;
    this.totalSize = 10;
    this.onInit();
  }

  async renderCards() {
    this.cardsArray = await this.fetchCards(this.chunkSize);
    this.cardsContainer.innerHTML = '';
    this.cardsArray.forEach(card => {
      let cardContainer = document.createElement("div");
      cardContainer.classList.add("card-wrapper");
      let innerContainer = document.createElement("div");
      innerContainer.classList.add("inner-container");
      cardContainer.appendChild(innerContainer);
      let image = document.createElement("img");
      image.classList.add("card");
      image.src = card.image;
      innerContainer.appendChild(image);
      let type = document.createElement("p");
      type.innerText = card.type;
      type.classList.add("type");
      innerContainer.appendChild(type);
      let duration = document.createElement("p");
      duration.innerText = this.renderDuration(card.duration);
      duration.classList.add("duration");
      innerContainer.appendChild(duration);
      let title = document.createElement("p");
      title.innerText = card.title;
      title.classList.add("card-title");
      cardContainer.appendChild(title);
      this.cardsContainer.appendChild(cardContainer);
      if(card.cardinality === 'collection') {
          let collection = document.createElement("span");
          collection.classList.add("material-icons");
          collection.classList.add("collection-icon");
          collection.innerText = "collections";
          cardContainer.appendChild(collection);
       }

    });
    for(let i=this.chunkSize; i<this.totalSize; i++) {
      let emptyCard = document.createElement("div");
      emptyCard.innerHTML = Carousel.emptyCard;
      this.cardsContainer.appendChild(emptyCard);
    }

  }

  renderDuration(duration) {
    let date = new Date(0);
    date.setSeconds(duration); // specify value for SECONDS here
    let timeString = date.toISOString().substr(11, 8);
    return timeString;
  }

  async onInit() {
    let titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");
    let icon = document.createElement("span");
    icon.classList.add("carousel-icon");
    icon.classList.add("material-icons");
    icon.innerHTML = this.icon;
    titleContainer.appendChild(icon);
    let title = document.createElement("h3");
    title.classList.add("carousel-title");
    title.innerText = this.title;
    titleContainer.appendChild(title);
    let subtitle = document.createElement("p");
    subtitle.classList.add("carousel-subtitle");
    subtitle.innerText = this.subtitle;
    titleContainer.appendChild(subtitle);
    document.getElementById(this.container).appendChild(titleContainer);

    this.cardsContainer = document.createElement("div");
    this.cardsContainer.classList.add("cards-container");
    document.getElementById(this.container).appendChild(this.cardsContainer);
    let buttonLeft = document.createElement("button");
    buttonLeft.classList.add("scroll-left");
    buttonLeft.innerHTML = '<span class="material-icons">chevron_left</span>';
    let buttonRight = document.createElement("button");
    buttonRight.classList.add("scroll-right");
    buttonRight.innerHTML = '<span class="material-icons">chevron_right</span>';
    document.getElementById(this.container).appendChild(buttonLeft);
    document.getElementById(this.container).appendChild(buttonRight);
    document.getElementById(this.container).addEventListener('mouseover', () => {
      buttonLeft.classList.add("scroll-visible"),
        buttonRight.classList.add("scroll-visible")
    });
    document.getElementById(this.container).addEventListener('mouseleave', () => {
      buttonLeft.classList.remove("scroll-visible"),
        buttonRight.classList.remove("scroll-visible")
    });
    buttonRight.addEventListener('click', () => {
      this.cardsContainer.scroll({
        left: this.cardsContainer.scrollLeft + 225,
        behavior: "smooth"
      });
      this.chunkSize += 1;
      this.renderCards();
    });
    buttonLeft.addEventListener('click', () => {
      this.cardsContainer.scroll({
        left: this.cardsContainer.scrollLeft - 225,
        behavior: "smooth"
      })
    });
  this.renderCards();
  }

}


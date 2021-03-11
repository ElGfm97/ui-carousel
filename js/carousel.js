class Carousel {

  /* This static variable contains layout for cards that are shown in loading phase */
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
    this.container = option.container; //container in HTML template for this carousel instance
    this.icon = option.icon; //icon associated with this carousel
    this.title = option.title;  //title associated with this carousel
    this.subtitle = option.subtitle;
    this.fetchCards = option.fetchCards;  /* fetchCards is called from template, it returns the portion of array of cards
    between 0 and chunkSize, after an initial delay of 1 second */
    this.chunkSize = Math.floor(Math.random() * 10) + 2;  //chunkSize is a random value between 2 and 10
    this.totalSize = 10; //total number of cards in every carousel component
    this.onInit(); //first method called on initialization of carousel component
  }

  async renderCards() {  //method thar renders cards in the carousel container
    this.cardsArray = await this.fetchCards(this.chunkSize); //wait while fetchCards() fetches portion of array of cards
    this.cardsContainer.innerHTML = '';
    this.cardsArray.forEach(card => {
      let cardWrapper = document.createElement("div"); //creates wrapper container for each card
      cardWrapper.classList.add("card-wrapper");

      let imageWrapper = this.createImageWrapper();
      cardWrapper.appendChild(imageWrapper);

      imageWrapper.appendChild(this.createCardImage(card));
      imageWrapper.appendChild(this.createCardType(card));
      imageWrapper.appendChild(this.createCardDuration(card));
      cardWrapper.appendChild(this.createCardTitle(card));
      this.cardsContainer.appendChild(cardWrapper);
      if (card.cardinality === 'collection') {
        cardWrapper.appendChild(this.createCardCollection());
      }

    });
    for (let i = this.chunkSize; i < this.totalSize; i++) {
      let emptyCard = document.createElement("div");
      emptyCard.innerHTML = Carousel.emptyCard;
      this.cardsContainer.appendChild(emptyCard);
    }

  }

  renderDuration(duration) {  //renders duration of each card in human readable notation (hh:mm:ss)
    let date = new Date(0);
    date.setSeconds(duration); // specify value for SECONDS here
    let timeString = date.toISOString().substr(11, 8);
    return timeString;
  }

  async onInit() {
    let titleContainer = document.createElement("div");  //create container div in DOM for icon, title and subtitle of carousel
    titleContainer.classList.add("title-container");
    titleContainer.appendChild(this.createCarouselIcon());
    titleContainer.appendChild(this.createCarouselTitle());
    titleContainer.appendChild(this.createCarouselSubtitle());
    document.getElementById(this.container).appendChild(titleContainer); //append title container to carousel container in template

    this.cardsContainer = document.createElement("div"); //create container div in DOM for the collection of cards
    this.cardsContainer.classList.add("cards-container");
    document.getElementById(this.container).appendChild(this.cardsContainer); //append cards container to carousel container in template
    let leftButton = this.createLeftButton();
    let rightButton = this.createRightButton();
    document.getElementById(this.container).appendChild(leftButton);
    document.getElementById(this.container).appendChild(rightButton);
    this.makeButtonsVisible(leftButton, rightButton);
    this.scrollCarousel(leftButton, rightButton);
    this.renderCards();
  }

  createCarouselIcon() {   //method that creates DOM element for carousel icon
    let icon = document.createElement("span");
    icon.classList.add("carousel-icon");
    icon.classList.add("material-icons");
    icon.innerHTML = this.icon;
    return icon;
  }

  createCarouselTitle() {  //method that creates DOM element for carousel title
    let title = document.createElement("h3");
    title.classList.add("carousel-title");
    title.innerText = this.title;
    return title;
  }

  createCarouselSubtitle() {  //method that creates DOM element for carousel subtitle
    let subtitle = document.createElement("p");
    subtitle.classList.add("carousel-subtitle");
    subtitle.innerText = this.subtitle;
    return subtitle;
  }

  createLeftButton() {   //creates left button for carousel scrolling
    let buttonLeft = document.createElement("button");
    buttonLeft.classList.add("scroll-left");
    buttonLeft.innerHTML = '<span class="material-icons">chevron_left</span>';
    return buttonLeft;
  }

  createRightButton() {  //creates right button for carousel scrolling
    let buttonRight = document.createElement("button");
    buttonRight.classList.add("scroll-right");
    buttonRight.innerHTML = '<span class="material-icons">chevron_right</span>';
    return buttonRight;
  }

  makeButtonsVisible(leftButton, rightButton) {  //makes buttons visible only on mouse positioned over carousel container
    document.getElementById(this.container).addEventListener('mouseover', () => {
      leftButton.classList.add("scroll-visible");
      rightButton.classList.add("scroll-visible");
    });
    document.getElementById(this.container).addEventListener('mouseleave', () => {
      leftButton.classList.remove("scroll-visible");
      rightButton.classList.remove("scroll-visible");
    });

  }

  scrollCarousel(leftButton, rightButton) { //method that handles scrolling on button click
    rightButton.addEventListener('click', () => {
      this.cardsContainer.scroll({
        left: this.cardsContainer.scrollLeft + 225,  //225 is the number of pixels to scroll, it's equal to card width
        behavior: "smooth"
      });
      this.chunkSize += 1;  //to display one more card...
      this.renderCards();  //calls this method to render "chunkSize" number of cards in template
    });
    leftButton.addEventListener('click', () => {
      this.cardsContainer.scroll({
        left: this.cardsContainer.scrollLeft - 225,
        behavior: "smooth"
      })
    });
  }

  createImageWrapper() {  //create wrapper container for image, type and duration of each card
    let imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    return imageWrapper;
  }

  createCardImage(card) {   //renders card's image
    let image = document.createElement("img");
    image.classList.add("card");
    image.src = card.image;
    return image;

  }

  createCardType(card) {  //renders card's type
    let type = document.createElement("p");
    type.innerText = card.type;
    type.classList.add("type");
    return type;

  }

  createCardDuration(card) {  //renders card's duration
    let duration = document.createElement("p");
    duration.innerText = this.renderDuration(card.duration);
    duration.classList.add("duration");
    return duration;
  }

  createCardTitle(card) {  //renders card's title
    let title = document.createElement("p");
    title.innerText = card.title;
    title.classList.add("card-title");
    return title;
  }

  createCardCollection() {  //applies collection icon to cards that are of type 'collection'
    let collection = document.createElement("span");
    collection.classList.add("material-icons");
    collection.classList.add("collection-icon");
    collection.innerText = "collections";
    return collection;
  }
}


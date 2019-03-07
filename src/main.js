import {random} from './utils.js';
import createRandomCard from './data.js';
import createFilterElement from './filter.js';
import {Card} from './card/card.js';
import {CardDetails} from './card/card-details.js';

// Filter

const filterContainer = document.querySelector(`.main-navigation`);
const filterElementsArray = [
  [`All movies`, true],
  [`Watchlist`],
  [`History`],
  [`Favorites`]
];

// Card

const cardContainer = document.querySelector(`.films-list .films-list__container`);
const cardContainersExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

const showCards = (num, container) => {
  container.innerHTML = ``;

  const cardComponentData = [];
  const cardComponent = [];
  const cardComponentDetails = [];

  for (let i = 1; i <= num; i++) {
    cardComponentData[i] = createRandomCard();
    cardComponent[i] = new Card(cardComponentData[i]);
    cardComponentDetails[i] = new CardDetails(cardComponentData[i]);

    cardComponent[i].onDetails = () => {
      document.body.appendChild(cardComponentDetails[i].render());
    };

    cardComponentDetails[i].onDetailsClose = () => {
      document.body.removeChild(document.querySelector(`.film-details`));
      cardComponentDetails[i].unrender();
    };

    container.appendChild(cardComponent[i].render());

    const cardsExtra = document.querySelectorAll(`.films-list--extra .film-card`);
    cardsExtra.forEach((cardExtra) => {
      cardExtra.classList.add(`film-card--no-controls`);
    });
  }
};

// Отрисовываем все фильтры

const showFilter = (container) => {
  const filterElements = filterElementsArray.map((item) => createFilterElement(item[0], random(0, 15), item[1]));
  container.insertAdjacentHTML(`afterbegin`, filterElements.join(``));
};

showFilter(filterContainer);

// Добавляем каждому фильтру обработчик события click

const filterLinks = document.querySelectorAll(`.main-navigation__item`);

filterLinks.forEach((link) => {
  link.addEventListener(`click`, () => {
    showCards(random(0, 15), cardContainer);

    filterLinks.forEach((linkItem) => {
      linkItem.classList.remove(`main-navigation__item--active`);
    });

    link.classList.add(`main-navigation__item--active`);
  });
});

// Card

showCards(7, cardContainer);

cardContainersExtra.forEach((container) => {
  showCards(2, container);
});

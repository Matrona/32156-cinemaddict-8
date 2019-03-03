import {random} from './utils.js';
import createRandomCard from './data.js';
import createFilterElement from './filter.js';
import createCard from './card.js';

// Filter

const filterContainer = document.querySelector(`.main-navigation`);
const filterElementsArray = [
  [`All movies`, true],
  [`Watchlist`],
  [`History`],
  [`Favorites`]
];

const cardContainer = document.querySelector(`.films-list .films-list__container`);
const cardContainersExtra = document.querySelectorAll(`.films-list--extra .films-list__container`);

const showCards = (num, container) => {
  container.innerHTML = ``;

  for (let i = 1; i <= num; i++) {
    container.insertAdjacentHTML(`beforeend`, createCard(createRandomCard()));

    const containerWrapExtra = container.closest(`.films-list--extra`);

    if (containerWrapExtra) {
      const cardsExtra = containerWrapExtra.querySelectorAll(`.film-card`);
      cardsExtra.forEach((cardExtra) => {
        cardExtra.classList.add(`film-card--no-controls`);
      });
    }
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

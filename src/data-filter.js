import {getRandom} from './utils.js';

const filterElementsArray = [
  {
    title: `All movies`,
    id: `all`,
    count: getRandom(0, 10),
    active: true
  },
  {
    title: `Watchlist`,
    id: `watchlist`,
    count: getRandom(0, 10),
    active: false
  },
  {
    title: `History`,
    id: `history`,
    count: getRandom(0, 10),
    active: false
  },
  {
    title: `Favorites`,
    id: `favorites`,
    count: getRandom(0, 10),
    active: false
  }
];

export default () => filterElementsArray;

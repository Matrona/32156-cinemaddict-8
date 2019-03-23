import {random, randomItem, randomFloat, randomDate} from './utils.js';
import moment from 'moment';

const titles = [`Three Billboards Outside Ebbing, Missouri `, `The Revenant`, `Inception`, `Catch Me If You Can`, `Shutter Island`, `Wonder`, `Avatar`, `Blade Runner 2049`, `Bohemian Rhapsody`, `Ready Player One`, `Upgrade`, `Hacksaw Ridge`, `Sully`, `The Martian`, `Interstellar`];

const images = [`accused.jpg`, `blackmail.jpg`, `blue-blazes.jpg`, `fuga-da-new-york.jpg`, `moonrise.jpg`, `three-friends.jpg`];

const descriptions = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`, `Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`, `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`, `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`, `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`];

const genres = [`Comedy`, `Fantasy`, `Horror`, `Adventure`, `Action`, `Thriller`, `Drama`, `Mystery`, `Crime`, `Animation`];

const createRandomDescription = (elements) => {
  return [...elements].sort(() => 0.5 - Math.random()).slice(0, random(1, 3)).join(` `);
};

const createComments = () => {
  const comment = {
    author: `Tim Macoveev`,
    date: moment().fromNow(),
    text: `So long-long story, boring!`,
    emoji: `😴`
  };
  return Array(random(0, 8)).fill(comment);
};

const createRandomReleaseDate = () => randomDate(new Date(2008, 0, 1), new Date());

export default () => ({
  number: null,
  title: randomItem(titles),
  rating: randomFloat(6, 10),
  userRating: `5`,
  runtime: random(60, 150) * 60000,
  releaseDate: createRandomReleaseDate(),
  genre: randomItem(genres),
  picture: randomItem(images),
  description: createRandomDescription(descriptions),
  comment: createComments()
});

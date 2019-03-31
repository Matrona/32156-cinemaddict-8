export const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;
export const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
export const getRandomBoolean = () => getRandomItem([true, false]);
export const getRandomFloat = (min, max) => parseFloat(Math.min(min + (Math.random() * (max - min)), max).toFixed(1));
export const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const createDataArray = (count, data) => new Array(count).fill(``).map(() => data());

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

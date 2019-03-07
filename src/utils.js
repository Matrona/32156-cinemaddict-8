export const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
export const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
export const randomFloat = (min, max) => parseFloat(Math.min(min + (Math.random() * (max - min)), max).toFixed(1));

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

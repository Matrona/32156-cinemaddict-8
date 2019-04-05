export const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const emojiList = {
  'sleeping': `😴`,
  'neutral-face': `😐`,
  'grinning': `😀`
};

export const toggleBlockForm = (form, boolean) => {
  form.disabled = boolean;
};

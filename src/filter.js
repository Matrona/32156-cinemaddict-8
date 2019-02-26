export default (caption, count, isAll = false) => {

  return `
    <a href="#${caption.toLowerCase()}" class="main-navigation__item ${isAll ? `main-navigation__item--active` : ``}">${caption} ${!isAll ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>
  `;

};

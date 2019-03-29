import {Component} from '../component.js';

export class Filter extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._id = data.id;
    this._count = data.count;
    this._active = data.active;

    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `
      <a href="#${this._id}" id="${this._id}" class="main-navigation__item ${this._active ? `main-navigation__item--active` : ``}">${this._title} ${(this._id !== `all`) ? `<span class="main-navigation__item-count">${this._count}</span>` : ``}</a>
    `.trim();
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}

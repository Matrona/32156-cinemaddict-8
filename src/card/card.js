import {createElement} from '../utils.js';

export class Card {
  constructor(data) {
    this._title = data.title;
    this._rating = data.rating;
    this._picture = data.picture;
    this._year = data.year;
    this._durationHours = data.durationHours;
    this._durationMinutes = data.durationMinutes;
    this._genre = data.genre;
    this._description = data.description;
    this._comments = data.comments;

    this._element = null;
    this._onDetails = null;
  }

  _createDurationMinutes() {
    if (this._durationMinutes <= 5) {
      return false;
    }
    return true;
  }

  _onDetailsButtonClick() {
    if (typeof this._onDetails === `function`) {
      this._onDetails();
    }
  }

  set onDetails(fn) {
    this._onDetails = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
      <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${this._year}</span>
          <span class="film-card__duration">${this._durationHours}h&nbsp;${this._createDurationMinutes() ? `${this._durationMinutes}m` : ``}</span>
          <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="./images/posters/${this._picture}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <button class="film-card__comments">${this._comments} comments</button>

        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
        </form>
      </article>
    `.trim();
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onDetailsButtonClick.bind(this));
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`click`, this._onDetailsButtonClick.bind(this));
  }
}
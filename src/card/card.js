import {Component} from '../component.js';
import moment from 'moment';


export class Card extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._userRating = data.userRating;
    this._picture = data.picture;
    this._releaseDate = data.releaseDate;
    this._runtime = data.runtime;
    this._genre = data.genre;
    this._description = data.description;
    this._commentsCount = data.comment.length;
    this._comment = data.comment;

    this._onDetails = null;
    this._onDetailsButtonClick = this._onDetailsButtonClick.bind(this);
  }

  _createDurationMinutes() {
    if (moment.duration(this._runtime).minutes() <= 5) {
      return false;
    }
    return true;
  }

  _updateCommentsCount() {
    this._element.querySelector(`.film-card__comments`).innerHTML = `${this._commentsCount} comments`;
  }

  _onDetailsButtonClick() {
    return typeof this._onDetails === `function` && this._onDetails();
  }

  set onDetails(fn) {
    this._onDetails = fn;
  }

  get template() {
    return `
      <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._releaseDate).year()}</span>
          <span class="film-card__duration">${moment.duration(this._runtime).hours()}h&nbsp;${this._createDurationMinutes() ? `${moment.duration(this._runtime).minutes()}m` : ``}</span>
          <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="./images/posters/${this._picture}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <button class="film-card__comments">${this._commentsCount} comments</button>

        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
        </form>
      </article>
    `.trim();
  }

  createListeners() {
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onDetailsButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`click`, this._onDetailsButtonClick);
  }

  update(data) {
    this._commentsCount = data.commentsCount;
    this._comment = data.comment;
    this._userRating = data.userRating;
    this._updateCommentsCount();
  }
}

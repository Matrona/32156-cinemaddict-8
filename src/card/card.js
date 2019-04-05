import {Component} from '../component.js';
import moment from 'moment';

export class Card extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._rating = data.rating;
    this._userRating = data.userRating;
    this._picture = data.posterUrl;
    this._releaseDate = data.releaseDate;
    this._runtime = data.runtime;
    this._genres = data.genres;
    this._description = data.description;
    this._comment = data.comments;
    this._commentsCount = data.comments.length;

    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

    this._onDetails = null;
    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._onDetailsButtonClick = this._onDetailsButtonClick.bind(this);
    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
  }

  _createDurationMinutes() {
    if (moment.duration(this._runtime * 60000).minutes() <= 5) {
      return false;
    }
    return true;
  }

  _processForm(formData) {
    const entry = {
      commentsCount: this._commentsCount,
      comment: this._comment,
      inWatchList: this._inWatchList,
      isWatched: this._isWatched
    };

    const cardMapper = Card.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (cardMapper[property]) {
        cardMapper[property](value);
      }
    }
    return entry;
  }

  _updateCommentsCount() {
    this._element.querySelector(`.film-card__comments`).innerHTML = `${this._commentsCount} comments`;
  }

  _onDetailsButtonClick() {
    return typeof this._onDetails === `function` && this._onDetails();
  }

  _onAddToWatchListClick(evt) {
    evt.preventDefault();
    this._inWatchList = !this._inWatchList;
    const formData = new FormData(this._element.querySelector(`.film-card__controls`));
    const newData = this._processForm(formData);
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(newData);
    }
    return this.update(newData);
  }

  _onMarkAsWatchedClick(evt) {
    evt.preventDefault();
    this._isWatched = !this._isWatched;
    const formData = new FormData(this._element.querySelector(`.film-card__controls`));
    const newData = this._processForm(formData);
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(newData);
    }
    return this.update(newData);
  }

  set onDetails(fn) {
    this._onDetails = fn;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  get template() {
    return `
      <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${moment(this._releaseDate).year()}</span>
          <span class="film-card__duration">${moment.duration(this._runtime * 60000).hours()}h&nbsp;${this._createDurationMinutes() ? `${moment.duration(this._runtime * 60000).minutes()}m` : ``}</span>
          <span class="film-card__genre">${this._genres.length ? this._genres[0] : `—`}</span>
        </p>
        <img src="./${this._picture}" alt="" class="film-card__poster">
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
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onMarkAsWatchedClick);
  }

  removeListeners() {
    this._element.querySelector(`.film-card__comments`).removeEventListener(`click`, this._onDetailsButtonClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`).removeEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`).removeEventListener(`click`, this._onMarkAsWatchedClick);
  }

  update(data) {
    this._commentsCount = data.comments.length;
    this._comment = data.comments;
    this._userRating = data.userRating;
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._updateCommentsCount();
  }

  static createMapper(target) {
    return {
      commentsCount: (value) => {
        target.commentsCount = value;
      },
      isWatched: (value) => {
        target.isWatched = value;
      },
      inWatchList: (value) => {
        target.inWatchList = value;
      }
    };
  }
}

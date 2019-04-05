import {Component} from '../component.js';
import {emojiList} from '../utils.js';
import moment from 'moment';

export class CardDetails extends Component {
  constructor(data) {
    super();
    this._number = data.number;
    this._title = data.title;
    this._originalTitle = data.originalTitle;

    this._rating = data.rating;
    this._ageRating = data.ageRating;
    this._userRating = data.userRating;

    this._picture = data.posterUrl;
    this._runtime = data.runtime;
    this._genres = data.genres;
    this._description = data.description;
    this._comment = data.comments;
    this._commentsCount = data.comments.length;

    this._releaseDate = data.releaseDate;
    this._releaseCountry = data.releaseCountry;

    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;

    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

    this._onDetailsClose = null;
    this._onCommentSend = null;
    this._onUserRatingSend = null;
    this._onDetailsCloseClick = this._onDetailsCloseClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
    this._onChangeUserRating = this._onChangeUserRating.bind(this);
    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
    this._onDetailsWatchedResetClick = this._onDetailsWatchedResetClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
      commentsCount: this._commentsCount,
      comment: this._comment,
      userRating: this._userRating,
      inWatchList: this._inWatchList,
      isWatched: this._isWatched
    };

    const taskEditMapper = CardDetails.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }
    return entry;
  }

  _createGenres() {
    return this._genres.map((genre) => `
    <span class="film-details__genre">${genre}</span>
    `.trim()).join(``);
  }

  _createComment() {
    const commentsOrder = this._comment.sort((a, b) => a.date - b.date);
    return commentsOrder.map((comment) => `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">${emojiList[comment.emoji]}</span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${moment(comment.date).toNow(true)} ago</span>
        </p>
      </div>
    </li>
    `.trim()).join(``);
  }

  _onChangeEmoji() {
    const newEmoji = this._element.querySelector(`.film-details__emoji-item:checked`).value;
    this._element.querySelector(`.film-details__add-emoji-label`).textContent = emojiList[newEmoji];
    return newEmoji;
  }

  createNewComment() {
    this._element.querySelector(`.film-details__comment-input`).style.borderColor = `#979797`;
    this._element.querySelector(`.film-details__comments-list`).innerHTML = this._createComment();
    this._element.querySelector(`.film-details__comments-count`).textContent = this._commentsCount;
  }

  _onAddComment(evt) {
    if (evt.ctrlKey && evt.keyCode === 13) {
      if (!evt.target.value.length < 1) {
        const newComment = evt.target.value;
        this._comment.push({
          author: `Anonymous`,
          text: newComment,
          emoji: this._onChangeEmoji(),
          date: new Date()
        });
        this._commentsCount = this._comment.length;
        evt.target.value = ``;

        const formData = new FormData(this._element.querySelector(`.film-details__inner`));
        const newData = this._processForm(formData);
        if (typeof this._onCommentSend === `function`) {
          this._onCommentSend(newData);
        }
      }
    }
  }

  _onChangeUserRating(evt) {
    [...this._element.querySelectorAll(`.film-details__user-rating-label`)].map((label) => {
      label.style.background = `#d8d8d8`;
    });
    this._element.querySelector(`.film-details__user-rating-input:checked + label`).style.background = `#ffe800`;
    this._userRating = evt.target.value;
    this._element.querySelector(`.film-details__user-rating`).innerHTML = `Your rate ${this._userRating}`;

    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onUserRatingSend === `function`) {
      this._onUserRatingSend(newData);
    }
  }

  _onDetailsCloseClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onDetailsClose === `function`) {
      this._onDetailsClose(newData);
    }
    return this.update(newData);
  }

  _onAddToWatchListClick() {
    this._inWatchList = !this._inWatchList;
  }

  _onMarkAsWatchedClick() {
    const detailsWatched = document.querySelector(`.film-details__watched-status`);
    this._isWatched = !this._isWatched;
    if (this._isWatched) {
      detailsWatched.classList.add(`film-details__watched-status--active`);
    } else {
      detailsWatched.classList.remove(`film-details__watched-status--active`);
    }
  }

  _onDetailsWatchedResetClick(evt) {
    evt.preventDefault();
    const detailsWatched = document.querySelector(`.film-details__watched-status`);
    if (this._isWatched) {
      this._isWatched = !this._isWatched;
      detailsWatched.classList.remove(`film-details__watched-status--active`);
      document.getElementById(`watched-${this._number}`).checked = false;
    }
  }

  shake() {
    this._element.querySelector(`.film-details__inner`).classList.add(`shake`);
    const ANIMATION_TIMEOUT = 600;

    setTimeout(() => {
      this._element.querySelector(`.film-details__inner`).classList.remove(`shake`);
    }, ANIMATION_TIMEOUT);
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  set onDetailsClose(fn) {
    this._onDetailsClose = fn;
  }

  set onCommentSend(fn) {
    this._onCommentSend = fn;
  }

  set onUserRatingSend(fn) {
    this._onUserRatingSend = fn;
  }

  get template() {
    return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._picture}" alt="${this._title}">

              <p class="film-details__age">${this._ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: ${this._originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._rating}</p>
                  <p class="film-details__user-rating">Your rate ${this._userRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this._director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${this._writers.length ? this._writers.join(`, `) : `—`}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._actors.length ? this._actors.join(`, `) : `—`}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)} (${this._releaseCountry})</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${moment.duration(this._runtime * 60000).asMinutes()} min</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this._releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">${this._createGenres(this._genres)}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${this._description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist-${this._number}" name="watchlist" ${this._inWatchList ? `checked` : ``}>
            <label for="watchlist-${this._number}" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched-${this._number}" name="watched" ${this._isWatched ? `checked` : ``}>
            <label for="watched-${this._number}" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite-${this._number}" name="favorite" ${this._isFavorite ? `checked` : ``}>
            <label for="favorite-${this._number}" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>

          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${this._createComment()}
            </ul>

            <div class="film-details__new-comment">
              <div>
                <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
                <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
                  <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
                  <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
                </div>
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
              </label>
            </div>
          </section>

          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls">
              <span class="film-details__watched-status ${this._isWatched ? `film-details__watched-status--active` : ``}">Already watched</span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="${this._picture}" alt="film-poster" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this._title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-${this._number}-1" ${this._userRating * 1 === 1 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-1">1</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-${this._number}-2" ${this._userRating * 1 === 2 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-2">2</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-${this._number}-3" ${this._userRating * 1 === 3 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-3">3</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-${this._number}-4" ${this._userRating * 1 === 4 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-4">4</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-${this._number}-5" ${this._userRating * 1 === 5 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-5">5</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-${this._number}-6" ${this._userRating * 1 === 6 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-6">6</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-${this._number}-7" ${this._userRating * 1 === 7 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-7">7</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-${this._number}-8" ${this._userRating * 1 === 8 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-8">8</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-${this._number}-9" ${this._userRating * 1 === 9 ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-9">9</label>
                </div>
              </section>
            </div>
          </section>
        </form>
      </section>
    `.trim();
  }

  createListeners() {
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onDetailsCloseClick);
    this._element.querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._onMarkAsWatchedClick);
    this._element.querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._onDetailsWatchedResetClick);
    [...this._element.querySelectorAll(`.film-details__emoji-item`)].map((item) => {
      item.addEventListener(`click`, this._onChangeEmoji);
    });
    this._element.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddComment);
    [...this._element.querySelectorAll(`.film-details__user-rating-input`)].map((input) => {
      input.addEventListener(`click`, this._onChangeUserRating);
    });
  }

  removeListeners() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onDetailsCloseClick);
    this._element.querySelector(`.film-details__control-label--watchlist`).removeEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-details__control-label--watched`).removeEventListener(`click`, this._onMarkAsWatchedClick);
    this._element.querySelector(`.film-details__watched-reset`).removeEventListener(`click`, this._onDetailsWatchedResetClick);
    [...this._element.querySelectorAll(`.film-details__emoji-item`)].map((item) => {
      item.removeEventListener(`click`, this._onChangeEmoji);
    });
    this._element.querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._onAddComment);
    [...this._element.querySelectorAll(`.film-details__user-rating-input`)].map((input) => {
      input.removeEventListener(`click`, this._onChangeUserRating);
    });
  }

  update(data) {
    this._commentsCount = data.commentsCount;
    this._comment = data.comment;
    this._userRating = data.userRating;
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
  }

  static createMapper(target) {
    return {
      comment: (value) => {
        target.comment[value] = value;
      },
      commentsCount: (value) => {
        target.commentsCount = value;
      },
      userRating: (value) => {
        target.userRating = value;
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

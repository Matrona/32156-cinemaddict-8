import {Component} from '../component.js';
import moment from 'moment';

export class CardDetails extends Component {
  constructor(data) {
    super();
    this._number = data.number;
    this._title = data.title;
    this._rating = data.rating;
    this._userRating = data.userRating;
    this._picture = data.picture;
    this._runtime = data.runtime;
    this._genre = data.genre;
    this._description = data.description;
    this._commentsCount = data.comment.length;
    this._comment = data.comment;
    this._releaseDate = data.releaseDate;

    this._onDetailsClose = null;
    this._onDetailsCloseClick = this._onDetailsCloseClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
    this._onChangeUserRating = this._onChangeUserRating.bind(this);
  }

  _createComment() {
    return this._comment.map((comment) => `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">${comment.emoji}</span>
      <div>
        <p class="film-details__comment-text">${comment.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${comment.date}</span>
        </p>
      </div>
    </li>
    `.trim()).join(``);
  }

  _processForm(formData) {
    const entry = {
      commentsCount: this._commentsCount,
      comment: this._comment,
      userRating: this._userRating
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

  _onChangeEmoji() {
    const newEmoji = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    this._element.querySelector(`.film-details__add-emoji-label`).textContent = newEmoji;
    return newEmoji;
  }

  _onAddComment(evt) {
    if (evt.ctrlKey && evt.keyCode === 13) {
      if (!evt.target.value.length < 1) {
        const newComment = evt.target.value;
        this._comment.push({
          author: `Anonymous`,
          text: newComment,
          emoji: this._onChangeEmoji(),
          date: moment().fromNow()
        });
        this._commentsCount = this._comment.length;
        evt.target.value = ``;
        this._element.querySelector(`.film-details__comments-list`).innerHTML = this._createComment();
        this._element.querySelector(`.film-details__comments-count`).textContent = this._commentsCount;
      }
    }
  }

  _onChangeUserRating(evt) {
    this._userRating = evt.target.value;
    this._element.querySelector(`.film-details__user-rating`).innerHTML = `Your rate ${this._userRating}`;
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

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  set onDetailsClose(fn) {
    this._onDetailsClose = fn;
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
              <img class="film-details__poster-img" src="images/posters/${this._picture}" alt="${this._title}">

              <p class="film-details__age">18+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._title}</h3>
                  <p class="film-details__title-original">Original: Невероятная семейка</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._rating}</p>
                  <p class="film-details__user-rating">Your rate ${this._userRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">Brad Bird</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">Brad Bird</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">Samuel L. Jackson, Catherine Keener, Sophia Bush</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(this._releaseDate).format(`DD MMMM YYYY`)} (USA)</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${moment.duration(this._runtime).asMinutes()} min</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">USA</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">Animation</span>
                    <span class="film-details__genre">Action</span>
                    <span class="film-details__genre">Adventure</span></td>
                </tr>
              </table>

              <p class="film-details__film-description">${this._description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
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
              <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
              <button class="film-details__watched-reset" type="button">undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="images/posters/${this._picture}" alt="film-poster" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${this._title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">
                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-${this._number}-1" ${this._userRating === `1` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-1">1</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-${this._number}-2" ${this._userRating === `2` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-2">2</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-${this._number}-3" ${this._userRating === `3` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-3">3</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-${this._number}-4" ${this._userRating === `4` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-4">4</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-${this._number}-5" ${this._userRating === `5` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-5">5</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-${this._number}-6" ${this._userRating === `6` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-6">6</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-${this._number}-7" ${this._userRating === `7` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-7">7</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-${this._number}-8" ${this._userRating === `8` ? `checked` : ``}>
                  <label class="film-details__user-rating-label" for="rating-${this._number}-8">8</label>

                  <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-${this._number}-9" ${this._userRating === `9` ? `checked` : ``}>
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
      }
    };
  }
}

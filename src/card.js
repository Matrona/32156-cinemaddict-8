const createDurationMinutes = (minute) => {
  if (minute <= 5) {
    return false;
  }
  return true;
};

export default (data) => `
  <article class="film-card">
    <h3 class="film-card__title">${data.title}</h3>
    <p class="film-card__rating">${data.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${data.year}</span>
      <span class="film-card__duration">${data.duration.hours}h&nbsp;${createDurationMinutes(data.duration.minutes) ? `${data.duration.minutes}m` : ``}</span>
      <span class="film-card__genre">${data.genre}</span>
    </p>
    <img src="./images/posters/${data.picture}" alt="" class="film-card__poster">
    <p class="film-card__description">${data.description}</p>
    <button class="film-card__comments">${data.comments} comments</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>
  </article>
`;

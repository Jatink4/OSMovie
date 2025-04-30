import { api_key } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const container = document.getElementById("watchlist-container");
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

if (watchlist.length === 0) {
  container.innerHTML = `<p style="color:white; font-size: 1.5rem;">Your watchlist is empty.</p>`;
} else {
  watchlist.forEach(movieId => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`)
      .then(res => res.json())
      .then(movie => {
        const card = createMovieCard(movie);

        // Create wrapper div to hold card and button
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "card-wrapper";
        cardWrapper.style.position = "relative";

        // Add remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖";
        removeBtn.className = "remove-btn";
        removeBtn.style.marginTop = "10px";
        removeBtn.style.position = "absolute";
        removeBtn.style.top = "10px";
        removeBtn.style.right = "10px";
        removeBtn.dataset.id = movie.id;

        removeBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          event.preventDefault();

          watchlist = watchlist.filter(id => Number(id) !== Number(movie.id));
          localStorage.setItem("watchlist", JSON.stringify(watchlist));
          cardWrapper.remove();

          if (watchlist.length === 0) {
            container.innerHTML = `<p style="color:white; font-size: 1.5rem;">Your watchlist is empty.</p>`;
          }
        });

        cardWrapper.appendChild(card);
        cardWrapper.appendChild(removeBtn);
        container.appendChild(cardWrapper);
      });
  });
}
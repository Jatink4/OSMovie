import{api_key,imageBaseURL,fetchDataFromServer}from"./api.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";


const movieId=window.localStorage.getItem("movieId");
const pageContent=document.querySelector("[page-content]");
sidebar();

const getGenres=function(genreList){
    const newGenreList=[];
    for(const{name}of genreList) newGenreList.push(name);
    return newGenreList.join(",");
}
const getCasts=function(castList){
    const newCastList=[];
    for(let i=0,len= castList.length; i<len && i<10;i++){
        const{name}=castList[i];
        newCastList.push(name);
    }
    return newCastList.join(",");
}

const getDirectors=function(crewList){
    const directors =crewList.filter(({job})=>job==="Director");
    const directorList = [];
    for(const {name} of directors) directorList.push(name);
    return directorList.join(",");
}



fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,function(movie){
    const{
    backdrop_path,
    poster_path,
    title,
    release_date,
    runtime,
    vote_average,
    releases:{countries:[{certification}]},
    genres,
    overview,
    casts:{cast,crew},
    }=movie;
    document.title=`${title}-One Stop Movie`;
    const movieDetail=document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML=`
    <div class="backdrop-image" style="background-image: url('${imageBaseURL}${"w1280"||"original"}${backdrop_path || poster_path}')"></div>
    <div class="detail-center">
            <figure class="poster-box movie-poster">
            <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover"> 
            </figure>
            <div class="detail-box">
                <div class="detail-content">
                    <h1 class="heading">${title}</h1>
                    <div class="meta-list">
                        <div class="meta-item">
                            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
                            <span class="span">${vote_average.toFixed(1)}</span>
                        </div>
                        <div class="separator"></div>
                        <div class="meta-item">${runtime}m</div>
                        <div class="separator"></div>
                        <div class="meta-item">${release_date.split("-")[0]}</div>
                        <div class="meta-item card-badge">${certification}</div>

                    </div>
                    <p class="genre">${getGenres(genres)}</p>
                    <P class="overview">${overview}</P>
                        <ul class="detail-list">
                            <div class="list-item">
                                <p class="list-name">Starring</p>
                                <p>	${getCasts(cast)}</p>

                            </div>
                            <div class="list-item">
                                <p class="list-name">Directed By</p>
                                <p>	${getDirectors(crew)}</p>
                                
                            </div>
                            <!-- Watch Trailer Button -->
                            <div class="watchtlistraler">
<button id="watchTrailerBtn" class="trailer-btn"> Watch Trailer</button>
<button id="addToWatchlistBtn" class="watchlist-btn" data-id="${movieId}">Add to Watchlist</button>
</div>


<!-- Trailer Modal -->
<div id="trailerModal" class="modal">
  <div class="modal-content">
  
    <span class="close-btn">&times;</span>
    <iframe
      id="trailer-frame"
      width="560"
      height="315"
      src=""
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</div>

                        </ul>
                </div>
                </div>
            </div>
    `;
    
    pageContent.appendChild(movieDetail);
    //return all trailer and treaser as array
const watchBtn = document.getElementById("watchTrailerBtn");
const trailerModal = document.getElementById("trailerModal");
const trailerFrame = document.getElementById("trailer-frame");

const closeBtn = document.querySelector(".close-btn");

watchBtn.addEventListener("click", () => {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${api_key}`)
    .then(res => res.json())
    .then(data => {
      const trailer = data.results.find(
        vid => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) {
        trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}`;
        trailerModal.style.display = "block";
      } else {
        alert("Trailer not available.");
      }
    });
});

closeBtn.onclick = function () {
  trailerModal.style.display = "none";
  trailerFrame.src = ""; // Stop video
};

window.onclick = function (event) {
  if (event.target == trailerModal) {
    trailerModal.style.display = "none";
    trailerFrame.src = "";
  }
};

pageContent.addEventListener("click", function (event) {
    if (event.target.classList.contains("watchlist-btn")) {
      const movieId = parseInt(event.target.dataset.id);
  
      let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  
      if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert("Added to Watchlist!");
      } else {
        alert("Already in Watchlist!");
      }
    }
  });

  

});



search();

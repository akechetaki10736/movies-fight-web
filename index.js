const autocompleteConfig = {
    renderOption (movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${ imgSrc }" />
            ${ movie.Title } (${ movie.Year })
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com', {
            params: {
                apikey: 'b7f53c15',
                s: searchTerm
            }
        });
        const { Error, Search } = response.data;
    
        if (Error) 
            return [];
    
        return Search;
    }
};

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async ({ imdbID }, summaryElement, side) => {
    const { data } = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: 'b7f53c15',
            i: imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(data);

    if (side === 'left') {
        leftMovie = data;
    } else {
        rightMovie = data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = leftStat.dataset.value.includes('.') ? parseFloat(leftStat.dataset.value): parseInt(leftStat.dataset.value);
        const rightSideValue = rightStat.dataset.value.includes('.') ? parseFloat(rightStat.dataset.value): parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');           
        }
    });


}

const movieTemplate = (movieDetail) => {
    const { Poster, Title, Genre, Plot, Awards, BoxOffice, Metascore, imdbRating, imdbVotes } = movieDetail;
    const dollars = parseInt(BoxOffice.replace(/\$/g, '').replace(/,/g, '')); //regEx
    const metaScore = parseInt(Metascore);
    const imdbRatingFloat = parseFloat(imdbRating);
    const imdbVotesInt = parseInt(imdbVotes.replace(/,/g, ''));
    
    const awards = Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);


    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${Title}</h1>
                    <h4>${Genre}</h4>
                    <p>${Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${Metascore}</p>
            <p class="subtitle">Meta Score</p>
        </article>
        <article data-value=${imdbRatingFloat} class="notification is-primary">
            <p class="title">${imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotesInt} class="notification is-primary">
            <p class="title">${imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

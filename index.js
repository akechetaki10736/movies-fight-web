const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: 'b7f53c15',
            s: searchTerm
        }
    });
    const { data } = response;

    if (data.Error) 
        return [];

    return data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>        
        </div>
    </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (event) => {
    const movies = await fetchData(event.target.value);   
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    movies.forEach(movie => {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item')
        option.innerHTML = `
            <img src="${ imgSrc }" />
            ${ movie.Title }
        `;
    
        resultsWrapper.appendChild(option);
    });
};

input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
})

    // for (const movie of movies) {
    //     const div = document.createElement('div');

    //     div.innerHTML = `
    //         <img src="${ movie.Poster }" />
    //         <h1>${ movie.Title }</h1>
    //     `;

    //     document.querySelector('#target').appendChild(div);
    // }
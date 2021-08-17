const urlBase = "https://api.punkapi.com/v2/beers?page="
const filterABV = document.getElementById("filterABV")
const filterIBU = document.getElementById("filterIBU")
const pageText = document.getElementById("pageNumber")
const prevPage = document.getElementById("prevPage")
const nextPage = document.getElementById("nextPage")
const filters = document.getElementById("filters")
const filterBtn = document.getElementById("filter__btn")
const filterBtnMenu = document.getElementById("filter__btn--menu")
const filterBtnClose = document.getElementById("filter__btn--close")
const beerCloseBtn = document.getElementById("beer__close")
const overlay = document.getElementById("overlay")

let optionsABV = "", optionsIBU = "", page = 1

// toggle filter menu on small screens
const toggleFilters = () => {
  filters.classList.add('filters--animatable')
  if(!filters.classList.contains('filters--visible')) {
    filters.classList.add('filters--visible')
    filterBtnMenu.style.display = 'none'
    filterBtnClose.style.display = 'block'
  } else {
    filters.classList.remove('filters--visible')
    filterBtnMenu.style.display = 'block'
    filterBtnClose.style.display = 'none'
  }
}

const removeAnimatable = () => {
  filters.classList.remove('filters--animatable')
}

filters.addEventListener('transitionend', removeAnimatable)
filterBtn.addEventListener('click', toggleFilters)

// filter ABV
filterABV.addEventListener("change", e => {
   const value = e.target.value
   
   switch (value) {
        case "all":
            optionsABV = ""
            break
        case "low":
            optionsABV = "&abv_lt=4.6"
            break
        case "medium":
            optionsABV = "&abv_gt=4.5&abv_lt=7.6"
            break
        case "high":
            optionsABV = "&abv_gt=7.5"
            break
   }
   
   page = 1;
   getBeers();
});

// filter IBU
filterIBU.addEventListener("change", e => {
   const value = e.target.value; 
   
   switch (value) {
        case "all":
            optionsIBU = ""
            break
        case "low":
            optionsIBU = "&ibu_lt=35"
            break
        case "medium":
            optionsIBU = "&ibu_gt=34&ibu_lt=75"
            break
        case "high":
            optionsIBU = "&ibu_gt=74"
            break
   }
   
   page = 1;
   getBeers();
});

// fetch & create beers
async function getBeers() {
    const url = urlBase + page + optionsABV + optionsIBU + `&per_page=24`;
    const beerPromise = await fetch(url)
    const beers = await beerPromise.json()
    pageText.innerText = page
    
    if(page === 1) {
        prevPage.disabled = true
    } else {
        prevPage.disabled = false
    }
    if(beers.length < 24) {
        nextPage.disabled = true
    } else {
        nextPage.disabled = false
    }

    const beersDiv = document.querySelector('.beers')
    beersDiv.replaceChildren()
    
    const genericBottle = 'images/genericBottle.png'

    beers.forEach(beerItem => {
      const beer = document.createElement('div')
      beer.className = 'beer'
      beer.addEventListener('click', expand)
      beer.addEventListener('load', expand)

      let beerHtml = `  
        <img class='beer__img' src='${beerItem.image_url ? beerItem.image_url : genericBottle}'>
        <h3 class='beer__title' >${beerItem.name}</h3>
        <span class='beer__info'>
          <span>ABV: ${beerItem.abv}%</span>
          <span>IBU: ${beerItem.ibu}</span>
        </span>
        <div class='beer__content'>
          <div class='beer__name'>${beerItem.name}</div>
          <div class='beer__tagline'>${beerItem.tagline}</div>
          <div class='beer__description'>${beerItem.description}</div>
          <div class='beer__food-pairing'>
              Pair with: ${beerItem.food_pairing.join(', ')}
          </div>
        </div>   
       `; 
       
      beer.innerHTML = beerHtml      
      beersDiv.append(beer)
    });
}

// pagination
prevPage.addEventListener('click', () => {
    page--;
    getBeers();
});
nextPage.addEventListener('click', () => {
    page++;
    getBeers();
});

// expand card
const expand = (e) => {
  const card = e.currentTarget
  const cardClone = card.cloneNode(true)
  cardClone.classList.add('beer__expanded')
  
  const beerCloseBtn = document.createElement('div')
  beerCloseBtn.className = 'beer__close'
  cardClone.appendChild(beerCloseBtn)
  
  overlay.appendChild(cardClone)
  overlay.style.display = 'block'
  
  beerCloseBtn.addEventListener('click', () => {
    overlay.style.display = 'none'
    cardClone.remove()
  })
}

// initial get
getBeers();



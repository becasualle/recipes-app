// search form
const submit = document.getElementById('submit');
// user search input field
const search = document.getElementById('search');
// random button
const random = document.getElementById('random');
// search result title
const resultHeading = document.getElementById('result-heading');
// search result meal images
const mealsEl = document.getElementById('meals');
// selected meal-details section
const single_mealEl = document.getElementById('single-meal');

// 1. SHOW SEARCH RESULTS

// Get user term. If not empty - build response, else show alert.
const searchMeal = e => {
    e.preventDefault();

    // Clear single meal details when doing new search
    if(!mealsEl.innerHTML == ''){
        single_mealEl.innerHTML = '';
      }

    // Get search term
    const term = search.value;
    
    // Check for empty 
    if(term.trim()){
        buildSearchResponse(term);
        // Clear search text
        search.value = '';
    } else {
        showAlert();
    }

}

// Fetch from API and build HTML for response
const buildSearchResponse = async term => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const data = await response.json();
    // build results title
    resultHeading.innerHTML=`<h2>Search results for '${term}':</h2>`
    // build results images
    if(data.meals === null){
        resultHeading.innerHTML=`<p>There are no search results. Try again!</p>`;
    } else {
        const mealsHTMLArr = data.meals.map(meal => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt = "${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        `)
        const mealsHTML = mealsHTMLArr.join('');
        mealsEl.innerHTML = mealsHTML;
    }
}

// Show alert if search input was empty when submitted
const showAlert = () => {
    if (!resultHeading.innerHTML == '') {
        const resultHeadingSave = resultHeading.innerHTML;
        resultHeading.innerHTML =
          "<p>Please don't leave the search box empty</p>";
        setTimeout(() => {
          resultHeading.innerHTML = resultHeadingSave;
        }, 2000);
      } else {
        resultHeading.innerHTML =
          "<p>Please don't leave the search box empty</p>";
        setTimeout(() => {
          resultHeading.innerHTML = '';
        }, 2000);
      }
}

// 2. SHOW DETAILED INFO ABOUT MEAL

// Get ID of meal that we clicked on
const getMealID = e => {
    // get meal element and it's id (data-meailID)
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    }
}

// Get data about meal from API

const getMealByID = async mealID => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();
    const meal = data.meals[0];
    addMealToDOM(meal)
};

// Show meal recipe in our page
const addMealToDOM = meal => {
    const ingredients = [];

    // convert ingredient properties to array that we can work with
    for(let i = 1; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}` : ''}
                ${meal.strArea ? `<p>${meal.strArea}` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

// 3. GENERATE RANDOM MEAL

// Fetch random meal form API
const getRandomMeal = async () => {
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    const meal = data.meals[0];
    addMealToDOM(meal);
};

// Add Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', getMealID);

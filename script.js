const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-Btn');
//Function to get recipes

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes....</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";

        if (!response.meals) {
            recipeContainer.innerHTML = "<h2>:( No recipes found. Please try another search.</h2>";
            return;
        }

        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory} Category</span></p>
            `;

            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding Event listener to recipe
            button.addEventListener('click', () => {
                openRecipePopUp(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>:( No recipes found. Please try another search.</h2>";
    }
};

//function to fecth ingredents
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

const getYouTubeEmbedURL = (youtubeUrl) => {
    if (!youtubeUrl) return null;
    const videoId = youtubeUrl.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const openRecipePopUp = (meal) => {
    const embedURL = getYouTubeEmbedURL(meal.strYoutube);

    recipeDetailsContent.innerHTML = `
        <h2 class="recipename">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeinstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        ${embedURL ? `
        <div style="margin-top: 20px; display: flex; justify-content: center;">
            <iframe width="100%" height="315" 
                src="${embedURL}" 
                title="YouTube recipe video" 
                frameborder="0" 
                allowfullscreen
                style="max-width: 100%; border-radius: 10px;">
            </iframe>
        </div>` : ''}
    `;

    recipeDetailsContent.parentElement.style.display = "block";
};

//close button

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});

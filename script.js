const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-Btn');
//Function to get recipes

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes....</h2>";
    try{
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = "";

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
        })



        recipeContainer.appendChild(recipeDiv);
        
    });
}catch (error){
    recipeContainer.innerHTML = "<h2>:( No recipes found. Please try another search.</h2>";
}
}

//function to fecth ingredents
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for(let i=1;i<=20;i++)
    {
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient)
        {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`

        }
        else{
            break;
        }
    }
    return ingredientsList;
}



const openRecipePopUp = (meal) => {
    recipeDetailsContent.innerHTML = `
    <h2 class="recipename">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeinstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        </div>

    `

    recipeDetailsContent.parentElement.style.display = "block";
}

//close button
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none"
})

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML = `<h2>Type the mile in the search box.</h2>`; //if user puts nothing in the search box then thwy will see this error
        return;
    }
    fetchRecipes(searchInput);
});
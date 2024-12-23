// import { MyStorageService } from "./MyStorageService";

class App {
    constructor() {
        this.initialVariables();
        this.addEvents();
        debugger;
        this.updateWishlist();

    }

    initialVariables() {
        const body = document.body;

        //search Variables 
        this.searchButton = body.querySelector('#searchButton');
        this.searchInput = body.querySelector('#buttonWrapper input');
        this.ulResultOfSearching = document.getElementById("ulResultDiv");
        this.searchResultDiv = document.getElementById("searchResultDiv");

        this.recipeDiv = document.querySelector('#recipeDiv');
        this.shoppingListUL = document.querySelector('#shoppingListDiv ul');
    }
    addEvents() {
        this.searchButton.addEventListener('click', () => {
            this.updateResultsOfSearching(this.searchInput.value);

        })
        this.searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.updateResultsOfSearching(this.searchInput.value)
            }
        })
    }
    hideVideos() {
        const videoResultDiv = document.querySelector("#searchResultDiv video");
        const videoShoppingDiv = document.querySelector("#shoppingListDiv video");
        const backgroundVideo = document.querySelector("#backgroundVideo");

        backgroundVideo.style.display = "block";
        videoResultDiv.style.display = "none";
        videoShoppingDiv.style.display = "none";
    }
    async updateResultsOfSearching(dataTOsearch) {//update Searching list
        this.hideVideos();

        const recipeDataResult = await useApiFood("searchFood", dataTOsearch);

        const titleResultDiv = document.querySelector("#titleResultDiv");
        titleResultDiv.style.display = "flex";
        this.ulResultOfSearching.style.display = "flex";

        // this.ulResultOfSearching.innerHTML = "";

        const frag = document.createDocumentFragment();

        recipeDataResult.forEach(recipe => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            const div = document.createElement("div");
            const h2 = document.createElement("h4");
            li.appendChild(img);
            li.appendChild(div);
            div.appendChild(h2);

            li.id = recipe.id;
            img.src = recipe.image;
            h2.textContent = recipe.title;

            frag.appendChild(li);
        });
        this.ulResultOfSearching.replaceChildren(frag);

        this.ulResultOfSearching.addEventListener("click", (event) => {
            const clickedLi = event.target.closest("li");
            if (clickedLi) {
                const recipe = recipeDataResult.find(r => r.id == clickedLi.id);
                if (recipe) {
                    this.updateInformationAboutRecipe(recipe);
                } else {
                    console.error("Error on updateResultsOfSearching -> this.ulResultOfSearching.addEventListener");
                }
            }
        })
    }
    async updateInformationAboutRecipe(recipe) {//update Information list
        this.removePreviousData();
        this.hideVideos();


        let data = await useApiFood("recipeInfo", recipe.id);

        const frag = document.createDocumentFragment();

        const titleRecipe = document.createElement("div")
        titleRecipe.id = "titleRecipe";

        const h2 = document.createElement("h2");
        h2.textContent = data.title;
        const img = document.createElement("img");
        img.src = data.image;

        titleRecipe.appendChild(h2);
        titleRecipe.appendChild(img);

        frag.appendChild(titleRecipe);
        //--------
        const helpBarRecipe = document.createElement("div")

        helpBarRecipe.id = "helpBarRecipe";

        const timeDataDiv = document.createElement("div")
        timeDataDiv.id = "timeDataDiv";
        const timeDataDivImg = document.createElement("img");
        timeDataDivImg.src = "images/clock.png";
        timeDataDiv.timeDataDivImg;
        const p = document.createElement("p");
        p.textContent = `${data.readyInMinutes} MINUTES`;

        timeDataDiv.appendChild(timeDataDivImg);
        timeDataDiv.appendChild(p);

        helpBarRecipe.appendChild(timeDataDiv);
        // --------
        const servingsDataDiv = document.createElement("div");
        servingsDataDiv.id = "servingsDataDiv";
        const servingsDataDivImg = document.createElement("img");

        servingsDataDivImg.src = "images/people.png";
        servingsDataDiv.appendChild(servingsDataDivImg);

        const secondP = document.createElement("p");
        secondP.textContent = `${data.servings} servings`
        const buttonM = document.createElement("button");
        buttonM.textContent = "-";

        buttonM.addEventListener("click", () => {
            data = this.updateRecipeForServings(data, parseInt(data.servings) - 1);
            this.updateServingsData(data);
        });
        const buttonP = document.createElement("button");
        buttonP.textContent = "+";

        buttonP.addEventListener("click", () => {
            data = this.updateRecipeForServings(data, parseInt(data.servings) + 1);
            this.updateServingsData(data);
        });
        servingsDataDiv.appendChild(secondP);
        servingsDataDiv.appendChild(buttonM);
        servingsDataDiv.appendChild(buttonP);

        helpBarRecipe.appendChild(servingsDataDiv);

        //-----

        const addWishlistDiv = document.createElement("div")
        addWishlistDiv.id = "addWishlistDiv";
        const addWishlistDivButton = document.createElement("button");
        if (this.recipeExistOnWishlist(recipe)) {
            addWishlistDivButton.setAttribute("id", "onWishlist");

        } else {
            addWishlistDivButton.removeAttribute("id");

        }
        addWishlistDivButton.innerHTML = "&#9829;";

        addWishlistDivButton.addEventListener("click", () => {
            this.addORremoveRecipeToLocalStorage(recipe);
        })
        addWishlistDiv.appendChild(addWishlistDivButton);

        helpBarRecipe.appendChild(addWishlistDiv);

        frag.appendChild(helpBarRecipe);


        //----------

        const recipeDataDiv = document.createElement("div")
        recipeDataDiv.id = "recipeDataDiv";

        const ul = document.createElement("ul");

        data.extendedIngredients.forEach(element => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            const p = document.createElement("p");

            img.src = "images/check.png";
            p.textContent = `${element.amount.toFixed(2)} ${element.unit} ${element.name}`;

            li.appendChild(img);
            li.appendChild(p);
            ul.appendChild(li);
        });
        recipeDataDiv.appendChild(ul);

        const divAddToCart = document.createElement("div");
        const buttonAddToCart = document.createElement("button");
        buttonAddToCart.innerHTML = "&#128722; Add to cart";

        buttonAddToCart.addEventListener("click", () => {
            console.log(data);

            this.addRecipeItemsForShoppingCart(data);
        })
        divAddToCart.appendChild(buttonAddToCart);
        recipeDataDiv.appendChild(divAddToCart);

        frag.appendChild(recipeDataDiv);

        const recipeLinkDiv = document.createElement("div");
        recipeLinkDiv.id = "recipeLinkDiv";

        const h2RecipeLinkDiv = document.createElement("h2");
        h2RecipeLinkDiv.textContent = "HOW TO COOK IT";
        const pRecipeLinkDiv = document.createElement("p");
        pRecipeLinkDiv.textContent = `This recipe was carefully designed and tested by ${data.sourceName}. Please check out directions their website.`
        const buttonRecipeLinkDiv = document.createElement("a");
        buttonRecipeLinkDiv.href = data.sourceUrl;
        buttonRecipeLinkDiv.innerHTML = "DIRECTIONS &#8594;"

        recipeLinkDiv.appendChild(h2RecipeLinkDiv);
        recipeLinkDiv.appendChild(pRecipeLinkDiv);
        recipeLinkDiv.appendChild(buttonRecipeLinkDiv);

        frag.appendChild(recipeLinkDiv);

        if (this.recipeDiv.firstChild) {
            this.recipeDiv.insertBefore(frag, this.recipeDiv.firstChild);
        }

    }
    updateServingsData(data) {
        const frag = document.createDocumentFragment();
        const recipeDataUL = document.querySelector("#recipeDataDiv ul");
        const servingsDataP = document.querySelector("#servingsDataDiv p");

        servingsDataP.textContent = `${data.servings} servings`;
        recipeDataUL.innerHTML = "";

        data.extendedIngredients.forEach(element => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            const p = document.createElement("p");

            img.src = "images/check.png";
            p.textContent = `${element.amount.toFixed(2)} ${element.unit} ${element.name}`;

            li.appendChild(img);
            li.appendChild(p);
            frag.appendChild(li);
        });
        recipeDataUL.appendChild(frag);
    }
    removePreviousData() {
        console.log("this.removePreviousData");

        const welcomeSection = document.querySelector("#welcomeSection");
        welcomeSection.style.display = "none";

        const titleRecipe = document.querySelector("#titleRecipe");
        const helpBarRecipe = document.querySelector("#helpBarRecipe");
        const recipeDataDiv = document.querySelector("#recipeDataDiv");
        const recipeLinkDiv = document.querySelector("#recipeLinkDiv");

        if (titleRecipe && helpBarRecipe && recipeDataDiv && recipeLinkDiv) {
            this.recipeDiv.removeChild(titleRecipe);
            this.recipeDiv.removeChild(helpBarRecipe);
            this.recipeDiv.removeChild(recipeDataDiv);
            this.recipeDiv.removeChild(recipeLinkDiv);
        }
    }
    addORremoveRecipeToLocalStorage(recipe) {
        // let dataRecipesLS = MyStorageService.getRecipes();
        debugger;

        const addWishlistDivButton = document.querySelector("#addWishlistDiv button");

        // if (!dataRecipesLS) {
        //     dataRecipesLS = [];
        // }

        const exist = MyStorageService.recipeExist(recipe.id);

        if (exist) {
            MyStorageService.removeRecipe(recipe.id);

            if (addWishlistDivButton) {
                addWishlistDivButton.removeAttribute("id");
            }
        }
        else {
            MyStorageService.addRecipe(recipe)
            if (addWishlistDivButton) {
                addWishlistDivButton.setAttribute("id", "onWishlist");
            }
        }
        this.updateWishlist();
    }
    recipeExistOnWishlist(recipe) {
        let dataRecipesLS = localStorage.getItem("Recipes");
        if (!dataRecipesLS) return false;
        dataRecipesLS = JSON.parse(dataRecipesLS);

        return dataRecipesLS.some(tempRecipe => tempRecipe.id === parseInt(recipe.id));
    }
    updateWishlist() {
        let ul = document.querySelector("#wishlistPopup ul");
        if(ul){
            ul.remove();
        }
        ul = document.createElement("ul");
        document.querySelector("#wishlistPopup").appendChild(ul);
        
        ul.innerHTML = "";
        let recipes = MyStorageService.getRecipes();
        const frag = document.createDocumentFragment();

        if (recipes) {
            recipes.forEach(recipe => {
                const li = document.createElement("li");
                li.id = recipe.id;
                const img = document.createElement("img");
                const nameRecipeWrapperWishlist = document.createElement("div");
                nameRecipeWrapperWishlist.id = "nameRecipeWrapperWishlist"
                const h2 = document.createElement("h4");
                const buttonWrapperWishlist = document.createElement("div");
                buttonWrapperWishlist.id = "buttonWrapperWishlist"

                const buttonDel = document.createElement("button");
                buttonDel.id = "buttonDelLiWishlist"
                buttonDel.innerHTML = "&#128465;"

                buttonWrapperWishlist.appendChild(buttonDel);

                li.appendChild(img);
                li.appendChild(nameRecipeWrapperWishlist);
                nameRecipeWrapperWishlist.appendChild(h2);
                li.appendChild(buttonWrapperWishlist);

                img.src = recipe.image;
                h2.textContent = recipe.title;

                frag.appendChild(li);
            });

            // ul.appendChild(frag);
            ul.replaceChildren(frag);

            ul.addEventListener('click', (event) => {
                const target = event.target;
                const clickedLi = target.closest("li");
                
                if (clickedLi) {
                    const recipe = recipes.find(r => r.id == clickedLi.id);
                    if (target.id == "buttonDelLiWishlist") {
                        if (clickedLi) {
                            this.addORremoveRecipeToLocalStorage(recipe)
                            clickedLi.remove();
                        }
                    }
                    else {
                        this.updateInformationAboutRecipe(recipe);
                    }
                }
            })
        }
    }
    updateRecipeForServings(recipe, newServings) {
        const originalServings = recipe.servings;
        const scalingFactor = newServings / originalServings;

        const updatedIngredients = recipe.extendedIngredients.map(ingredient => ({
            ...ingredient,
            amount: ingredient.amount * scalingFactor
        }));

        return {
            ...recipe,
            servings: newServings,
            extendedIngredients: updatedIngredients
        };
    }
    addRecipeItemsForShoppingCart(data) {
        data.extendedIngredients.forEach(element => {

            const existingLi = Array.from(this.shoppingListUL.children).find(li => {
                const p = li.querySelector('p');
                return p && p.textContent === element.name;
            });

            if (existingLi) {
                const input = existingLi.querySelector('input');
                const currentValue = parseFloat(input.value);
                input.value = (currentValue + element.amount).toFixed(2);
            } else {
                const li = document.createElement("li");
                const div = document.createElement("div");
                const input = document.createElement("input");
                const span = document.createElement("span");
                const p = document.createElement("p");
                const button = document.createElement("button");

                input.setAttribute("type", "number");
                input.setAttribute("step", element.amount / data.servings);
                input.setAttribute("min", element.amount / data.servings);
                
                input.setAttribute("value", element.amount);
                // input.setAttribute("readonly", true);
                input.addEventListener('keydown', (event) => {
                    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
                        event.preventDefault();
                    }
                });
                input.addEventListener('change', () => {
                    if (parseFloat(input.value) < parseFloat(input.min)) {
                        input.value = parseFloat(input.min).toFixed(2);
                    } else {
                        input.value = parseFloat(input.value).toFixed(2);
                    }
                });

                span.textContent = element.measures.metric.unitShort;
                p.textContent = element.name;

                button.textContent = "x";
                button.addEventListener("click", function () {
                    if (this.parentElement.parentElement.children.length == 1) {
                        this.parentElement.parentElement.style.display = "none";
                        this.parentElement.parentElement.previousElementSibling.style.display = "none";
                    }
                    this.parentElement.remove();
                });

                li.appendChild(div);
                div.appendChild(input);
                div.appendChild(span);
                li.appendChild(p);
                li.appendChild(button);

                this.shoppingListUL.appendChild(li);
            }
        });

        const titleDiv = document.querySelector("#titleDiv");
        titleDiv.style.display = "flex";
        this.shoppingListUL.style.display = "flex";
    }

}











const useApiFood = async (type, dataReq) => {
    const keyOne = 'c185f3441f5641688170e15ed931f73d';
    // const keyOne = '461dfc19338a4e3ca382ca79d7252235';

    let result = null;

    if (type == "searchFood") {
        result = await useFetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${keyOne}&query=${dataReq}`);
        result = result.results;
    } else if (type = "recipeInfo") {
        console.log(`dataReq : ${dataReq}`);
        result = await useFetch(`https://api.spoonacular.com/recipes/${dataReq}/information?apiKey=${keyOne}`);
    }

    console.log("Api result");
    console.log(result);
    return result;
}
const useFetch = async (url, options) => {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
}

class MyStorageService{
    static getRecipes(){
        const recipes = localStorage.getItem("Recipes");
        if(recipes){
            return JSON.parse(recipes);
        }
        return null;
    }

    static saveRecipes(recipes){
        localStorage.setItem("Recipes",JSON.stringify(recipes));
    }
    static addRecipe(recipe){
        debugger;
        const recipes = this.getRecipes() || [];
        const exist = this.recipeExist(recipe);
        if(!exist){
            recipes.push(recipe);
            this.saveRecipes(recipes)
        }
    }
    static removeRecipe(recipeId){
        debugger;
        const newRecipesList = this.getRecipes().filter(r => r.id !== parseInt(recipeId));
        this.saveRecipes(newRecipesList);
    }
    static recipeExist(recipeId){
        debugger;
        console.log(`recipe id on recipeExist ${recipeId}`);
        const recipes = this.getRecipes();
        if(!recipes){
            return false;
        }
        return recipes.some(r => r.id === parseInt(recipeId));
    }
}
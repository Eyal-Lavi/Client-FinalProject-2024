class App {
    constructor() {
        this.initialVariabels();
        this.addEvents();
    }
    
    initialVariabels(){
        const body = document.body;

        //search Variables 
        this.searchButton = body.querySelector('#searchButton');
        this.searchInput= body.querySelector('#buttonWrapper input');
        this.ulResultOfSearching = document.getElementById("titleResultUL");

        this.recipeDiv = document.querySelector('#recipeDiv');
    }

    addEvents(){
        this.searchButton.addEventListener('click', ()=>{
            this.updateResultsOfSearching(this.searchInput.value)
        })
    }
    async updateResultsOfSearching(dataTOsearch){// Func that update the result list after the user search
        console.log("updateResultsOfSearching running .....");

        const recipeDataResult = await useApiFood("searchFood",dataTOsearch);
        // const result = await useApiFood("searchFood",);
        // console.log(recipeDataResult);
        const frag = document.createDocumentFragment();

        recipeDataResult.forEach(recipe => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            const div = document.createElement("div");
            const h2 = document.createElement("h4");
            li.appendChild(img);
            li.appendChild(div);
            div.appendChild(h2);
            console.log(recipe.title);
            
            img.src = recipe.image;
            h2.textContent = recipe.title;


            li.addEventListener('click',()=>{
                //some code that use recipe.id to show data on center page
                this.updateInformationAboutRecipe(recipe);
                
            })
            frag.appendChild(li);
        });
        this.ulResultOfSearching.appendChild(frag);
    }
    updateInformationAboutRecipe(recipe){
        const data = useApiFood("recipeInfo",recipe.id);

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
        const buttonP = document.createElement("button");
        buttonP.textContent = "+";

        servingsDataDiv.appendChild(secondP);
        servingsDataDiv.appendChild(buttonM);
        servingsDataDiv.appendChild(buttonP);

        helpBarRecipe.appendChild(servingsDataDiv);

        //-----

        const addWhislistDiv = document.createElement("div")
        addWhislistDiv.id = "addWhislistDiv";
        const addWhislistDivButton = document.createElement("button");
        addWhislistDivButton.innerHTML = "&#9829;";

        addWhislistDiv.appendChild(addWhislistDivButton);

        helpBarRecipe.appendChild(addWhislistDiv);

        frag.appendChild(helpBarRecipe);

        // this.recipeDiv.appendChild(frag);


        if(this.recipeDiv.firstChild){
            this.recipeDiv.insertBefore(frag,this.recipeDiv.firstChild);
        }
        // צריך להמשיך את עידכון ה מתכון

    }
}


const useApiFood = async (type,dataReq) =>{
    const keyOne = 'c185f3441f5641688170e15ed931f73d';
    let result = null;

    if(type == "searchFood"){
        result = await useFetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${keyOne}&query=${dataReq}`);
        result = result.results;
    }else if(type = "recipeInfo"){
        result = await useFetch(`https://api.spoonacular.com/recipes/${dataReq}/information?apiKey=${keyOne}`);
        return result;
    }

    console.log(result);
    return result;
}
const useFetch = async (url,options) =>{
    const response = await fetch(url,options);
    const json = await response.json();
    return json;



}
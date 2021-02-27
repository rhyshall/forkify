import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

if (module.hot)
{
  module.hot.accept;
}

const controlRecipes = 
async function()
{
  try
  {
    let id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);
 
    //rendering recipe
    recipeView.render(model.state.recipe);
  }
  catch(err)
  {
    recipeView.renderError();
  }
};

const controlSearchResults = 
async function()
{
  try
  {
    //get search query
    let query = searchView.getQuery();

    if(!query)
    {
      return;
    }

    resultsView.renderSpinner();

    //load search results
    await model.loadSearchResults(query);

    //render results
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  }
  catch(err)
  {
    console.log(err);
  }
};

const controlPagination = 
function(goToPage)
{ 
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = 
function(newServings)
{
  //update recipe servings in state
  model.updateServings(newServings);

  //update view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = 
function()
{
  //add/remove bookmark
  if (!model.state.recipe.bookmarked)
  {
    model.addBookmark(model.state.recipe);
  }
  else
  {
    model.deleteBookmark(model.state.recipe.id);
  }

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = 
function()
{
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = 
async function(newRecipe)
{
  //upload new recipe data
  try 
  {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, 
                             '',
                             `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function()
               {
                 addRecipeView.toggleWindow();
               }, MODAL_CLOSE_SEC * 1000);
  }
  catch(err)
  {
    addRecipeView.renderError(err.message);
  }
};

const init = 
function()
{
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
console.log('Application is live');
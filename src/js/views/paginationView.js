import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View
{
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler)
  {
    this._parentElement.addEventListener('click', 
                                         function(e)
                                         {
                                           let btn = 
                                           e.target
                                           .closest('.btn--inline')                                         
                                           let goToPage = +btn.dataset.goto;

                                           if (!btn)
                                           {
                                             return;
                                           }

                                           handler(goToPage);
                                         });
  }

  _generateMarkup()
  {
    let curPage = this._data.page;
    let numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    //page 1 + other pages
    if (curPage === 1 && numPages > 1)
    {
      return `<button data-goto=${curPage+1} class="btn--inline pagination__btn--next">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </button>`;
    }

    //just page 1
    if (curPage === 1 && numPages === 1)
    {
      return '';
    }

    //last page
    if (curPage === numPages && numPages !== 1)
    {
      return `<button data-goto=${curPage-1} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage-1}</span>
              </button>`;
    }

    //other page
    if (curPage < numPages && curPage !== 1)
    {
      return `<button data-goto=${curPage-1} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage-1}</span>
              </button>
              <button data-goto=${curPage+1} class="btn--inline pagination__btn--next">
                <span>Page ${curPage+1}</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </button>`;
    }
  }
}

export default new PaginationView();
import icons from 'url:../../img/icons.svg';

export default class View 
{
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, create markup string instead of rendering to DOM
   * @returns [undefined | string] A markup string is retruned if render is false
   * @this [Object] View instance
   * @author Rhys Hall
   */
  render(data, 
         render = true)
  {
    if (!data || (Array.isArray(data) && data.length === 0))
    {
      return this.renderError();
    }
    
    this._data = data;
    let markup = this._generateMarkup();
    
    if (!render)
    {
      return markup;
    }
    
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', 
                                           markup);
  }

  update(data)
  {   
    this._data = data;
    let newMarkup = this._generateMarkup();

    let newDOM = document.createRange().createContextualFragment(newMarkup);
    let newElements = Array.from(newDOM.querySelectorAll('*'));
    let curElements = Array.from(this._parentElement.querySelectorAll('*'));
    
    newElements.forEach((newEl, 
                        i) => 
                        {
                          let curEl = curElements[i];

                          //updates changed text
                          if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '')
                          {
                            curEl.textContent = newEl.textContent;
                          }

                          //updates changed attributes
                          if (!newEl.isEqualNode(curEl))
                          {
                            Array.from(newEl.attributes)
                            .forEach(attr => curEl.setAttribute(attr.name, 
                                                                attr.value));
                          }
                        });
  }

  renderSpinner()
  {
    let markup = `<div class="spinner">
                    <svg>
                      <use href="${icons}#icon-loader"></use>
                    </svg>
                  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', 
                                           markup);
  }

  renderError(msg = this._errorMsg)
  {
    let markup = `<div class="error">
                    <div>
                      <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                      </svg>
                    </div>
                    <p>${msg}</p>
                  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', 
                                           markup);
  }

  renderMessage(msg = this._message)
  {
    let markup = `<div class="message">
                    <div>
                      <svg>
                        <use href="${icons}#icon-smile"></use>
                      </svg>
                    </div>
                    <p>${msg}</p>
                  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', 
                                           markup);
  }

  _clear()
  {
    this._parentElement.innerHTML = '';
  }
}
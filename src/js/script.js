{
  'use strict';

  class BooksList {

    constructor() {
      const thisBookList = this;
      thisBookList.favoriteBooks = [];
      thisBookList.filters = [];
      thisBookList.dom = {};
      thisBookList.initData();
      thisBookList.getElements();
      thisBookList.initActions();
      thisBookList.render();
    }

    initData() {
      const thisBookList = this;
      thisBookList.data = dataSource.books;
    }

    getElements() {
      const thisBookList = this;

      thisBookList.dom.bookTemplateSource = document.getElementById('template-book').innerHTML;
      thisBookList.dom.bookTemplate = Handlebars.compile(thisBookList.dom.bookTemplateSource);
      thisBookList.dom.booksList = document.querySelector('.books-list');
      thisBookList.dom.filter = document.querySelector('.filters');
    }

    initActions() {
      const thisBookList = this;


      thisBookList.dom.booksList.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const clickedElement = event.target;
        console.log('clickedElement:', clickedElement);

        if (clickedElement.offsetParent.classList.contains('book__image')) {
          let id = clickedElement.offsetParent.getAttribute('data-id');
          console.log('id:', id);

          if (thisBookList.favoriteBooks.includes(id)) {
            clickedElement.offsetParent.classList.remove('favorite');
            const indexToRemove = thisBookList.favoriteBooks.indexOf(id);
            thisBookList.favoriteBooks.splice(indexToRemove, 1);
            console.log('Favorite BooksIds:', thisBookList.favoriteBooks);
          } else {
            clickedElement.offsetParent.classList.add('favorite');
            thisBookList.favoriteBooks.push(id);
            console.log('Favorite BooksIds:', thisBookList.favoriteBooks);
          }
        }
      });

      const filter = thisBookList.dom.filter;
      console.log('filter:', filter);
      filter.addEventListener('click', function (event) {

        const clickedElement = event.target;
        // Check if the clicked element is a checkbox
        if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
          const filterValue = clickedElement.value;
          console.log('filterValue', filterValue);

          if (clickedElement.checked) {
            console.log('clickedElement.checked', clickedElement.checked);
            // If checkbox is checked, add the filter to the filters array
            thisBookList.filters.push(filterValue);
            console.log('Filters:', thisBookList.filters);
          } else {
            // If checkbox is unchecked, remove the filter from the filters array
            const indexToRemove = thisBookList.filters.indexOf(filterValue);
            if (indexToRemove !== -1) {
              thisBookList.filters.splice(indexToRemove, 1);
              console.log('Filters:', thisBookList.filters);
            }
          }
          thisBookList.filterBooks();
        }
      });

    }

    filterBooks() {
      const thisBookList = this;

      for (let book of thisBookList.data) {
        let shouldBeHidden = false;
        for (let filter of thisBookList.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        const bookImage = thisBookList.dom.booksList.querySelector(`.book__image[data-id="${book.id}"]`);
        console.log('bookImage', bookImage);
        if (bookImage) {
          if (shouldBeHidden) {
            bookImage.classList.add('hidden');
          } else {
            bookImage.classList.remove('hidden');
          }
        }
      }
    }

    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else {
        return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
    }

    render() {
      const thisBookList = this;
      for (const book of thisBookList.data) {
        const ratingBgc = thisBookList.determineRatingBgc(book.rating);
        const ratingWidth = (book.rating / 10) * 100;

        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;

        const html = thisBookList.dom.bookTemplate(book);

        const bookElement = utils.createDOMFromHTML(html);
        bookElement.classList.add('book');

        thisBookList.dom.booksList.appendChild(bookElement);
        console.log('Book added to DOM:', book);
      }
    }
  }

  const app = new BooksList(); // eslint-disable-line no-unused-vars
}
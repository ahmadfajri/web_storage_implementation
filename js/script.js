const books = [];
const STORAGE_KEY = 'books';
const RENDER_EVENT = 'render-book';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeTodo(bookObject) {

  const {id, title, author, year, isComplete} = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis : '+ author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun : '+ year;

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.setAttribute('id', `book-${id}`);
  container.append(textTitle, textAuthor, textYear);

  if (isComplete) {
    const unReadButton = document.createElement('button');
    unReadButton.classList.add('green');
    unReadButton.innerText = 'Belum selesai di Baca'
    unReadButton.addEventListener('click', function () {
      moveToUnRead(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku'
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(unReadButton, trashButton);

    container.append(action);
  } else {
    const readButton = document.createElement('button');
    readButton.classList.add('green');
    readButton.innerText = 'Selesai dibaca'
    readButton.addEventListener('click', function () {
      moveToRead(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku'
    trashButton.addEventListener('click', function () {
      removeBook(id);
    });

    const action = document.createElement('div');
    action.classList.add('action');
    action.append(readButton, trashButton);

    container.append(action);
  }

  return container;
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateTodoObject(generatedID, title, author, year, isComplete)
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToUnRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isStorageExist() { 
  if(typeof (Storage) === undefined){
    console.log('Browser tidak mendukung local storage');
    return false
  }
  return true
}

function saveData() { 
  if(isStorageExist()){
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(RENDER_EVENT))
  }
}

function loadDataFromStorage() { 
  const serializedData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(serializedData)

  if(data != null){
    for (const book of data) {
      books.push(book)
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  const bookSubmit = document.querySelectorAll('#bookSubmit span')[0];

  const isComplete = document.getElementById('inputBookIsComplete');
  
  if(isStorageExist){
    loadDataFromStorage()
  }

  isComplete.addEventListener('change', function () { 
    const isCheked = this.checked
      if(isCheked){
        bookSubmit.innerText = 'Selesai dibaca'
      }else{
        bookSubmit.innerText = 'Belum selesai dibaca'
      }
  })


  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  

  document.dispatchEvent(new Event(RENDER_EVENT));
});


document.addEventListener(RENDER_EVENT, function () {
  const unReadBookList = document.getElementById('incompleteBookshelfList');
  const readBookList = document.getElementById('completeBookshelfList');

  unReadBookList.innerHTML = '';
  readBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeTodo(bookItem);
    if (bookItem.isComplete) {
      readBookList.append(bookElement);
    } else {
      unReadBookList.append(bookElement);
    }
  }
});

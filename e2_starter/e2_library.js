/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	// Get book title, author, genre, bookID
	const newBookName = document.querySelector('#newBookName').value
	const newBookAuthor = document.querySelector('#newBookAuthor').value
	const newBookGenre = document.querySelector('#newBookGenre').value
	const bookObject = new Book(newBookName, newBookAuthor, newBookGenre)

	libraryBooks.push(bookObject)

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(bookObject)
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	const loanBook = parseInt(document.querySelector('#loanBookId').value)

	// Get Patron card num 
	

	const patronCardNum = parseInt(document.querySelector('#loanCardNum').value)

	const patronToLoan = patrons[patronCardNum];
	// Add patron to the book's patron property
	let book = libraryBooks[loanBook];

	book.patron = patronToLoan;
	// console.log(book)

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	
	addBookToPatronLoans(book)

	// Start the book loan timer.
	book.setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();

	// check if return button was clicked, otherwise do nothing.
	if(e.target.classList.contains('return')) {

		// Call removeBookFromPatronTable()
		// get the bookId
		const bookID = parseInt(e.target.parentElement.parentElement.firstElementChild.innerText)

		let bookToReturn = libraryBooks[bookID]

		removeBookFromPatronTable(bookToReturn)

		// Change the book object to have a patron of 'null'

		bookToReturn.patron = null;
	}

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const newPatronNameToAdd = document.querySelector('#newPatronName').value

	let patronToAdd = new Patron(newPatronNameToAdd)
	patrons.push(patronToAdd)

	// Call addNewPatronEntry() to add patron to the DOM

	addNewPatronEntry(patronToAdd)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book

	const bookInfoId = parseInt(document.querySelector('#bookInfoId').value)

	let bookToDisplay = libraryBooks[bookInfoId]

	displayBookInfo(bookToDisplay)

	// Call displayBookInfo()	

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here

	// disecting book info

	const bookName = book.title
	const bookID = book.bookId
	const bookPatron = book.patron

	// Creating BookName

	const nameTableData = document.createElement('td')
	const TableBookName = document.createTextNode(bookName)
	const strong = document.createElement("STRONG")
	strong.appendChild(TableBookName)
	nameTableData.appendChild(strong)

	// Creating BookID

	const bookIdTableData = document.createElement('td')
	bookIdTableData.appendChild(document.createTextNode(bookID))
	
	// Creating Patron if there are any

	const bookPatronTableData = document.createElement('td')
	if (bookPatron !== null) {
		bookPatronTableData.appendChild(bookPatron)
	}

	const newBookRow = document.createElement('tr')
	newBookRow.appendChild(bookIdTableData)
	newBookRow.appendChild(nameTableData)
	newBookRow.appendChild(bookPatronTableData)

	bookTable.firstElementChild.appendChild(newBookRow)
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {

	// Add code here
	// disect book information 
	const bookName = book.title
	const bookID = book.bookId
	const bookPatron = book.patron
	const bookGenre = book.genre
	const bookAuthor = book.author

	//
	const IdField = bookInfo.firstElementChild.firstElementChild
	IdField.innerText = bookID

	const TitleField = IdField.parentElement.nextElementSibling
	TitleField.firstElementChild.innerText = bookName

	const AuthorField = TitleField.nextElementSibling
	// console.log(TitleField.nextElementSibling)
	AuthorField.firstElementChild.innerText = bookAuthor

	const GenreField = AuthorField.nextElementSibling
	GenreField.firstElementChild.innerText = bookGenre

	const PatronField = GenreField.nextElementSibling

	if (bookPatron !== null) {
		PatronField.firstElementChild.innerText = bookPatron.name
	} else {
		PatronField.firstElementChild.innerText = "N/A"
	}


}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).

function helperPatronTableFinder(patron) {

	const patronCardNum = patron.cardNumber;
	let currentTable = patronEntries.firstElementChild

	for (let i = 0; i < numberOfPatrons; i++) {
		const currentCard = parseInt(currentTable.firstElementChild.
			nextElementSibling.firstElementChild.innerText)
		if (currentCard === patronCardNum) {
			return currentTable.firstElementChild.nextElementSibling.
				nextElementSibling.nextElementSibling
			break;
		}
		currentTable = currentTable.nextElementSibling
	}
}


function addBookToPatronLoans(book) {

	// Add code here

	// Disect Book info
	const bookID = book.bookId
	const bookPatron = book.patron
	const bookGenre = book.genre
	const bookAuthor = book.author
	const bookTitle = book.title
	
	const table = helperPatronTableFinder(bookPatron)

	// console.log(table)

	const bookIdData = document.createElement('td')
	bookIdData.appendChild(document.createTextNode(bookID))

	const bookTitleData = document.createElement('td')
	const strong = document.createElement('STRONG')
	strong.appendChild(document.createTextNode(bookTitle))
	bookTitleData.appendChild(strong)

	const bookStatusData = document.createElement('td')
	const span = document.createElement('SPAN')
	span.className = 'green'
	span.appendChild(document.createTextNode("Within due date"))
	bookStatusData.appendChild(span)

	const returnData = document.createElement('td')
	const button = document.createElement('button')
	button.className = 'return'
	button.appendChild(document.createTextNode("return"))
	returnData.appendChild(button)

	const newDataRow = document.createElement('tr')
	newDataRow.appendChild(bookIdData)
	newDataRow.appendChild(bookTitleData)
	newDataRow.appendChild(bookStatusData)
	newDataRow.appendChild(returnData)

	table.firstElementChild.appendChild(newDataRow)

	// Need to update the main Table to put patron card num

	const bookRow = helperBookRowFinder(bookID)
	bookRow.firstElementChild.nextElementSibling.nextElementSibling.innerText = bookPatron.cardNumber


}

function helperBookRowFinder(bookId) {

	// console.log(bookTable)

	let currentRow = bookTable.firstElementChild.firstElementChild.nextElementSibling

	let currentBookId = parseInt(currentRow.firstElementChild.innerText)

	while (currentBookId != bookId) {
		currentRow = currentRow.nextElementSibling
		currentBookId = parseInt(currentRow.firstElementChild.innerText)
	}
 
	return currentRow;

}


function helperCreateTableTitle() {

	const header = document.createElement('h4')
	header.appendChild(document.createTextNode('Books on loan'))

	return header

}

function helperCreatePElement(FieldName, FieldValue) {

	const pElement = document.createElement('p')
	const NameTitle = document.createTextNode(FieldName)
	pElement.appendChild(NameTitle)
	
	const nameSpanElement = document.createElement('SPAN')
	const fieldBookName = document.createTextNode(FieldValue)
	nameSpanElement.className = "bold"
	nameSpanElement.appendChild(fieldBookName)
	pElement.appendChild(nameSpanElement)

	return pElement

}

function helperCreateColumn(field) {

	const column = document.createElement('th')
	column.appendChild(document.createTextNode(field))

	return column
}


// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here

	const NamePElement = helperCreatePElement("Name: ", patron.name)

	// Card Number Field

	const CardPElement = helperCreatePElement("Card Number: ", patron.cardNumber)

	const tableTitle = helperCreateTableTitle();

	const IDColumn = helperCreateColumn("BookID")

	const TitleColumn = helperCreateColumn("Title")

	const StatusColumn = helperCreateColumn("Status")

	const ReturnColumn = helperCreateColumn("Return")

	// console.log(ReturnColumn)

	// Create and fill first row of Table
	const tableRow = document.createElement('tr')
	tableRow.appendChild(IDColumn)
	tableRow.appendChild(TitleColumn)
	tableRow.appendChild(StatusColumn)
	tableRow.appendChild(ReturnColumn)

	// Create and fill table body
	const tableBody = document.createElement('tbody')
	tableBody.appendChild(tableRow)

	// Create and fill table
	const table = document.createElement('table')
	table.className = "patronsLoansTable"
	table.appendChild(tableBody)

	//Create div patron
	const patronData = document.createElement('div')
	patronData.className = "patron"
	patronData.appendChild(NamePElement)
	patronData.appendChild(CardPElement)
	patronData.appendChild(tableTitle)
	patronData.appendChild(table)


	patronEntries.appendChild(patronData)

}




// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const bookPatron = book.patron
	const bookIDFind = book.bookId

	const table = helperPatronTableFinder(bookPatron)

	// find the corrent row to remove 
	let currentRow = table.firstElementChild.firstElementChild.nextElementSibling

	let currentBookId = parseInt(currentRow.firstElementChild.innerText)

	while (currentBookId !== bookIDFind) {
		currentRow = currentRow.nextElementSibling
		currentBookId = parseInt(currentRow.firstElementChild.innerText)
	}

	table.firstElementChild.removeChild(currentRow)

	// Remove patron from the main book table 

	const bookRow = helperBookRowFinder(bookIDFind)
	bookRow.firstElementChild.nextElementSibling.nextElementSibling.innerText = ""



}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {

	// Add code here
	const bookPatron = book.patron
	const bookIDFind = book.bookId

	if (bookPatron !== null) {

		const table = helperPatronTableFinder(bookPatron)

		let currentRow = table.firstElementChild.firstElementChild.nextElementSibling

		let currentBookId = parseInt(currentRow.firstElementChild.innerText)
		// console.log(currentBookId)

		while (currentBookId !== bookIDFind) {
			currentRow = currentRow.nextElementSibling
			currentBookId = parseInt(currentRow.firstElementChild.innerText)
			
		}

		let data = currentRow.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild
		data.className = 'red'
		data.innerText = 'Overdue'
	}


}


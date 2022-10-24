// ● In the project folder, create a new file called company.html - this where your
// browser will look for when you click a company link from the main page
// (index.html)
// ● In this page, you should extract the symbol string from the url (for example, if the
// user clicked a link for /company.html?symbol=GOOG, you should have a variable in
// your JS code with “GOOG” as a string.
// ○ The information after the question mark in your url is called “query string”
// (sometimes it is called “query params” or “search”, but it means the same). To
// access it in your JavaScript you can follow this guide: Get Query String
// Parameters with JavaScript

// ● Then, get the company profile with the following endpoint: https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol} 
//where symbol is the
// company symbol extracted from the query params
// ● Present the company information in the screen (no design provided, go wild), with
// the company image, name, description and link
// ● Also, present the company stock price, and changes in percentages - if the change
// is positive, the changes in percentages should be in light green, else in red.
// ● After that, you should fetch the history of stock price of the company, using the
// following endpoint: https://stock-exchange-dot-full-stack-course-
// services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line
// ● Use Chart.js | Open source HTML5 Charts for your website to present this data in a
// chart (read the documentation, understand how to use it, and how to pass the data
// from the stock price history endpoint)
// ● Show loading indicator, when loading company data and stock price history.

let companySearcher = null;
let spinner = null;
let resultsTable = null;

window.onload = () => {
    spinner = document.getElementById('spinner')
    hideSpinner();
    resultsTable = document.getElementById('results-table');

    companySearcher = new CompanySearcher();
}

class Company {
    constructor(companyObject) {
       this.name = companyObject.name;
       this.symbol = companyObject.symbol;
       this.getCompanyData().then((result) => {
        this.data = result;
       });
    }

    createCompanyRow() {
        const companyRow = document.createElement("tbody");
        const companyTr =  document.createElement("tr");

        const companyItem = document.createElement("th");
        companyItem.classList = "fw-normal";
        companyItem.innerHTML = `(${this.symbol}) ${this.name}`;
        companyRow.appendChild(companyTr);
        companyTr.appendChild(companyItem);

        companyRow.addEventListener('click', () => {
             this.companyClicked();
         })
         
        return companyRow;
    }

    async companyClicked() {
        window.open(`./company.html?symbol=${this.symbol}`, '_blank').focus();
    }

    async getCompanyData() {
        try {
            const url = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/' + this.symbol;

            const response = await fetch(url);
            const results = await response.json();
            
            return results;
            
        } catch (e) {
            return false;
        }
    }
}

class CompanySearcher {
    constructor() {
        this.searchQuery = '';
        this.limit = 10;
        this.exchange= 'NASDAQ';

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.runSearch();
        })
    }

    async runSearch(e) {
        this.searchQuery=document.getElementById('search-input').value;
        const results = await this.getCompanies();
        
        console.log('results',results);
        resultsTable.innerHTML = ``;

        const companyObjects = [];
        results.forEach((item)=>{
            const company = new Company(item);
            companyObjects.push(company);
            const companyTableItem = company.createCompanyRow();

            resultsTable.appendChild(companyTableItem);
            // const card = movie.createMovieCard();

            // container.appendChild(card);
        })
    }

    async getCompanies() {
        showSpinner();
        try {
            const url = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=' + this.searchQuery + '&limit=' + this.limit + '&exchange=' + this.exchange;
            const response = await fetch(url);
            const results = await response.json();
                if (response) {
                    hideSpinner();
                }
            return results;
        } catch (e) {
            return [];
        }
    }
}


function hideSpinner() {
    spinner.style.display='none';
} 

function showSpinner() {
    spinner.style.display='block';
} 



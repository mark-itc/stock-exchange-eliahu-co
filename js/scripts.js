// https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=AA&limit=10&exchange=NASDAQ

// Present the result as a list to the user
// ● Add loading indicator when making the search
// ● Each item in the list should show the company name and symbol
// ● Each item should link to /company.html?symbol=AAPL, where AAPL should be replaced with the company symbol you received from the API request.
// ● Show loading indicator when searching.

// {
//     "symbol": "CAN",
//     "name": "Canaan Inc.",
//     "currency": "USD",
//     "stockExchange": "NASDAQ Global Market",
//     "exchangeShortName": "NASDAQ"
// }

// this.symbol = '/company.html?symbol=' + companyObject.symbol;

let companySearcher = null;

class Company {
    constructor(companyObject) {
       this.name = companyObject.name;
       this.symbol = companyObject.symbol;
    }

    createCompanyRow() {
        const resultsTable = document.getElementById('results-table');

        resultsTable.innerHTML += `<th class=fw-normal id=company-row>(${this.symbol}) ${this.name}</th>`;
        
        const companyRow = document.getElementById('company-row');

        return companyRow;
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
        console.log('runSearch');

        this.searchQuery=document.getElementById('search-input').value;
        const results = await this.getCompanies();
        console.log('results',results);

        const companyObjects = [];
        results.forEach((item)=>{
            const company = new Company(item);
            companyObjects.push(company);
            console.log(company.createCompanyRow())
        })
    }

    async getCompanies() {

        try {
            const url = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=' + this.searchQuery + '&limit=' + this.limit + '&exchange=' + this.exchange;
            const response = await fetch(url);
            const results = await response.json();
            return results;
        } catch (e) {
            return [];
        }
    }
}
window.onload = () => {
    companySearcher = new CompanySearcher();
}

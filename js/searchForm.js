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
        this.companyData = '';
        // this.companyLogo = this.companyData.image;
        // this.companyChanges = this.companyData.changes;
    }

    async createCompanyRow() {
        this.companyData = await this.getCompanyData();
        this.companyLogo = this.companyData.image;
        this.companyChanges = this.companyData.changes;

        console.log('this.companyData', this.companyData);

        const companyRow = document.createElement("tbody");
        const companyTr = document.createElement("tr");

        const companyChanges = document.createElement("div");
        companyChanges.innerHTML = `(${this.companyChanges}%)`;
        companyChanges.classList = "pe-3 ps-3 ms-3 text-white rounded-2";
        companyChanges.style = "--bs-bg-opacity: .6";
        if (this.companyChanges >= 0) {
            companyChanges.classList.add("bg-success");

        }
        else {
            companyChanges.classList.add("bg-danger");
        }

        console.log(companyChanges);

        const companyItem = document.createElement("th");
        companyItem.classList = "h5 d-flex align-items-center rounded-top";
        companyItem.innerHTML = `<img class="logo me-4" src=${this.companyLogo}> ${this.name}  (${this.symbol})`;


        companyRow.appendChild(companyTr);
        companyTr.appendChild(companyItem);
        companyItem.appendChild(companyChanges);

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
            const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.symbol}`;

            const response = await fetch(url);
            const result = await response.json();

            const companyData = result.profile;


            return companyData;

        } catch (e) {
            return false;
        }
    }
}

class CompanySearcher {
    constructor() {
        this.searchQuery = '';
        this.limit = 10;
        this.exchange = 'NASDAQ';

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.runSearch();
        })
    }

    async runSearch(e) {
        this.searchQuery = document.getElementById('search-input').value;
        const results = await this.getCompanies();

        console.log(results.length);

        resultsTable.innerHTML = ``;

        const companyObjects = [];
        const companyRows = []
        for (let i = 0; i < results.length; i++) {

            const company = new Company(results[i]);
            companyObjects.push(company);
            const companyTableItem = await company.createCompanyRow();
            companyRows.push(companyTableItem);
        }

        hideSpinner();

        for (let i = 0; i < companyRows.length; i++) {
            resultsTable.appendChild(companyRows[i]);
        }
    }

    async getCompanies() {
        showSpinner();
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


function hideSpinner() {
    spinner.style.display = 'none';
}

function showSpinner() {
    spinner.style.display = 'block';
}



// ● Show loading indicator, when loading company data and stock price history.

let companySearcher = null;
let spinner = null;
let resultsTable = null;

window.onload = () => {
    spinner = document.getElementById('spinner')
    hideSpinner();
    resultsTable = document.getElementById('results-table');

    companySearcher = new CompanySearcher();
    const marquee = new Marquee();
    marquee.printMarquee();
}

class Marquee {
    constructor() {
        this.limit = 25;
        this.exchange = 'NASDAQ';
    }

    async printMarquee() {
        const marqueeData = await this.getCompanyAndStockPrice();
        marqueeData.forEach((item)=>{
            const marquee = document.getElementById("marqueeSpan"); 

            const companyWrapper = document.createElement("span");
            companyWrapper.classList = "d-flex ms-2 me-2 h6";
            companyWrapper.style = "cursor: pointer;";

            const marqueeSymbol = document.createElement("div");
            marqueeSymbol.innerHTML = `${item.symbol}`;
            marqueeSymbol.classList = "ms-1 me-1 text-dark fw-bold";

            const marqueePrice = document.createElement("div")
            marqueePrice.innerHTML = `$${item.price}`;
            marqueePrice.classList = "ms-1 me-1 text-white";

            marquee.appendChild(companyWrapper);
            companyWrapper.appendChild(marqueeSymbol);
            companyWrapper.appendChild(marqueePrice);

            companyWrapper.addEventListener('click', () => {
                window.open(`./company.html?symbol=${item.symbol}`, '_blank').focus();;
            })
        })
    }
    
    async getCompanyAndStockPrice(){
        try {
            const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock-screener?exchange=${this.exchange}&limit=${this.limit}`;
            const response = await fetch(url);
            const results = await response.json();
            return results;
        } catch {
            return [];
        }
    }
}

// https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock-screener?exchange=NASDAQ&limit=${limit}

class Company {
    constructor(companyObject) {
        this.name = companyObject.name;
        this.symbol = companyObject.symbol;
        this.companyData = '';
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



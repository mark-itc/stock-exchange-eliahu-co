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

        const companyRow = document.createElement("tbody");
        const companyTr = document.createElement("tr");
        companyTr.classList = "d-flex";

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


        const companyItem = document.createElement("th");
        companyItem.classList = "h5 d-flex align-items-center rounded-top mb-2 col-md-10 col-lg-8 col-xl-7 mx-auto";
        companyItem.innerHTML = `<img class="logo me-4" src=${this.companyLogo}><span id="textResult"> ${this.name}  (${this.symbol})</span>`;



        companyRow.appendChild(companyTr);
        companyTr.appendChild(companyItem);
        companyItem.appendChild(companyChanges);

        companyTr.addEventListener('click', () => {
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
    constructor(container) {
        this.searchQuery = '';
        this.limit = 10;
        this.exchange = 'NASDAQ';
        this.container = container;
    }
    printForm() {
        const form = this.container;
        form.classList = "card text-bg-light border-primary mb-2 col-md-10 col-lg-8 col-xl-7 mx-auto justify-content-center";

        const cardHeader = document.createElement("div");
        cardHeader.classList = "card-header";

        const searchForm = document.createElement("form");
        searchForm.classList = "input-group input-group-lg align-items-center";

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.runSearch();
        })

        const formInput = document.createElement("input");
        formInput.classList = "form-control form-control-lg rounded shadow-none"
        formInput.setAttribute("type", "text");
        formInput.setAttribute("id", "search-input");
        formInput.setAttribute("placeholder", "Search for company");

        this.spinner = document.createElement("div");
        this.spinner.classList = "spinner-border text-primary spinner-border-sm";
        this.spinner.setAttribute("role", "status");
        this.spinner.style.display = 'none'

        const searchButton = document.createElement("button");
        searchButton.classList = "btn btn-primary btn-circle";
        searchButton.setAttribute("type", "submit");

        const searchIcon = document.createElement("i");
        searchIcon.classList = "fa-solid fa-magnifying-glass";

        form.appendChild(cardHeader);
        cardHeader.appendChild(searchForm);
        searchForm.appendChild(formInput);
        searchForm.appendChild(this.spinner);
        searchForm.appendChild(searchButton);
        searchButton.appendChild(searchIcon);
    }

    async runSearch(e) {
        this.searchQuery = document.getElementById('search-input').value;
        const results = await this.getCompanies();

        const resultsTable = document.getElementById('results-table');
        resultsTable.innerHTML = ``;

        const companyObjects = [];
        const companyRows = [];

        for (let i = 0; i < results.length; i++) {
            const company = new Company(results[i]);
            companyObjects.push(company);
            const companyTableItem = await company.createCompanyRow();
            companyRows.push(companyTableItem);
        }

        this.hideSpinner();

        for (let i = 0; i < companyRows.length; i++) {
            resultsTable.appendChild(companyRows[i]);
        }

        const textResult = document.querySelectorAll("#textResult")

        for (let i = 0; i < textResult.length; i++) {
            this.highlightQuery(this.searchQuery, textResult[i])
        }
    }

    async highlightQuery(search, result) {
        var innerText = result.innerHTML;
        var index = innerText.toUpperCase().indexOf(search.toUpperCase());
        if (index >= 0) {
            innerText = innerText.substring(0, index) + "<span class='text-bg-warning'>" + innerText.substring(index, index + search.length) + "</span>" + innerText.substring(index + search.length);
            result.innerHTML = innerText;
        }
    }

    async getCompanies() {
        this.showSpinner();
        try {
            const url = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=' + this.searchQuery + '&limit=' + this.limit + '&exchange=' + this.exchange;
            const response = await fetch(url);
            const results = await response.json();
            return results;
        } catch (e) {
            return [];
        }
    }

    hideSpinner() {
        this.spinner.style.display = 'none';
    }

    showSpinner() {
        this.spinner.style.display = 'block';
    }

}



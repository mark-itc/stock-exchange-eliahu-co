const params = new URLSearchParams(location.search);
const symbol = params.get('symbol')

class CompanyResult {
    constructor(location) {
        this.getCompanyData().then((companyData) => {
            this.companyLogo = companyData.image;
            this.companyName = companyData.companyName;
            this.companyPrice = companyData.price;
            this.companyChanges = companyData.changes;
            this.companyDescription = companyData.description;
            this.location = location;
            this.page = this.printInfo();
        });
        this.getPriceHistory().then((priceHistory) => {
            this.priceHistory = priceHistory;
            this.chart = this.createChart(this.priceHistory);
        })

    }

    async getCompanyData() {
        try {
            const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;

            const resp = await fetch(url);
            const result = await resp.json();

            const companyData = result.profile;

            return companyData;

        } catch (e) {
            return false;
        }
    }

    printInfo() {

        const companyRowName = document.createElement("tbody");
        const companyTrName = document.createElement("tr");
        const companyItemName = document.createElement("th");

        const backButton = document.createElement("button");
        backButton.classList = "btn btn-primary ms-5 float-end";
        backButton.style.backgroundColor = "#0D6EFD"
        backButton.setAttribute("type", "button");
        backButton.innerHTML = "Return"

        backButton.addEventListener('click', () => {
            window.location = './index.html'
        });

        companyTrName.classList = "d-flex";

        companyItemName.classList = "h4 align-items-center mb-2 col-md-10 col-lg-8 col-xl-7 mx-auto";
        companyItemName.innerHTML = `<img class="logo me-4" src=${this.companyLogo}> ${this.companyName} (${symbol})`;

        this.location.appendChild(companyRowName);
        companyRowName.appendChild(companyTrName);
        companyItemName.appendChild(backButton);
        companyTrName.appendChild(companyItemName);

        const companyRowPrice = document.createElement("tbody");
        const companyTrPrice = document.createElement("tr");
        companyTrPrice.classList = "d-flex";
        const companyItemPrice = document.createElement("th");
        companyItemPrice.classList = "h6 fw-bold d-flex align-items-center rounded-top mb-2 col-md-10 col-lg-8 col-xl-7 mx-auto";
        companyItemPrice.innerHTML = `Stock price: $${this.companyPrice}`;
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

        this.location.appendChild(companyRowPrice);
        companyRowPrice.appendChild(companyTrPrice);
        companyTrPrice.appendChild(companyItemPrice);
        companyItemPrice.appendChild(companyChanges);

        const companyRowDesc = document.createElement("tbody");
        const companyTrDesc = document.createElement("tr");
        companyTrDesc.classList = "d-flex";
        const companyItemDesc = document.createElement("th");
        companyItemDesc.classList = "h6 d-flex align-items-center rounded-top mb-2 col-md-10 col-lg-8 col-xl-7 mx-auto";
        companyItemDesc.innerHTML = `${this.companyDescription}`;

        this.location.appendChild(companyRowDesc);
        companyRowDesc.appendChild(companyTrDesc);
        companyTrDesc.appendChild(companyItemDesc);
    }

    async getPriceHistory() {
        const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;

        const resp = await fetch(url);
        const result = await resp.json();
        const priceHist = result.historical;
        return priceHist;
    }

    createChart(dataset) {
        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                // labels: 'Stock Price History',
                datasets: [{
                    label: 'Stock price',
                    data: dataset,
                    parsing: {
                        xAxisKey: 'date',
                        yAxisKey: 'close'
                    },
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}



let companyName = null;
let companyLogo = null;
let companyPrice = null;
let companyChanges = null;
let companyDescription = null;


const parameters = new URLSearchParams(location.search);
const symbol = parameters.get('symbol')


window.onload = () => {
    companyName = document.getElementById('company-name');
    companyLogo = document.getElementById('company-logo');
    companyPrice = document.getElementById('company-price');
    companyChanges = document.getElementById('company-changes');
    companyDescription = document.getElementById('company-description');


    const thisCompany = new CompanyResult();


}

class CompanyResult {
    constructor() {
        this.getCompanyData().then((companyData) => {
            this.companyLogo = companyData.image;
            this.companyName = companyData.companyName;
            this.companyPrice = companyData.price;
            this.companyChanges = companyData.changes;
            this.companyDescription = companyData.description;
            this.page = this.printInfo();
        });
        this.getPriceHistory().then((priceHistory) => {
            this.priceHistory = priceHistory;
            console.log(this.priceHistory);
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

        companyLogo.innerHTML = `<img class=logo src=${this.companyLogo}>`;
        companyName.innerHTML = this.companyName;
        companyPrice.innerHTML = `Stock price: ${this.companyPrice}`;
        companyChanges.innerHTML = `(${this.companyChanges}%)`;
        if (this.companyChanges >= 0) {
            companyChanges.style.color = "green";
        }
        else {
            companyChanges.style.color = "red";
        }
        companyDescription.innerHTML = this.companyDescription;
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



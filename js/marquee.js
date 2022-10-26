class Marquee {
    constructor(number) {
        this.limit = number;
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

const marqueeTop = new Marquee(25);
marqueeTop.printMarquee();
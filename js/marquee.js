class Marquee {
    constructor(container) {
        this.limit = 25;
        this.exchange = 'NASDAQ';
        this.container = container;
    }

    async printMarquee() {
        const marqueeData = await this.getCompanyAndStockPrice();
        
        const marquee = document.createElement("div");
        marquee.classList = "marquee__inner d-flex bg-primary";

        marqueeData.forEach((item)=>{
            
            const companyWrapper = document.createElement("span");
            companyWrapper.classList = "d-flex ms-2 me-2 h6";
            companyWrapper.style = "cursor: pointer;";

            const marqueeSymbol = document.createElement("div");
            marqueeSymbol.innerHTML = `${item.symbol}`;
            marqueeSymbol.classList = "ms-1 me-1 text-dark fw-bold";

            const marqueePrice = document.createElement("div")
            marqueePrice.innerHTML = `$${item.price}`;
            marqueePrice.classList = "ms-1 me-1 text-white";

           this.container.appendChild(marquee);
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
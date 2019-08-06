import axios from "axios";

export function getData(stock, startYear, stopYear) {
    const promiseMSFT = fetch(`http://localhost:8080/api/v1/stocks/${stock}/${startYear}/${stopYear}/statistics`)
        .then(response => response.json())
        .then(stock => {
            if (!stock) { return null }
            stock[1].Point = stock[1].Point.map(p => {
                return {
                    ...p,
                    date: new Date(p.date)
                }
            })
            return stock;
        })
    return promiseMSFT;
}

export function getAllocation(start, stop, stocks) {
    let stockList = stocks.map(s => s.name)
    let form = new FormData();
    form.append("start", start);
    form.append("stop", stop);
    form.append("stocks", stockList)
    return axios.post("http://localhost:8080/api/v1/stocks/allocation", form);


}



import axios from "axios";
const config = require('./config/config.json')["production"];

export function getData(stock, startYear, stopYear) {
    const promiseMSFT = fetch(`${config.API_URL}/stocks/${stock}/${startYear}/${stopYear}/statistics`, { credentials: 'include' })
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

export function getAllocation(start, stop, stocks, strategy, wantedReturn) {
    let stockList = stocks.map(s => s.name)
    let form = new FormData();
    form.append("strategy", strategy);
    form.append("start", start);
    form.append("stop", stop);
    form.append("stocks", stockList);
    form.append("wantedReturn", wantedReturn);
    return axios.post(`${config.API_URL}/stocks/allocation`, form, { withCredentials: true })
        .then(response => response.data)
        .then(data => {
            return {
                ...data,
                Point: data.Point.map(p => {
                    return {
                        ...p,
                        date: new Date(p.date)
                    }
                })
            }
        });


}



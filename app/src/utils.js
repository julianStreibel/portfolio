export function getData(stock, startYear, stopYear) {
    const promiseMSFT = fetch(`http://localhost:8080/api/v1/stocks/${stock}/${startYear}/${stopYear}`)
        .then(response => response.json())
        .then(stock => {
            stock.Point = stock.Point.map(p => {
                return {
                    ...p,
                    date: new Date(p.date)
                }
            })
            return stock;
        })
    return promiseMSFT;
}



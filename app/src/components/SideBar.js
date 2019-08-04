import React from 'react';
import styled from 'styled-components';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: props.stocks,
            setData: props.handleDateSetting,
        }
    }
    render() {
        const { stocks } = this.state;
        console.log("Stocks in sidebar", stocks)
        return (
            <BarWrapper>
                <Chart>
                    pie chart
                </Chart>
                <StockList>
                    <hr />
                    {stocks.map(s => <Stock> {s.name} </Stock>)}
                </StockList>
            </BarWrapper>
        )
    }
}

const Stock = styled.div`
    height: 20px;
`

// Shadow card
const BarWrapper = styled.div`
  height: 100vh - 15px;
  margin: 5px 10px 0px 10px;
  border-radius: 15px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25);
  background-color: white;

`;

const Chart = styled.div`
  height: calc(30vh - 10px);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const StockList = styled.div`
  height: calc(70vh - 10px);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`


export default SideBar;
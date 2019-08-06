import React from 'react';
import styled from 'styled-components';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: props.stocks,
            setData: props.setData,
            current: null,
            optimize: props.optimize,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stocks !== prevProps.stocks) {
            this.setState({ stocks: this.props.stocks })
        }
    }

    render() {
        const { stocks, setData, current, optimize } = this.state;
        return (
            <BarWrapper>
                <Chart>
                    <h2>Allocation</h2>
                </Chart>
                <hr />
                <StockList>
                    <h2>Stocks</h2>
                    {stocks.map(s =>
                        <Stock current={current === s.name} onClick={() => { setData(s); this.setState({ current: s.name }) }}>
                            <p>{s.name}</p>
                        </Stock>)}
                </StockList>
                <Stock onClick={() => optimize()}>
                    <p>Optimal allocation</p>
                </Stock>
            </BarWrapper >
        )
    }
}

const Stock = styled.div`

-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -ms-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -o-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -webkit-transition: all 0.25s ease-in-out;
  -moz-transition: all 0.25s ease-in-out;
  -ms-transition: all 0.25s ease-in-out;
  -o-transition: all 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;

    :hover{
        -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  -moz-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  -ms-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  -o-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    }

    height: 35px;
    width: 90%;
    border-radius: 15px;
    padding: 0px 0px 0px 10px;
    
    line-height: 30px;
    ${props => props.current && `background-color: lightgrey;`}

    :hover {
        background-color: rgb(245,245,245)
        ${props => props.current && 'background-color: grey'}
    }
`

// Shadow card
const BarWrapper = styled.div`
  height: 100vh - 35px;
  margin: 5px 10px 0px 10px;
  border-radius: 15px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -ms-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -o-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color: white;
  padding: 10px;

`;

const Chart = styled.div`
  height: calc(30vh - 30px);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const StockList = styled.div`
  overflow: auto;
  height: calc(70vh - 105px);
  padding: 0 10px 10px 10px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`


export default SideBar;
import React from 'react';
import styled from 'styled-components';
import Pie from './Pie';
import { RiseLoader } from 'react-spinners';


class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: props.stocks,
            setData: props.setData,
            current: null,
            optimize: props.optimize,
            deleteStock: props.deleteStock,
            reoptimize: props.reoptimize
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stocks !== prevProps.stocks) {
            this.setState(() => { return { stocks: this.props.stocks } })
        }
    }

    render() {
        const { stocks, setData, current, optimize, deleteStock, reoptimize } = this.state;

        return (
            <BarWrapper>
                <Main>
                    {this.props.allo && <Chart>
                        <Row>
                            <Head>Allocation</Head>
                            <HeadLogo
                                width="24"
                                height="24"
                                xmlns="http://www.w3.org/2000/svg"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                onClick={() => reoptimize()}
                            >
                                <path d="M7 9h-7v-7h1v5.2c1.853-4.237 6.083-7.2 11-7.2 6.623 0 12 5.377 12 12s-5.377 12-12 12c-6.286 0-11.45-4.844-11.959-11h1.004c.506 5.603 5.221 10 10.955 10 6.071 0 11-4.929 11-11s-4.929-11-11-11c-4.66 0-8.647 2.904-10.249 7h5.249v1z" />
                            </HeadLogo>
                        </Row>
                        {this.props.allo && <Pie allocation={this.props.allo} />}
                    </Chart>}
                    <h2>Stocks</h2>
                    {stocks.map((s, i) =>
                        <Stock key={s.name} current={current === s.name} onClick={() => {
                            setData(s); this.setState({ current: s.name })
                        }}>
                            <Name>{s.name}</Name>
                            <Logo onClick={(e) => {
                                e.stopPropagation()
                                deleteStock(s.name)
                            }}>
                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z" /></svg>
                            </Logo>
                        </Stock>)}
                </Main>
                <Low>
                    <Stock onClick={() => optimize()}>
                        <Name>Optimal allocation</Name>
                    </Stock>
                </Low>
            </BarWrapper >
        )
    }
}

const Row = styled.div`
            display:flex;
            flex-direction: row;
            justify-content: space-between;
        `;

const Head = styled.h2`
            margin: 0px;
        `;

const Logo = styled.p`
            margin: 8px 5px 5px 10px;
        `;

const HeadLogo = styled.svg`
            margin: 5px;
        `;

const Name = styled.p`
            margin: 7px 0 7px 10px;
        `;

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
        
            min-height: 35px;
            width: 95%;
            border-radius: 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 0 0 10px 5px;
    ${props => props.current && `background-color: lightgrey;`}

                :hover {
                    background-color: rgb(245,245,245)
        ${props => props.current && 'background-color: grey'}
                }
            `

// Shadow card
const BarWrapper = styled.div`
              margin: 5px 10px 5px 5px;
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
    border-radius: 15px;
    width: 90%;
    margin: 5px;
    padding: 10px;
`


const Main = styled.div`
            overflow: auto;     
            height: calc(100vh - 85px);
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            `

const Low = styled.div`

              padding: 10px 10px 0px 10px;
              border-bottom-left-radius: 15px;
              border-bottom-right-radius: 15px;
            `




export default SideBar;
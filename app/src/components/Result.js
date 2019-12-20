import React from 'react';
import styled from 'styled-components';
import { getData } from '../utils';
import Trading from './Trading';

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.current,
            chosen: 0
        }
        this.fetchStats = this.fetchStats.bind(this);
    }

    componentDidMount() {
        this.fetchStats()
    }

    componentDidUpdate(prevProps) {
        if (this.props.current !== prevProps.current) {
            this.setState({ current: this.props.current })
            this.fetchStats();
        }
    }

    async fetchStats() {
        const stockName = this.props.current.name;
        const banks = await getData(stockName, 2007, 2009);
        const terror = await getData(stockName, 2001, 2002);
        const com = await getData(stockName, 2000, 2001);
        const asia = await getData(stockName, 1997, 1999);
        const blackMonday = await getData(stockName, 1987, 1988);
        const oil73 = await getData(stockName, 1973, 1975);

        this.setState({
            banks,
            terror,
            com,
            asia,
            blackMonday,
            oil73
        })
    }

    render() {
        const { std, ev, min, max, oneYear, fiveYears, tenYears, name } = this.state.current;
        console.log('current', this.state.current)
        const { banks, terror, com, asia, blackMonday, oil73, chosen } = this.state;
        return (
            <ResultWrapper>
                <Row>
                    <Button chosen={chosen === 0} onClick={() => this.setState({ chosen: 0 })}>Risk</Button>
                    <Button chosen={chosen === 1} onClick={() => this.setState({ chosen: 1 })}>Trading</Button>
                </Row>
                {chosen === 0 ?
                    <Row>
                        <Stats>
                            <h3>Statistics</h3>
                            <Row>
                                <Line>Return</Line>
                                <Line>{Math.round(ev * 100000) / 1000}%</Line>
                            </Row>
                            <Row>
                                <Line>Risk</Line>
                                <Line>{Math.round(std * 100000) / 1000}%</Line>
                            </Row>
                            <Row>
                                <Line>Max Return</Line>
                                <Line>{Math.round(max * 100000) / 1000}%</Line>
                            </Row>
                            <Row>
                                <Line>Max Loss</Line>
                                <Line>{Math.round(min * 100000) / 1000}%</Line>
                            </Row>
                            <br />
                            <Row>
                                <Line>1 Year</Line>
                                <Line>{oneYear ? Math.round(oneYear * 100000) / 1000 : "-"}%</Line>
                            </Row>
                            <Row>
                                <Line>5 Year</Line>
                                <Line>{fiveYears ? Math.round(fiveYears * 100000) / 1000 : "-"}%</Line>
                            </Row>
                            <Row>
                                <Line>10 Year</Line>
                                <Line>{tenYears ? Math.round(tenYears * 100000) / 1000 : "-"}%</Line>
                            </Row>

                        </Stats>
                        <CrisisRisk>
                            <h3>Crisis Risk</h3>
                            <Row>
                                <Crisis>
                                    <HeadSmall>2007 - 2009: Bank</HeadSmall>
                                    <Row>
                                        <Line>Return</Line>
                                        <Line>{banks ? Math.round(banks[0].ev * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Risk</Line>
                                        <Line>{banks ? Math.round(banks[0].std * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Max Loss</Line>
                                        <Line>{banks ? Math.round(banks[0].min * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                </Crisis>
                                <Crisis>
                                    <HeadSmall>2000 - 2001: .COM</HeadSmall>
                                    <Row>
                                        <Line>Return</Line>
                                        <Line>{com ? Math.round(com[0].ev * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Risk</Line>
                                        <Line>{com ? Math.round(com[0].std * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Max Loss</Line>
                                        <Line>{com ? Math.round(com[0].min * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                </Crisis>
                                <Crisis>
                                    <HeadSmall>1987 - 1988: Black Monday</HeadSmall>
                                    <Row>
                                        <Line>Return</Line>
                                        <Line>{blackMonday ? Math.round(blackMonday[0].ev * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Risk</Line>
                                        <Line>{blackMonday ? Math.round(blackMonday[0].std * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Max Loss</Line>
                                        <Line>{blackMonday ? Math.round(blackMonday[0].min * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                </Crisis>
                            </Row>
                            <Row>
                                <Crisis>
                                    <HeadSmall>2001 - 2002: Terror</HeadSmall>
                                    <Row>
                                        <Line>Return</Line>
                                        <Line>{terror ? Math.round(terror[0].ev * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Risk</Line>
                                        <Line>{terror ? Math.round(terror[0].std * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Max Loss</Line>
                                        <Line>{terror ? Math.round(terror[0].min * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                </Crisis>
                                <Crisis>
                                    <HeadSmall>1997 - 1999: Asia</HeadSmall>
                                    <Row>
                                        <Line>Return</Line>
                                        <Line>{asia ? Math.round(asia[0].ev * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Risk</Line>
                                        <Line>{asia ? Math.round(asia[0].std * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Max Loss</Line>
                                        <Line>{asia ? Math.round(asia[0].min * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                </Crisis>
                                <Crisis>
                                    <HeadSmall>1973 - 1975: Oil</HeadSmall>
                                    <Row>
                                        <Line>Return</Line>
                                        <Line>{oil73 ? Math.round(oil73[0].ev * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Risk</Line>
                                        <Line>{oil73 ? Math.round(oil73[0].std * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                    <Row>
                                        <Line>Max Loss</Line>
                                        <Line>{oil73 ? Math.round(oil73[0].min * 100000) / 1000 : "-"}%</Line>
                                    </Row>
                                </Crisis>
                            </Row>
                        </CrisisRisk>
                    </Row>
                    :
                    <Row>
                        <Trading stockName={name} />
                    </Row>
                }
            </ResultWrapper >
        )
    }
}

const Button = styled.div`
    padding: 10px 10px 0 0;
    cursor: pointer;
    ${props => props.chosen && `color:#85bb65`}
`;

const Crisis = styled.div`
    width: 40%;
    padding-bottom: 10px;
`;

const HeadSmall = styled.h4`
    margin: 0;
    padding: 0;
`;

const Line = styled.p`
    margin: 0;
    padding: 0;
    width: 30%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const Stats = styled.div`
    width: 30%;
`;

const CrisisRisk = styled.div`
    width: 70%
`;

const ResultWrapper = styled.div`
    width: calc(80vw - 25px);
    height: calc(100vh - 505px);
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25);
    padding: 10px 10px 20px 10px;    

`;


export default Result;
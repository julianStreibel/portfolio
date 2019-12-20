import React from 'react';
import Chart from './Chart';
import { getData, getAllocation } from './utils';
import styled from 'styled-components';

// Components
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Result from './components/Result';
import Modal from './components/Modal';

import { PacmanLoader } from 'react-spinners';
import useUserState from './Hooks/useUserState';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    const [getUserState, setUserState] = useUserState();
    this.getUserState = getUserState;
    this.setUserState = setUserState;
    this.state = {
      stocks: [],
      optimizeOpen: false
    }
    this.handleDataSetting = this.handleDataSetting.bind(this);
    this.handleStockDownloading = this.handleStockDownloading.bind(this);
    this.handleOptimize = this.handleOptimize.bind(this);
    this.optimize = this.optimize.bind(this);
    this.reoptimize = this.reoptimize.bind(this);
    this.deleteStock = this.deleteStock.bind(this);
  }

  handleDataSetting(stock) {
    this.setState({ current: stock });
  }

  async handleStockDownloading(stockName, init) {
    const ret = await getData(stockName, 0, 9999);
    let stock = Object.assign(ret[0], ret[1]);
    const stocks = [...this.state.stocks, stock]
    this.setState({ stocks })
    if (!init)
      this.setUserState('stocks', [...this.getUserState()['stocks'], stockName])
  }

  handleOptimize() {
    this.setState((prevState) => { return { optimizeOpen: !prevState.optimizeOpen } })
  }

  async optimize(start, stop, strategy, wantedReturn) {
    const { stocks, current } = this.state;
    if (start && stop && strategy) {
      this.setState({ start, stop, strategy, wantedReturn });
      const allo = await getAllocation(start, stop, stocks, strategy, wantedReturn);
      if (current && current.allocation) {
        this.setState({ allo, current: allo });
      } else {
        this.setState({ allo });
      }
      this.handleOptimize();
    }
  }

  async reoptimize() {
    const { start, stop, strategy, wantedReturn, stocks, current } = this.state;
    if (start && stocks.length > 1) {
      const allo = await getAllocation(start, stop, stocks, strategy, wantedReturn);
      if (current && current.allocation) {
        this.setState({ allo, current: allo });
      } else {
        this.setState({ allo });
      }
    }
  }

  deleteStock(name) {
    const { stocks, current } = this.state;
    let curr = current && name === current.name ? false : current;
    this.setState({ stocks: stocks.filter((s) => s.name !== name), current: curr })
    const userStateStocks = this.getUserState()['stocks']
    const index = userStateStocks.indexOf(name);
    if (index > -1) {
      console.log('userState', userStateStocks)
      userStateStocks.splice(index, 1)
      this.setUserState('stocks', userStateStocks)
      console.log('userState after', userStateStocks.splice(index, 1))
    }
  }

  componentDidMount() {
    const userState = this.getUserState()
    userState['stocks'].map(name => this.handleStockDownloading(name, true))
  }

  render() {
    const { stocks, current, optimizeOpen, allo } = this.state;
    console.log('stocks', stocks)
    return (
      <React.Fragment>
        <BarWrapper>
          <Side>
            <SideBar
              deleteStock={this.deleteStock}
              allo={allo}
              stocks={stocks}
              setData={this.handleDataSetting}
              optimize={this.handleOptimize}
              reoptimize={this.reoptimize} />
          </Side>
          <Main>
            <Top>
              <TopBar stocks={stocks} downloadStock={this.handleStockDownloading} logout={this.props.logout} />
            </Top>
            {current ?
              <React.Fragment>
                <Chart type={'hybrid'} data={current.Point} />
                <Result current={current} />
              </React.Fragment>
              :
              <Empty>
                <Center>
                  <PacmanLoader
                    sizeUnit={"px"}
                    size={30}
                    color={'#85bb65'}
                    loading={true}
                  />
                </Center>
                "Diversification is the only free lunch in investing." <br /> Harry Markowitz
            </Empty>}
          </Main>
        </BarWrapper>
        {optimizeOpen &&
          <Modal close={this.handleOptimize} stocks={stocks} optimize={this.optimize} />
        }
      </React.Fragment>

    )
  }
}

const Center = styled.div`
  width: 150px;
  margin: 0 auto;
  padding-bottom: 80px;
`;

const Empty = styled.div`
padding-top: 150px;
text-align: center;
`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: rgb(240,240,240);
`;

const Side = styled.div`
  width: 20vw;
  min-width: 250px;
  height: 100vh;
`

const Main = styled.div`
  width: 80vw;
  height: 100vh;
`

const Top = styled.div`
  width: 80vw;
  height: 65px;
`

export default Portfolio;
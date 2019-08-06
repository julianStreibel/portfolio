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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      optimizeOpen: false
    }
    this.handleDataSetting = this.handleDataSetting.bind(this);
    this.handleStockDownloading = this.handleStockDownloading.bind(this);
    this.handleOptimize = this.handleOptimize.bind(this);
    this.optimize = this.optimize.bind(this);
  }

  handleDataSetting(pointList) {
    this.setState({ current: pointList });
  }

  async handleStockDownloading(stockName) {
    const ret = await getData(stockName, 0, 9999);
    let stock = Object.assign(ret[0], ret[1]);

    this.setState((prevState) => { return { stocks: [...prevState.stocks, stock] } })
  }

  handleOptimize() {
    this.setState((prevState) => { return { optimizeOpen: !prevState.optimizeOpen } })
  }

  async optimize(start, stop) {
    const { stocks } = this.state;
    if (start && stop) {
      console.log(start, stop, stocks);
      const allocation = await getAllocation(start, stop, stocks);
      console.log(allocation);
      this.handleOptimize();
    }
  }

  render() {
    const { stocks, current, optimizeOpen } = this.state;
    return (
      <React.Fragment>
        <BarWrapper>
          <Side>
            <SideBar stocks={stocks} setData={this.handleDataSetting} optimize={this.handleOptimize} />
          </Side>
          <Main>
            <Top>
              <TopBar stocks={stocks} downloadStock={this.handleStockDownloading} />
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
                Search for stocks to analyse or upload your own. <br /> Happy hacking!
            </Empty>}
          </Main>
        </BarWrapper>
        {optimizeOpen &&
          <Modal close={this.handleOptimize} optimize={this.optimize} />
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

export default App;
import React from 'react';
import Chart from './Chart';
import { getData } from './utils';
import styled from 'styled-components';

// Components
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: []
    }
    this.handleDataSetting = this.handleDataSetting.bind(this);
  }
  componentDidMount() {
    getData('Apple', 1999, 2010).then(data => {
      this.setState({ stocks: [...this.state.stocks, data], data: data.Point })
    })

  }

  handleDataSetting(pointList) {
    this.setState({ data: pointList });
  }

  render() {
    const { stocks } = this.state;
    if (this.state.data == null) {
      return <div>Loading...</div>
    }
    return (
      <BarWrapper>
        <Side>
          <SideBar stocks={stocks} setData={this.handleDataSetting} />
        </Side>
        <Main>
          <Top>
            <TopBar />
          </Top>
          <Chart type={'hybrid'} data={this.state.data} />
          <Results>
            Results
          </Results>
        </Main>
      </BarWrapper>
    )
  }
}

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

const Results = styled.div`
  height: 50px;
  width: calc(80vw - 15px);
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25);
`

export default App;
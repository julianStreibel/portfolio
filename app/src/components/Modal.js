import React from 'react';
import styled from 'styled-components';
import { Input as OGInput } from 'reactstrap';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.calculateWantedReturnArea = this.calculateWantedReturnArea.bind(this);
    }

    calculateWantedReturnArea() {
        const { stocks } = this.props;
        let evList = stocks.map(s => s.ev).sort((a, b) => a - b);
        const smallest = evList[0];
        const biggest = evList[evList.length - 1];
        this.setState({ biggest, smallest });
        return `Wanted Return between ${smallest} - ${biggest}`
    }

    render() {
        const { optimizeStart, optimizeStop, optimalStrategy, wantedReturn } = this.state;
        const { stocks } = this.props;
        return (
            <ModalWrapper>
                <h2>Optimize your allocation</h2>
                <p>Choose the wanted timeframe:</p>
                <Input red={!optimizeStart} value={optimizeStart} onChange={(e) => this.setState({ optimizeStart: e.target.value })} placeholder={'Start'} />
                {" - "}<Input red={!optimizeStop} value={optimizeStop} onChange={(e) => this.setState({ optimizeStop: e.target.value })} placeholder={'End'} />
                <Select red={!optimalStrategy} onChange={(e) => this.setState({ optimalStrategy: e.target.value })} type="select" value={optimalStrategy}>
                    <option value="" selected disabled >Choose your strategy</option>
                    <option>Bulletproof (min Risk)</option>
                    <option>Efficient (opt Risk Return)</option>
                </Select>
                <br />
                {optimalStrategy === "Efficient (opt Risk Return)" &&
                    <React.Fragment>
                        <Input red={!wantedReturn} value={wantedReturn} onChange={(e) => this.setState({ wantedReturn: e.target.value })} placeholder={"Wanted Return"} />
                        <p><small>The wanted return has to be between the maximum and minimum return of all stocks in your portfolio and timeframe or you get nonsensical weigths. Try a value near the return of the bulletproof strategy. </small></p>
                    </React.Fragment>
                }<p><small>The optimization is calculated with the historical data so choose a wise timeframe!</small></p>
                <br />
                <Button onClick={() => {
                    if (stocks.length > 1)
                        this.props.optimize(optimizeStart, optimizeStop, optimalStrategy, wantedReturn / 100)
                }}>Let´s go</Button>
                <br />
                <Button onClick={() => this.props.close()}>Back</Button>
            </ModalWrapper>
        )
    }
}


const ModalWrapper = styled.div`
  z-index: 99999;
  position: absolute;
  top: calc(30% - 130px);
  left: calc(50% - 145px);
  width: 340px;
  border-radius: 15px;
  background-color: white;
  padding: 0 10px 10px 10px;

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

`;

const Select = styled(OGInput)`
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
    margin-top: 10px;
    height: 30px;
    width: 50%;
    background-color: white;
    padding: 0 0 0 10px;
    border-width: 0;
    border-radius: 15px ;
  ${props => props.red && 'border-width: 1px; border-color: red;'}
`;

const Button = styled.div`

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
    border-radius: 15px;
    padding: 0px 0px 0px 10px;
    
    line-height: 30px;

    :hover {
        background-color: rgb(245,245,245)
    }
`

const Input = styled(OGInput)`
margin-top: 10px;
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
  height: 30px;
  background-color: white;
  padding: 0 0 0 10px;
  border-width: 0;
  border-radius: 15px;
    ${props => props.red && 'border-width: 1px; border-color: red;'}
`;



export default Modal;
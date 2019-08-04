import React from 'react';
import styled from 'styled-components';
import { Input as OGInput } from 'reactstrap';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            dropdownOpen: false,
            results: []
        }
        this.toggle = this.toggle.bind(this);
    }
    render() {
        const { query, results } = this.state;
        return (
            <BarWrapper>
                <div>
                    <Search
                        onChange={(e) => this.handleQuery(e.target.value)}
                        value={query}
                        placeholder={'Search for stocks'} />
                    {results.length > 0 && query &&
                        <Results>
                            {results.map(r => r.name)}
                        </Results>
                    }
                </div>
                <NewStock>
                    new stock
                </NewStock>
            </BarWrapper>
        )
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    async handleQuery(query) {
        let results = [];
        if (query) {
            results = await fetch(`http://localhost:8080/api/v1/stocks/find/${query}`).then(res => res.json());
        }
        this.setState({
            query, results
        })
    }
}

const Results = styled.div`
    position: relative;
    top: 5px;
    height: 50px;
  width: 300px;
  background-color: white;
  padding: 0 0 0 10px;
  border-width: 0;
  border-radius: 15px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25);

`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 65px;
  margin: 5px 15px 0px 0px;

`;

const Search = styled(OGInput)`
  height: 50px;
  width: 300px;
  background-color: white;
  padding: 0 0 0 10px;
  border-width: 0;
  border-radius: 15px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25);
`

const NewStock = styled.div`
  height: 50px;
  width: 100px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25);
`


export default TopBar;
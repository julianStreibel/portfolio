import React from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone'
import { Input as OGInput } from 'reactstrap';
import axios from 'axios';
import LogoutIcon from '../icons/logout.png';
import { withRouter } from "react-router-dom";
const config = require('../config/config.json')["production"];
const config = require('../config/config.json')["development"];

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            downloadStock: props.downloadStock,
            stocks: props.stocks,
            query: "",
            dropdownOpen: false,
            results: [],
            uploadStockOpen: false,
            uploadStockName: "",
            uploadStockCSV: null
        }
        this.toggle = this.toggle.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    render() {
        const { query, results, downloadStock, uploadStockOpen, uploadStockName, uploadStockCSV } = this.state;
        return (
            <BarWrapper>
                <div>
                    <Search
                        onChange={(e) => this.handleQuery(e.target.value)}
                        value={query}
                        placeholder={'Search for stocks'} />
                    {results && results.length > 0 && query &&
                        <Dropdown>
                            {results.map(r =>
                                <Result onClick={() => {
                                    downloadStock(r.name);
                                    this.setState({ query: "" })
                                }}>
                                    <p>{r.name}</p>
                                </Result>
                            )}
                        </Dropdown>
                    }
                </div>
                <Row>
                    <NewStock onClick={() => this.setState((prevState) => { return { uploadStockOpen: !prevState.uploadStockOpen } })}>
                        +
                    </NewStock>
                    <NewStock onClick={() => {
                        this.props.logout()
                        this.props.history.push("/");
                    }
                    }>
                        <img src={LogoutIcon} alt="Logo" height="20px" />
                    </NewStock>
                </Row>
                {uploadStockOpen &&
                    <Dropdown2>

                        <h2>Upload CSV from Yahoo finance historical Data</h2>
                        <p>After uploading your stock you can find it in the searchbar</p>
                        <br />
                        <Input red={!uploadStockName} value={uploadStockName} onChange={(e) => this.setState({ uploadStockName: e.target.value })} placeholder={'Stockname'} />
                        <br />
                        <Dropzone onDrop={this.onDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <DropzoneWrapper {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {uploadStockCSV ? uploadStockCSV.name : 'Click me to upload a file!'}
                                </DropzoneWrapper>
                            )}
                        </Dropzone>
                        <br />
                        <DropzoneWrapper onClick={() => this.uploadStock()}>
                            Upload
                        </DropzoneWrapper>
                        <br />
                        <p>
                            <small>
                                You can download the data for Apple here: <a target="_blank" rel="noopener noreferrer" href="https://finance.yahoo.com/quote/AAPL/history?p=AAPL">https://finance.yahoo.com<wbr />/quote/AAPL/history?p=AAPL</a>
                            </small>
                        </p>

                    </Dropdown2>
                }
            </BarWrapper>
        )
    }

    async uploadStock() {
        const { uploadStockCSV, uploadStockName } = this.state;
        if (uploadStockCSV && uploadStockName) {
            let form = new FormData();
            form.append("name", uploadStockName);
            form.append("csv", uploadStockCSV);
            axios.post(`${config.API_URL}/stocks`, form, { withCredentials: true });
            this.setState({
                uploadStockOpen: false,
                uploadStockName: "",
                uploadStockCSV: null
            })
        }
    }

    // TODO
    onDrop(uploadStockCSV) {
        this.setState({ uploadStockCSV: uploadStockCSV[0] })
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    async handleQuery(query) {
        let results = [];
        if (query) {
            results = await fetch(`${config.API_URL}/stocks/find/${query}`, { credentials: 'include' }).then(res => res.json()).catch(e => console.log(e));
        }
        this.setState({
            query, results
        });
    }
}


const DropzoneWrapper = styled.div`

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

  height: 35px !important;
  background-color: white;
  padding: 15px 0 0 0;
  text-align: center;
  border-width: 0;
  border-radius: 15px;
`;

const Input = styled(OGInput)`
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
  height: 50px;
  background-color: white;
  padding: 0 0 0 10px;
  border-width: 0;
  border-radius: 15px;
    ${props => props.red && 'border-width: 1px; border-color: red;'}
`;

const Dropdown2 = styled.div`
    z-index: 1000;
    display: flex;
    flex-direction: column;
    position:absolute;
    top: 60px; 
    right: 5px;
    width: 300px;
    height: 500px;
    background-color: white;
    border-width: 0;
    border-radius: 15px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25);
    padding: 10px;
`;

const Result = styled.div`
    z-index: 1000;
    border-radius: 15px;
    padding: 0 0 0 10px;
    :hover {
        background-color: rgb(240,240,240)
    }
`;

const Dropdown = styled.div`
    z-index: 1000;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 70px);
    position: relative;
    top: 5px;
    width: 300px;
    overflow: auto;
    background-color: white;
    border-width: 0;
    border-radius: 15px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25);

`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 65px;
  margin: 5px 5px 0px 0px;

`;

const Search = styled(OGInput)`

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


  height: 50px;
  width: 300px;
  background-color: white;
  padding: 0 0 0 10px;
  border-width: 0;
  border-radius: 15px;
`

const NewStock = styled.div`
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

    font-size: 25px;
    color: rgb(100,100,100);
    text-align: center;
    line-height: 47px;
    height: 50px;
    width: 50px;
    margin-left: 5px;
    background-color: white;
    border-radius: 15px;
`

const Row = styled.div`
    display:flex;
    flex-direction: row;
`;

export default withRouter(TopBar);
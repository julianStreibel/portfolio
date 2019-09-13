import React from 'react';
import styled from 'styled-components';
import { Input as OGInput } from 'reactstrap';
import axios from 'axios';
import { withRouter } from "react-router-dom";
const config = require('./config/config.json')["development"];

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setLogin: props.login,
            login: true,
            error: false,
            name: "",
            lpw: "",
            mail: "",
            rpw1: "",
            rpw2: ""
        }
        this.setValue = this.setValue.bind(this);
    }

    setValue(field, value) {
        this.setState({ [field]: value })
    }

    async register() {
        const { name, rpw1, mail, setLogin } = this.state;
        const accountName = await axios.post(`${config.API_URL}/accounts/register`, {
            "name": name,
            "password": rpw1,
            "mail": mail
        }, { withCredentials: true });
        if (accountName.data.error) {
            this.setState({ error: accountName.data.error })
        } else {
            setLogin(accountName.data.name);
            this.props.history.push("/portfolio");
        }
    }

    async login() {
        const { lpw, name, setLogin } = this.state;
        const answer = await axios.post(`${config.API_URL}/accounts/login`, {
            "name": name,
            "password": lpw
        }, { withCredentials: true });
        if (answer.data.error) {
            this.setState({ error: answer.data.error });
        } else {
            setLogin(answer.data.name);
            this.props.history.push("/portfolio");
        }
    }

    render() {
        const { login, name, lpw, mail, rpw1, rpw2, error } = this.state;
        return (
            <FormWrapper>
                {login ?
                    <React.Fragment>
                        <h2>Login</h2>
                        <Input onChange={(e) => this.setValue("name", e.target.value)} value={name} placeholder={'Name or E-Mail'} />
                        <Input type="password" onChange={(e) => this.setValue("lpw", e.target.value)} value={lpw} placeholder={'Password'} />
                        <Row>
                            <Button disabled={name === "" || lpw === ""} onClick={() => this.login()}>Login</Button>
                            <Button onClick={() => this.setState({ login: false })}>Register</Button>
                        </Row>
                        <Error>{error}</Error>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <h2>Register</h2>
                        <Input onChange={(e) => this.setValue("name", e.target.value)} value={name} placeholder={'Name'} />
                        <Input type="email" onChange={(e) => this.setValue("mail", e.target.value)} value={mail} placeholder={'E-Mail'} />
                        <Input type="password" onChange={(e) => this.setValue("rpw1", e.target.value)} value={rpw1} placeholder={'Password'} />
                        <Input type="password" onChange={(e) => this.setValue("rpw2", e.target.value)} value={rpw2} placeholder={'Password'} />
                        <Row>
                            <Button disabled={rpw1 !== rpw2 || rpw1 === 0 || name === "" || mail === ""} onClick={() => this.register()}>Register</Button>
                            <Button onClick={() => this.setState({ login: true })}>Login</Button>
                        </Row>
                        <Error>{error}</Error>
                    </React.Fragment>
                }
            </FormWrapper>
        )
    }
}

const Error = styled.p`
    color: red;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

const FormWrapper = styled.div`
    width: 400px;
    margin: 10% calc(50% - 200px);
    border-radius: 15px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    -ms-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    -o-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    background-color: white;
    padding: 10px;

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
  width: 95%;
  margin-bottom: 10px;
  background-color: white;
  padding: 0 0 0 10px;
  border-width: 0;
  border-radius: 15px;
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

${props => !props.disabled && `:hover{
                -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
                -moz-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
                -ms-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
                -o-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
            }`
    }

  height: 35px !important;
  width: 47.5%;
  background-color: white;
  padding: 15px 0 0 0;
  margin: 0 10px 0 0;
  text-align: center;
  border-width: 0;
  border-radius: 15px;
`;

export default withRouter(Login);
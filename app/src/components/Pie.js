import React from 'react';
import ReactApexChart from "react-apexcharts";
import styled from 'styled-components';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                legend: {
                    position: 'bottom',
                },
                chart: {
                    width: '10%',
                    height: '10%'
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.allocation !== prevProps.allocation) {
            if (this.props.allocation) {
                const labels = Object.keys(this.props.allocation.allocation);
                const series = labels.map(key => this.props.allocation.allocation[key])
                this.setState({
                    options: {
                        ...this.state.options,
                        labels: Object.keys(this.props.allocation.allocation)
                    },
                    series
                })
            }
        }
    }

    componentDidMount() {
        const labels = Object.keys(this.props.allocation.allocation);
        const series = labels.map(key => this.props.allocation.allocation[key])
        this.setState({
            options: {
                ...this.state.options,
                labels: Object.keys(this.props.allocation.allocation)
            },
            series
        })
    }

    render() {
        const { options, series } = this.state;
        console.log(series)
        if (series)
            console.log(series.filter(s => s < 0));
        return (
            <React.Fragment>
                {series && series.filter(s => s < 0).length > 0 && <Warning>Warning: Nonsensical weigths!</Warning>}
                {options.labels && <ReactApexChart options={options} series={series} type="donut" />}
                <Line>Return: {this.props.allocation.ev * 100}%</Line>
                <Line>Risk: {this.props.allocation.std * 100}%</Line>
                <Line>Time: {new Date(this.props.allocation.start).getFullYear()} - {new Date(this.props.allocation.stop).getFullYear()}</Line>
            </React.Fragment>
        )
    }
}

const Line = styled.p`
    margin: 0;
`;

const Warning = styled.p`
    color: red;
    margin: 0;
`;

export default SideBar;
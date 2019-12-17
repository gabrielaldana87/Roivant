import React , { Component } from 'react';
import Svg from './chart/elements/Svg';
import ToolTip from './chart/elements/ToolTip';
import ChartOne from './chart/graph/ChartOne';
import ChartTwo from './chart/graph/ChartTwo';
import ChartThree from './chart/graph/ChartThree';
import ChartFour from './chart/graph/ChartFour';
import { csv , sum , max , scaleBand , scaleTime } from 'd3';
import Select from 'react-select';
import _ from 'underscore';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns:[],
      data: [],
      chartOneYDomain: [0, 100],
      chartOneXDomain: ['Total'],
      keys: [],
      aggregateColumns: null,
      cumulativePayments: [],
      timeDomain: [ ]
    }
  }
  ;
  sumPayment (d , key) {
    return sum(d, o => o[key] );
  }
  ;
  calculateCumulativePmt (d) {
    var summary = 0 ;
    const schedule = _.uniq( d , o => o['Date_of_Payment']).map(o => {
      return {
        date: new Date(o['Date_of_Payment']) ,
        pmt: sum(_.filter( d , e => e['Date_of_Payment'] == o['Date_of_Payment']) , k => k['Total_Amount_of_Payment_USDollars'])
      }
    }).sort( (a , b) => a.date - b.date );
      return schedule.map((o,i) => {
        summary += parseInt(o['pmt']);
        return {
          date: o['date'],
          totalSum: summary
        }
      });
  }
  ;
  ready (data) {
    const
      totalPmt = this.sumPayment(data, 'Total_Amount_of_Payment_USDollars'),
      cumulativePayments = this.calculateCumulativePmt( data ),
      timeDuration = _.uniq(data, o => o['Date_of_Payment']).map(o => new Date(o['Date_of_Payment'])).sort((a,b) => a - b),
      timeDomain = [ timeDuration[0], timeDuration[timeDuration.length - 1]]
    ;

    this.setState({ aggregateColumns : [{ 'sum' : totalPmt , 'key': 'Total' , totalSum: this.calculateCumulativePmt( data )}]});

    this.setState({ cumulativePayments : cumulativePayments });

    var columns = data.columns.map((o,i) => {
      return {
        value: i,
        label: o
      }
    });

    this.setState({ columns : columns });

    this.setState({ data : data });

    this.setState({ chartOneYDomain : [ 0 ,  totalPmt ]});

    this.setState({ timeDomain : timeDomain });



  }
  ;
  filter = (val) => {
    let
      data = this.state.data,
      uniq = _.uniq(data, o => o[ val.label ]),
      keys = uniq.map(o => o[ val.label ])
      ;
    this.setState({ keys: keys });
    this.setState({ chartOneXDomain : keys });

    let summation = keys.map(o => {
      const filteredDataSet = _.filter(data, k => k[ val.label ] === o );
      return {
        key: o ,
        sum: this.sumPayment( filteredDataSet , 'Total_Amount_of_Payment_USDollars' ),
        totalSum: this.calculateCumulativePmt( filteredDataSet )
      }
    });

    this.setState({ aggregateColumns : summation });

    this.setState({ chartOneYDomain : [ 0 , max(summation, o => o['sum']) ]});

  }
  ;
  componentDidMount () {

    csv('./data/research-payments.csv')
      .then(res => this.ready(res) )
    ;

  }
  ;
  render () {
    let list = this.state.keys;
    let data = this.state.data;
    const
      width = 1200,
      height = 200,
      yDomain = this.state.chartOneYDomain,
      xDomain = this.state.chartOneXDomain,
      xDomainTime = this.state.timeDomain,
      aggregateColumns = this.state.aggregateColumns,
      position = `translate(20,0)`,
      margin = { top: 10, bottom: 10, right: 20, left: 20 }
      ;
    return (
      <>
      <div className=''>
        <ToolTip
          className='tooltip'
        />
        <ToolTip
          className='tooltip-chart-two'
        />
        <Select
          options={ this.state.columns }
          onChange= { this.filter }
        />
      </div>
        {/*<ul>*/}
          {/*{ list ? this.state.keys.map((o,i) => {*/}
            {/*return <li key= { i } > { o }</li>*/}
          {/*})*/}
            {/*: null*/}
          {/*}*/}
        {/*</ul>*/}
        <Svg className='roivant' width={ width + margin.left + margin.right } height={ height + margin.top + margin.bottom }>
          <ChartOne
            margin={ margin }
            dataset={ data }
            aggregateColumns={ aggregateColumns }
            className='chart_one'
            yAxisClassName='chart--one--axis--y'
            xAxisClassName='chart--one--axis--x'
            scale={ scaleBand }
            width={ ( width + margin.left + margin.right )  * 1 }
            height={ ( height + margin.top + margin.bottom ) * .80  }
            yDomain={ yDomain }
            xDomain={ xDomain }
            position={ position }
          >
          </ChartOne>
        </Svg>
        <Svg className='roivant--two' width={ width + margin.left + margin.right } height={ height + margin.top + margin.bottom }>
          <ChartTwo
            margin={ margin }
            aggregateColumns={ aggregateColumns }
            yAxisClassName='chart--two--axis--y'
            xAxisClassName='chart--two--axis--x'
            scale={ scaleTime }
            width={ ( width + margin.left + margin.right )  * 1 }
            height={ ( height + margin.top + margin.bottom ) * .80 }
            className='chart_two'
            position={ position }
            xDomain={ xDomainTime }
            yDomain={ yDomain }
          ></ChartTwo>
        </Svg>
          {/*<ChartThree className='chart_three'></ChartThree>*/}
          {/*<ChartFour className='chart_four'></ChartFour>*/}
      </>
  )
  }
}

export default MainPage;


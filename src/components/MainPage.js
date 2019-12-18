import React , { Component } from 'react';
import Container from './containers/Container';
import Svg from './chart/elements/Svg';
import ToolTip from './chart/elements/ToolTip';
import ChartOne from './chart/graph/ChartOne';
import ChartTwo from './chart/graph/ChartTwo';
import ChartThree from './chart/graph/ChartThree';
import ChartFour from './chart/graph/ChartFour';
import { csv , sum , max , scaleBand , scaleTime } from 'd3';
import Select from 'react-select';
import ReactDataGrid from 'react-data-grid';
import _ from 'underscore';
import './MainPage.scss';

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
      timeDomain: [],
      nullValuesInColumn: []
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

    this.setState({ nullValuesInColumn : [{ name : 'Number of Rows' , value: data.length }]});

    this.setState({ columns : data.columns.map((o,i) => {
      return {
        value: i,
        label: o,
        key: o,
        name: o,
        resizable: true,
        width: 120
      }
    }) });

    this.setState({ data : data });

    this.setState({ chartOneYDomain : [ 0 ,  totalPmt ]});

    this.setState({ timeDomain : timeDomain });

  }
  ;
  filter = (val) => {
    let
      data = this.state.data,
      uniq = _.uniq(data, o => o[ val.label ]),
      keys = uniq.map(o => o[ val.label ]),
      arr1 = [],
      arr2 = [],
      obj = {},
      countone = 0,
      counttwo = 0,
      reduce = data.reduce( (a,o) => {
        if ( o[ val.label ] !== null && o[ val.label ] !== '' ) {
          countone += 1;
          obj['valueExists'] = countone;
        } else {
          counttwo += 1;
          obj['valueEmpty'] = counttwo;
        }
        return obj;
      },0),
      nullDataSet = Object.keys(reduce).map(o => { return { name: o, value: reduce[o] }})
    ;
    this.setState({ nullValuesInColumn : nullDataSet });
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
      width = 1000,
      height = 200,
      yDomain = this.state.chartOneYDomain,
      xDomain = this.state.chartOneXDomain,
      xDomainTime = this.state.timeDomain,
      aggregateColumns = this.state.aggregateColumns,
      nullValuesInColumn = this.state.nullValuesInColumn,
      position = `translate(20,0)`,
      margin = { top: 10, bottom: 10, right: 20, left: 20 }
      ;
    return (
      <>
      <div>
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
      <div className='container'>
          <Container
            id={ 'one' }
            title='Total Payment By Column'
            width='73%'
          >
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
          </Container>
          <Container
            id={ 'two' }
            title='Missing Data'
            width='25%'
          >
            <Svg className='roivant--three' width= { (width * .25) + margin.left + margin.right } height={ (height * 1 + margin.top + margin.bottom )} >
              <ChartThree
                margin={ margin }
                nullValuesInColumn={ nullValuesInColumn }
                width={ width * .25 }
                height={ height * 1.1 }
                className='chart_three'
                radius={ Math.min( width * .25 , height * 1 )/2 }
                thickness={ 40 }
              />
            </Svg>
          </Container>
        </div>
      <Container
        title='Aggregate Payments by Column'
        width='73%'
        id={ 'three' }
      >
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
      </Container>
      <Container
        title='Transaction History'
      >
        <ReactDataGrid
          columns={ this.state.columns }
          rowGetter={ i => this.state.data[i] }
          rowsCount={ this.state.data.length  }
          width={ 600 }
          sortable={ true }
          minHeight={ 200 }
        />
      </Container>

          {/*<ChartThree className='chart_three'></ChartThree>*/}
          {/*<ChartFour className='chart_four'></ChartFour>*/}
      </>
  )
  }
}

export default MainPage;


import React , { Component } from 'react';
import G from '../elements/G';
import AxisX from '../elements/AxisX';
import AxisY from '../elements/AxisY';
import * as d3 from 'd3';
import './ChartTwo.scss';

class ChartTwo extends Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }
  ;
  line () {
    let
      x = this.xScale(),
      y = this.yScale()
    ;
    return d3.line()
      .defined(d => !isNaN(x(d.date)) )
      .x(d => x(d['date']) )
      .y(d => y(d['totalSum']) );
  }
  ;
  cScale () {
    const { aggregateColumns } = this.props;
    return d3.scaleSequential(d3.interpolateViridis)
      .domain([0, aggregateColumns.length ]);
  }
  ;
  xScale () {
    const { width , xDomain } = this.props;
    if ( !xDomain ) return ;
    return d3.scaleTime().domain(xDomain).range([0, width]);
  }
  ;
  yScale () {
    const { height , yDomain } = this.props;
    if ( !yDomain ) return ;
    return d3.scaleLinear()
      .domain(yDomain)
      .range([height , 0]);
  }
  ;
  componentDidUpdate () {
    const
      { className , aggregateColumns , height , margin , width } = this.props,
      g = d3.select(`.${ className }`).attr('transform', `translate(${ margin.left }, ${ margin.right })`),
      tooltip = d3.select('.tooltip-chart-two'),
      tooltipLine = g.append('line'),
      xScale = this.xScale(),
      yScale = this.yScale(),
      colors = this.cScale(),
      line = this.line()
    ;
    g.selectAll('.line').remove()
    ;
    g.selectAll('.line')
      .data(aggregateColumns)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d' , d => line(d['totalSum']))
      .attr('stroke', (d,i) => colors(i) )
      .style('opacity', .5 )
    ;
    let tipBox = g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('opacity', 0)
      .on('mousemove', d => {
        const
          format = d3.timeFormat('%m/%d/%Y'),
          day = format(xScale.invert(d3.mouse(tipBox.node())[0])),
          intersection = aggregateColumns.map(o => {
            return {
              label: o['key'],
              amount: o['totalSum'].find(k => format(k.date) == day)
            }
          })
          ,
          label =
            tooltip
            .style('opacity', .9 )
            .style('left', `${ d3.event.pageX + 30 }px` )
            .style('top', `${ d3.event.pageY - 30 }px` )
            .selectAll('.tooltip-label')
            .data(intersection.filter(o => o.amount ))
        ;
        label.remove()
        ;
        label
          .enter()
          .append('div')
          .attr('class', d => 'tooltip-label' )
          .html(d => `${ d.label } : ${ d.amount == undefined ? 0 : d.amount.totalSum }`)
      })
  }
  ;
  render () {
    const
      { ... props } = this.props,
      margin = props.margin,
      transform = `translate(${ margin.left },${ margin.right })`
  ;
    return (
      <G { ... props } transform={ transform }>
        <AxisX { ... props } />
        <AxisY { ... props } />
      </G>
    )
  }

}

export default ChartTwo;
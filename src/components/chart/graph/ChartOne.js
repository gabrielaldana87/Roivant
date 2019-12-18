import React , { Component } from 'react';
import G from '../elements/G';
import AxisX from '../elements/AxisX';
import AxisY from '../elements/AxisY';
import * as d3 from 'd3';

class ChartOne extends Component {
  constructor (props) {
    super(props);
    this.state = {
    }
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
    return d3.scaleBand()
      // .padding(.2)
      .paddingInner(.2)
      .paddingOuter(.2)
      .domain(xDomain)
      .range([0, width]);
  }
  ;
  yScale () {
    const { height , yDomain } = this.props;
    if ( !yDomain ) return ;
    return d3.scaleLinear()
      .domain(yDomain)
      .range([0 , height]);
  }
  ;
  componentDidUpdate () {
    const
      { className , aggregateColumns , height , margin } = this.props,
      g = d3.select(`.${ className }`).attr('transform', `translate(${ margin.left }, ${ margin.right })`),
      xScale = this.xScale(),
      yScale = this.yScale(),
      colors = this.cScale(),
      tooltip = d3.select('.tooltip')
    ;
    g.selectAll('rect').remove()
    ;
    g.selectAll('rect')
      .data(aggregateColumns)
      .enter()
      .append('rect')
      .attr('width', d => xScale.bandwidth() )
      .attr('x', d => xScale(d['key']) )
      .attr('height', d => yScale(+d['sum']) )
      .attr('y',  d => height - yScale(+d['sum']) )
      .attr('fill' , (d,i) => colors(i) )
      .attr('transform', `translate(${ margin.left },0)`)
      .on('mouseover', d => {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', .9 )
          .style('left', `${ d3.event.pageX - 35 }px` )
          .style('top' , `${ d3.event.pageY - 30 }px` )
        ;
        tooltip.select('.tooltip-inner-tool')
          .text( d.key )
        ;
      })
      .on('mouseout', () => tooltip.select('.inner-tool').text( '' ))
      .on('click', d => {
      })
    ;
  }
  ;
  render () {
    const
      { ... props  } = this.props,
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

export default ChartOne;
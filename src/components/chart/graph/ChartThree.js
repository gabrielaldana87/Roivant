import React , { Component } from 'react';
import G from '../elements/G';
import * as d3 from 'd3';

class ChartThree extends Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }
  ;
  cScale () {
    const { nullValuesInColumn } = this.props;
    return d3.scaleSequential(d3.interpolateViridis)
      .domain([0, nullValuesInColumn.length ]);
  }
  ;
  arc () {
    const { radius , thickness } = this.props ;
    return d3.arc()
      .innerRadius( radius - thickness )
      .outerRadius( radius );
  }
  ;
  pie () {
    return d3.pie()
      .value(d => d['value'] )
      .sort(null);
  }
  ;
  componentDidUpdate () {
    const
      { className , height , margin , width , nullValuesInColumn } = this.props,
      g = d3.select(`.${ className }`).attr('transform', `translate(${ width/1.35 }, ${ height/2 })`),
      pie = this.pie(),
      arc = this.arc(),
      colors = this.cScale()
    ;
    g.selectAll('path').remove()
    ;
    g.selectAll('path')
      .data( pie(nullValuesInColumn) )
      .enter()
      .append('g')
      .on('mouseover', (d,i,t) => {
        let g = d3.select(t[i])
          .style('cursor', 'pointer' )
          .style('fill', 'rgb(42, 54, 59)' )
          .append('g')
          .attr('class', 'text-group' )
          ;
        g.append('text')
          .attr('class', 'name-text' )
          .text(`${ d.data.name }`)
          .attr('text-anchor', 'middle' )
          .attr('dy', '-1.2em')
          ;
        g.append('text')
          .attr('class', 'value-text' )
          .text(`${ d.data.value }`)
          .attr('text-anchor', 'middle' )
          .attr('dy', '.9em' );
      })
      .on('mouseout', (d,i,t) => {
        d3.select(t[i])
          .style('cursor', 'none' )
          .style('fill', colors( this._current ))
          .select('.text-group').remove();
      })
      .append('path')
      .attr('d' , arc )
      .attr('fill', (d,i) => colors(i) );
  }
  ;
  render () {
    const { ... props } = this.props;
    return (
      <G { ... props}></G>
    )
  }

}

export default ChartThree;
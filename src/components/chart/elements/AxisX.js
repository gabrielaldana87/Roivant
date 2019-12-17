import React , { Component } from 'react';
import G from './G';
import { select , axisBottom } from 'd3';

class AxisX extends Component {
  xScale () {
    const { width , xDomain , scale } = this.props;
    if ( !xDomain ) return ;
    return scale().domain(xDomain).range([0, width]);
  }
  ;
  xAxis () {
    const xScale = this.xScale();
    return axisBottom(xScale);
  }
  ;
  componentDidUpdate () {
    const
      { xAxisClassName , height , margin } = this.props,
      xAxis = this.xAxis()
    ;
    select(`.${ xAxisClassName }`)
      .attr('transform' , `translate(${ margin.right },${ height })`)
      .call(xAxis);
  }
  ;
  render() {
    const { position, x , y, text, fontSize , xAxisClassName , scale } = this.props;
    const style = { textAnchor: 'end' , 'fill': '#000'  };
    return (
      <G className={ xAxisClassName } transform={ position }>
        <text
          className='label'
          x={ x }
          y={ y }
          style={ style }
        >{ text }</text>
      </G>
    )
  }
}

export default AxisX;

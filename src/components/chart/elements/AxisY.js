import React , { Component } from 'react';
import G from './G';
import { select , scaleLinear , axisLeft , format } from 'd3';

class AxisY extends React.Component {
  yScale () {
    const { height , yDomain } = this.props;
    if ( !yDomain ) return ;
    return scaleLinear().domain(yDomain).range([height , 0]);
  }
  ;
  yAxis () {
    const yScale = this.yScale();
    return axisLeft(yScale)
      .tickFormat(format('.0s'));;
  }
  ;
  componentDidUpdate () {
    const
      { yAxisClassName , position } = this.props,
      yAxis = this.yAxis()
    ;
    select(`.${ yAxisClassName }`)
      .call(yAxis);
  }
  ;
  render() {
    const { position, transformText, x , y, dy, text , yAxisClassName } = this.props;
    const style = { textAnchor: 'end' , 'fill': '#000'  };
    return (
    <G className={ yAxisClassName } transform={ position }>
      <text
        className='label'
        transform={ transformText }
        x={ x }
        y={ y }
        dy={ dy }
        style={ style }
      >{ text }</text>
    </G>
  )
  }
}

export default  AxisY;
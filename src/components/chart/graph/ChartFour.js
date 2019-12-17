import React , { Component } from 'react';
import G from '../elements/G';

class ChartFour extends Component {
  constructor (props) {
    super(props);
    this.state = {
    }
  }
  ;
  render () {
    const { ... props } = this.props;
    return (
      <G { ... props}></G>
    )
  }

}

export default ChartFour;
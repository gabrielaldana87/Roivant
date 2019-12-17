import React , { Component } from 'react';

class Svg extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  ;
  render () {
    const { className, width, height, children } = this.props;
    return (
      <svg
        className={ className }
        width={ width }
        height={ height }
      >
        { children }
      </svg>
    )
  }
}

export default Svg;
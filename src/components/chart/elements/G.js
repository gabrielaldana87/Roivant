import React , { Component } from 'react';

class G extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  ;
  render () {
    const { className, transform, width, height, children } = this.props;
    return (
      <g
        className={ className }
        width={ width }
        height={ height }
        transform={ transform }
      >
        { children }
      </g>
    )
  }
}

export default G;
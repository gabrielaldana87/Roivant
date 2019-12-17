import React , { Component } from 'react';

class ToolTip extends Component {
  constructor (props) {
    super (props);
    this.state = {
    }
  }
  ;
  render () {
    const { className } = this.props ;
    const innerClass = `${ className }-inner-tool`;
    const style = { position: 'absolute' , padding: '0 10px' , background: 'white' , opacity: 0 }
    return (
      <div className={ className } style={ style }>
        <div className={ innerClass } style={{ fontSize: '.5rem' , fontWeight: 'bold'}}></div>
      </div>
    )
  }
}

export default ToolTip;
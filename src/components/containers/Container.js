import React , { Component } from 'react';
import './Container.scss';

class Container extends Component {
  constructor (props) {
    super (props);
      this.state= {
      }
  }
  ;
  render () {
    const { children , title , width , id } = this.props;
    return (
      <div className='widget' style={{ width : width }} id={ id }>
        <div className='layers bd bgc-white p-20'>
          <div className='layer w-100 mb-10'>
            <h6 className='lh-1'>{ title }</h6>
          </div>
          { children }
        </div>
      </div>
    )
  }
}

export default Container;
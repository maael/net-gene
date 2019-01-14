import React from 'react';
import theme from '../theme';

export default class Button extends React.Component {
  state = {
    hovering: false
  }
  render () {
    const {color, hoverColor, active, children, onClick = () => {}} = this.props;
    const {hovering} = this.state;

    return (
      <button
        onMouseEnter={() => {
          this.setState({hovering: true})
        }}
        onMouseLeave={() => {
          this.setState({hovering: false})
        }}
        onClick={onClick}
        style={{
          padding: 10,
          background: active ? color : (hovering ? hoverColor : '#ffffff'),
          color: hovering || active ? '#ffffff' : '#000000',
          borderColor: color,
          borderWidth: 4,
          borderStyle: 'solid',
          position: 'absolute',
          cursor: 'pointer',
          top: '50%',
          transform: 'translateY(-50%)',
          right: theme.padding,
          outline: 'none'
        }}
      >
        {children}
      </button>
    )
  }
}

/**
 * This file contains React component for Panel
 *
 * @author Alex I.
 * @version 1.0.0
 *
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Pencil, Node} from './Icons';

/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */
class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: this.props.initCollapsed,
    };

    // Initialize panel class based on collapsed status
    this.panelClass = (
      this.props.initCollapsed ?
        'panel-collapse collapse' :
        'panel-collapse collapse in'
    );

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    // Change arrow direction based on collapse status
    let glyphClass = (
      this.state.collapsed ?
        'glyphicon pull-right glyphicon-chevron-down' :
        'glyphicon pull-right glyphicon-chevron-up'
    );

    // Add panel header, if title is set
    const panelHeading = this.props.title ? (
      <div
        className="panel-heading"
        onClick={this.toggleCollapsed}
        data-toggle="collapse"
        data-target={'#' + this.props.id}
        style={{cursor: 'pointer'}}
      >
        {this.props.title}
        <span className={glyphClass}></span>
      </div>
    ) : '';

    return (
      <div className="panel panel-primary">
        {panelHeading}
        <div id={this.props.id} className={this.panelClass} role="tabpanel">
          <div className="panel-body" style={{height: this.props.height}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  id: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
};
Panel.defaultProps = {
  initCollapsed: false,
  id: 'default-panel',
  height: '100%',
};

export function Panels({height = 500, children, grow}) {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    minHeight: height,
  };

  const panels = React.Children.map(children, (child, i) => {
    return <SimplePanel grow={grow[i]}>{child}</SimplePanel>;
  });

  return <div style={style}>{panels}</div>;
}

export function SimplePanel({
  flex = 1,
  title,
  edit,
  children,
}) {
  const [hover, setHover] = useState(false);
  const hoverOn = () => setHover(true);
  const hoverOff = () => setHover(false);

  const Header = ({title = null, edit}) => {
    const style = {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#E4EBF2',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      borderBottom: '1px solid #DDD',
    };
    if (!title) {
      return null;
    }
    return (
    <>
      <div style={style}>
        <Node title={title.charAt(0).toUpperCase()}/>
        <div style={{fontSize: 24}}>{title}</div>
        <Pencil onClick={edit}/>
      </div>
    </>
    );
  };

  const Body = ({children}) => {
    const style = {
      padding: '10px 25px',
      overflow: 'auto',
    };
    return <div style={style}>{children}</div>;
  };

  const panelStyle = {
    border: '1px solid ' + (hover ? '#A6D3F5' : '#DDD'),
    borderRadius: '10px',
    margin: '10px',
    boxShadow: 'rgb(0 0 0 / 13%) 1px 7px 11px 2px',
  };

  return (
    <div
      style={panelStyle}
      onMouseOver={hoverOn}
      onMouseOut={hoverOff}
    >
      <Header title={title} edit={edit}/>
      <Body>{children}</Body>
    </div>
  );
}

export default Panel;

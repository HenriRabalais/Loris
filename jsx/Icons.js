import React, {useState} from 'react';

export function Pencil({onClick}) {
  return onClick instanceof Function && (
    <span
      className={'glyphicon glyphicon-pencil'}
      onClick={onClick}
    />
  );
}

export function Node(props) {
  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#FFFFFF',
    border: '2px solid #A6D3F5',
    borderRadius: '50%',
    color: '#768CAD',
    height: 45,
    width: 45,
    zIndex: 2,
    userSelect: 'none',
  };

  const letterStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'default',
  };

  return <div style={style}><div style={letterStyle}>{props.title}</div></div>;
}

export function ActionButton({title, onClick, icon = 'chevron-right'}) {
  const [hover, setHover] = useState(false);
  const hoverOn = () => setHover(true);
  const hoverOff = () => setHover(false);

  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#E89A0C',
    borderRadius: '50%',
    height: 45,
    width: 45,
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E89A0C',
    boxShadow: hover && '0 6px 10px 0 rgba(0, 0, 0, 0.2), 0 8px 22px 0 rgba(0, 0, 0, 0.19)',
  };

  const glyphStyle = {
    fontSize: '20px',
    top: 2,
  };

  return (
    <span
      title={title}
      style={style}
      onClick={onClick}
      onMouseOver={hoverOn}
      onMouseOut={hoverOff}
    >
      <span style={glyphStyle} className={'glyphicon glyphicon-'+icon}/>
    </span>
  );
}

export function Options(props) {
    const [show, setShow] = useState(false);
    const onClick = (e) => {
      setShow(true);
      console.log(e.clientX);
      console.log(e.clientY);
    };
    const ToolTip = ({show}) => {
      if (!show) return null;
      const styleTool = {
        width: '200px',
        height: '400px',
        zIndex: 3,
        backgroundColor: 'white',
        boxShadow: 'rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px',
        position: 'absolute',
      };
      return (
        <div style={styleTool}/>
      );
    };
    return (
      <>
        <ActionButton title='Options' onClick={onClick} icon={'option-horizontal'}/>
        <ToolTip show={show}/>
      </>
    );
  };


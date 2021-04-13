import React, {useState} from 'react';

const theme = {
  primary: '#053665',
  secondary: '#A6D3F5',
  accent: '#E89A0C',
  neutral: '#DDD',
};

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

function ToolTip({children, show}) {
  if (!show) return null;
  const styleTool = {
    width: '200px',
    height: '400px',
    zIndex: 3,
    borderRadius: 2,
    backgroundColor: 'white',
    boxShadow: 'rgb(15 15 15 / 19%) 1px 8px 13px 5px',
    position: 'absolute',
  };
  return (
    <div style={styleTool}>{children}</div>
  );
};

export function DropMenu({children, title}) {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(false);
  const hoverOn = () => setHover(true);
  const hoverOff = () => setHover(false);

  const style = {
    display: 'flex',
    alignItems: 'center',
    margin: '0px 2px',
    borderRadius: '2px',
    padding: '2px',
    background: hover && theme.neutral,
    cursor: 'pointer',
  };

  const onClick = (e) => {
    setShow(true);
    console.log(e.clientX);
    console.log(e.clientY);
  };
  return (
    <>
      <div
        style={style}
        onClick={onClick}
        onMouseOver={hoverOn}
        onMouseOut={hoverOff}
      >
        Load Preset
        <span className={'glyphicon glyphicon-chevron-down'}/>
      </div>
      <ToolTip show={show}>{children}</ToolTip>
    </>
  );
}

export function Options(props) {
    const [show, setShow] = useState(false);
    const onClick = (e) => {
      setShow(true);
      console.log(e.clientX);
      console.log(e.clientY);
    };
    return (
      <>
        <ActionButton title='Options' onClick={onClick} icon={'option-horizontal'}/>
        <ToolTip show={show}/>
      </>
    );
  };


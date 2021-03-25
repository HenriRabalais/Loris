/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */

import React from 'react';
import LoadingBar from 'jsx/LoadingBar';

function Loader({size = 120, progress = null}) {
  const containerStyle = {
    height: 'inherit',
    width: 'inherit',
    display: 'flex',
  };
  const loaderStyle = {
    width: parseInt(size),
    height: parseInt(size),
    borderWidth: parseInt(size)/15,
  };
  const progressBar = progress && (
    <LoadingBar progress={progress}/>
  );
  return (
    <div style={containerStyle}>
      <div
        className='loader'
        style={loaderStyle}
      />
      {progressBar}
    </div>
  );
}

export function Saving({loading}) {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const style = {margin: '0 4px'};

  return loading && (
    <div style={containerStyle}>
      <div style={style}>
        <Loader size={20}/>
      </div>
      <div style={style}>
        <h5 className='animate-flicker'>Saving...</h5>
      </div>
    </div>
  );
}

export default Loader;

/* exported RPaginationLinks */

import React, {useState} from 'react';

const theme = {
  primary: '#053665',
  secondary: '#A6D3F5',
  accent: '#E89A0C',
  neutral: '#DDD',
};

/**
 * @param {jsx} children
 * @param {bool} active
 * @param {func} onClick
 * @return {jsx}
 */
function PaginationNumber({
  children,
  active,
  onClick,
}) {
  const [hover, setHover] = useState(false);
  const hoverOn = () => setHover(true);
  const hoverOff = () => setHover(false);
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    margin: '0px 2px',
    background: onClick && hover && !active && theme.neutral,
    border: active && '1px solid '+theme.primary,
    borderRadius: '50%',
    cursor: onClick && 'pointer',
  };

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseOver={hoverOn}
      onMouseOut={hoverOff}
    >
       {children}
    </div>
  );
};

/**
 * @param {int} rowsPerPage
 * @param {int} total
 * @param {bool} active
 * @param {func} onChangePage
 * @return {jsx}
 */
function PaginationLinks({
  rowsPerPage = 10,
  total,
  active,
  onChangePage,
}) {
  let pageLinks = [];
  const lastPage = Math.ceil(total / rowsPerPage) || 1;
  if (lastPage < active) {
    onChangePage(1);
  }

  let startPage = 1;
  let endPage = lastPage;
  if (lastPage > 5) {
    if (active - 2 > 1) {
      startPage = active - 2;
    }
    if (active + 2 < lastPage) {
      endPage = active + 2;
    }
  }

  if (total === 0 || total < rowsPerPage || lastPage === 1) {
    return null;
  }

  if (active - 2 > 1) {
    pageLinks = [
      <PaginationNumber
        key={1}
        onClick={() => onChangePage(1)}
      >
        1
      </PaginationNumber>,
      <PaginationNumber key={'front_ellipsis'}>...</PaginationNumber>,
    ];
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pageLinks = [...pageLinks,
      <PaginationNumber
        key={i}
        active={active === i}
        onClick={() => onChangePage(i)}
      >
        {i}
      </PaginationNumber>,
    ];
  }

  if (active + 2 < lastPage) {
    pageLinks = [...pageLinks,
      <PaginationNumber key={'back_ellipsis'}>...</PaginationNumber>,
      <PaginationNumber
        key={lastPage}
        onClick={() => onChangePage(lastPage)}
      >
        {lastPage}
      </PaginationNumber>,
    ];
  }

  const paginationStyle = {
    display: 'flex',
    fontSize: 16,
  };

  return <div style={paginationStyle}>{pageLinks}</div>;
}

export default PaginationLinks;

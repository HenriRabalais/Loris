import React, {useState, useEffect} from 'react';
import {ActionButton, Options} from 'jsx/Icons';
import PaginationLinks from 'jsx/PaginationLinks';

const Cell = ({children, onClick}) => {
  const style = {
    padding: '10px',
    borderTop: '1px solid #DDD',
    borderLeft: '1px solid #DDD',
  };
  return <div style={style} onClick={onClick}>{children}</div>;
};

const Header = ({children, onClick}) => {
  const style = {
    fontSize: '16px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  };
  return (
    <Cell onClick={onClick}>
      <div style={style}>
        {children}
      </div>
    </Cell>
  );
};

/**
 * Data Table component
 * Displays a set of data that is receives via props.
 *
 * @param {array} data
 * @param {object} filter
 * @param {array} fields
 * @param {function} getMappedCell
 * @param {function} getFormattedCell
 * @param {array} actions
 * @param {jsx} folder
 *
 * @return {jsx}
 */
function DataTable({
  data = [],
  filter = {},
  fields = [],
  getMappedCell,
  getFormattedCell,
  actions,
  folder,
}) {
  const [page, setPage] = useState({number: 1, rows: 20});
  const columns = fields;
  const dataHand = new useData(data, columns, filter);
  useEffect(() => {
    dataHand.filterData(filter);
  }, [filter]);
  dataHand.setMapper(getMappedCell);
  const rows = dataHand.getData();

  const changePage = (number) => {
    const newPage = {...page, number};
    setPage(newPage);
  };

  const updatePageRows = (e) => {
    const newPage = {rows: e.target.value, number: 1};
    setPage(newPage);
  };

  const renderActions = () => {
    if (actions) {
      return actions.map((action, key) => {
        if (action.show !== false) {
          return (
            <CTA
              key = {key}
              label = {action.label}
              onUserInput = {action.action}
            />
          );
        }
      });
    }
  };

  const Table = (props) => {
    if (rows === null || rows.length === 0) {
      return <strong>No result found.</strong>;
    }

    const headers = columns
    .filter((column) => column.show)
    .map((column, i) => {
      return (
        <Header key={i+1} onClick={() => dataHand.sortData(i)}>
          {column.label}
        </Header>
      );
    });

    // let currentPageRow = (page.rows * (page.number - 1));
    let cells = [];

    // Format each cell for the data table.
    const pageRows = [...rows].splice(page.rows*(page.number-1), page.rows);
    pageRows.forEach((row, i) => {
      columns.forEach((column, j) => {
        if (!column.show) {
          return;
        }
        let value = row[j];
        let rowValues = {};
        columns.forEach((column, k) => rowValues[column.label] = row[k]);
        const cell = getFormattedCell instanceof Function ?
          getFormattedCell(column.label, value, rowValues) : value;

        cells = [...cells, <Cell key={i+'_'+j}>{cell}</Cell>];
      });
    });

    const tableStyle = {
      display: 'grid',
      gridTemplateRows: 'repeat('+rows.length+', auto)',
      gridTemplateColumns: 'repeat('+headers.length+', auto)',
      overflow: 'auto',
    };

    return (
      <div style={tableStyle}>
        {headers}
        {folder}
        {cells}
      </div>
    );
  };

  const HeaderBlock = (props) => {
    const rowsPerPageDropdown = (
      <select
        className="input-sm perPage"
        onChange={updatePageRows}
        value={page.rows}
      >
        <option>20</option>
        <option>50</option>
        <option>100</option>
        <option>1000</option>
        <option>5000</option>
        <option>10000</option>
      </select>
    );
    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 15px',
    };
    const actionStyle = {
      display: 'flex',
      alignItems: 'center',
    };
    return (
      <div>
        <div style={headerStyle}>
          <div style={actionStyle}>
            {renderActions()}
            <ActionButton
              title="Download"
              onClick={dataHand.download}
              icon={'download-alt'}
            />
            <Options/>
          </div>
          <PaginationLinks
            total={rows.length}
            onChangePage={changePage}
            rowsPerPage={page.rows}
            active={page.number}
          />
          <div style={actionStyle}>
            {rowsPerPageDropdown} of {rows.length}.
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <HeaderBlock/>
      <Table/>
    </>
  );
}

function useData(initData = [], initColumns = []) {
  const [rawData, setRawData] = useState(initData);
  const [data, setData] = useState(initData);
  const [sort, setSort] = useState({column: 0, ascending: true});
  const [columns] = useState(initColumns);

  this.getData = () => data;
  this.setMapper = (mapper) => this.mapper = mapper;

  this.filterData = (filters) => {
    if (!filters) return;
    const filteredData = rawData.filter((row, rowIndex) => {
      return columns.every((column, columnIndex) => {
        if (!column.filter || !filters[column.filter.name]) {
          return true;
        }

        const filter = filters[column.filter.name];
        const value = row[columnIndex];
        return this.hasFilterKeyword(filter, value);
      });
    });
    setData(filteredData);
  };

  this.sortData = (column) => {
    const ascending = column == sort.column ? !sort.ascending : true;
    const compare = (row1, row2) => {
      const a = row1[column];
      const b = row2[column];
      return ascending ? this.sortAscending(a, b) : this.sortDescending(a, b);
    };

    setData([...data].sort(compare));
    setRawData([...rawData].sort(compare));
    setSort({column, ascending});
  };

  this.sortAscending = (a, b) => {
    // Check if null values
    if (a === null || typeof a === 'undefined') return -1;
    if (b === null || typeof b === 'undefined') return 1;

    // Sort by value
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  this.sortDescending = (a, b) => {
    // Check if null values
    if (a === null || typeof a === 'undefined') return 1;
    if (b === null || typeof b === 'undefined') return -1;

    // Sort by value
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  };

  /**
   * Searches for the filter keyword in the column cell
   *
   * Note: Search is case-insensitive.
   *
   * @param {string} filter field
   * @param {string} data search string
   * @return {boolean} true, if filter value is found to be a substring
   * of one of the column values, false otherwise.
   */
  this.hasFilterKeyword = (filter, data) => {
    // Handle numeric inputs
    if (typeof filter.value === 'number') {
      const intData = Number.parseInt(data, 10);
      return filter.value === intData;
    }

    // Handle string inputs
    if (typeof filter.value === 'string') {
      const key = filter.value.toLowerCase();
      let hayStack;
      switch (typeof data) {
        case 'object':
          hayStack = data.map((e) => e.toLowerCase());
          if (filter.exactMatch) {
             return hayStack.includes(key);
          } else {
             return (hayStack.find((e) => (e.indexOf(key) > -1))) !== undefined;
          }
        default:
          hayStack = data ? data.toString().toLowerCase() : '';
          if (filter.exactMatch) {
            return (hayStack === key);
          } else if (filter.opposite) {
            return hayStack !== key;
          } else {
            return (hayStack.indexOf(key) > -1);
          }
      }
    }

    // Handle boolean inputs
    if (typeof filter.value === 'boolean') {
      return filter.value === data;
    }

    // Handle array inputs for multiselects
    if (typeof filter.value === 'object') {
      return filter.value.some((item) => {
        const key = item.toLowerCase();
        const hayStack = data ? data.toString().toLowerCase() : '';

        return (hayStack.indexOf(key) > -1);
      });
    }

    return false;
  };

  this.download = () => {
    // Map cell data to proper values if applicable.
    let csvData = data;
    if (this.mapper instanceof Function) {
      csvData = data
      .map((row, i) => columns
        .map((column, j) => this.mapper(column.label, row[j])));
    }

    let csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');

    csvworker.addEventListener('message', (e) => {
      let dataURL;
      let dataDate;
      let link;
      if (e.data.cmd === 'SaveCSV') {
        dataDate = new Date().toISOString();
        dataURL = window.URL.createObjectURL(e.data.message);
        link = document.createElement('a');
        link.download = 'data-' + dataDate + '.csv';
        link.type = 'text/csv';
        link.href = dataURL;
        document.body.appendChild(link);
        $(link)[0].click();
        document.body.removeChild(link);
      }
    });
    const headerList = columns.map((column) => column.label);
    csvworker.postMessage({
      cmd: 'SaveFile',
      data: csvData,
      headers: headerList,
    });
  };
}

export default DataTable;

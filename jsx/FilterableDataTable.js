import React, {useState} from 'react';
import PropTypes from 'prop-types';

import DataTable from 'jsx/DataTable';
import Filter from 'jsx/Filter';
import LoadingBar from 'jsx/LoadingBar';

/**
 * FilterableDataTable component.
 * A wrapper for all datatables that handles filtering.
 *
 * Handles the updating and clearing of the filter state based on changes sent
 * from the FitlerForm.
 *
 * Passes the Filter to the Datatable.
 *
 * Deprecates Filter Form.
  *
 * @param {object} props
 * @return {jsx}
 */
function FilterableDataTable(props) {
  const [filter, setFilter] = useState({});
  const {
    children,
    name,
    data,
    fields,
    actions,
    getFormattedCell,
    getMappedCell,
    folder,
    loading,
    filterPresets,
  } = props;

  /**
   * Updates filter state
   *
   * @param {object} filter passed from FilterForm
   */
  const updateFilter = (filter) => {
    const searchParams = new URLSearchParams();
    Object.entries(filter).forEach(([name, field]) => {
      if (field.value.constructor === Array) {
        field.value.forEach((v) => searchParams.append(name, v));
      } else {
        searchParams.append(name, field.value);
      }
    });
    history.replaceState(filter, '', `?${searchParams.toString()}`);
    setFilter(filter);
  };

  /**
   * Sets Filter to empty object
   */
  const clearFilter = () => {
    setFilter({});
    history.replaceState({}, '', '?');
  };

  /**
   * Returns the filter state, with filters that are
   * set to an invalid option removed from the returned
   * filters
   *
   * @return {object}
   */
  const validFilters = () => {
      let filters = {};
      fields.forEach((field) => {
        if (!field.filter) {
            return;
        }
        const filtername = field.filter.name;
        const filterval = filter[filtername];
        if (!filterval) {
            return;
        }

        if (field.filter.type !== 'select') {
            filters[filtername] = filterval;
            return;
        }

        if (!(filterval.value in field.filter.options)) {
            return;
        }
        filters[filtername] = filterval;
      });
      return filters;
  };

  const filters = validFilters();
  const dataTable = loading < 100 ? (
    <LoadingBar progress={loading}/>
  ) : (
    <DataTable
      data={data}
      fields={fields}
      filter={filters}
      actions={actions}
      getFormattedCell={getFormattedCell}
      getMappedCell={getMappedCell}
      folder={folder}
    />
  );

  return (
    <div style={{display: 'flex', flexFlow: 'row wrap'}}>
      <div style={{flex: '1', minWidth: '20em'}}>
        <Filter
          name={name + '_filter'}
          id={name + '_filter'}
          filter={filters}
          fields={fields}
          updateFilter={updateFilter}
          clearFilter={clearFilter}
          filterPresets={filterPresets}
        />
      </div>
      <div style={{flex: '4', minWidth: '75em'}}>
        {children}
        {dataTable}
      </div>
    </div>
  );
}

FilterableDataTable.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  getFormattedCell: PropTypes.func,
  actions: PropTypes.object,
};

export default FilterableDataTable;

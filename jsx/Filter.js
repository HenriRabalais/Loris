import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

/**
 * Filter component.
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 * @param {object} props
 * @return {jsx}
 */
function Filter(props) {
  const {
    filter = {},
    fields = [],
    updateFilter,
    id,
    name,
    title,
    clearFilter,
    filterPresets,
  } = props;

  useEffect(() => {
     const searchParams = new URLSearchParams(location.search);
     searchParams.forEach((value, name) => {
       if (fields.find((field) => (field.filter||{}).name == name)) {
         filter[name] = {value: searchParams.getAll(name)};
       }
     });
     updateFilter(filter);
  }, []);

  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   * @param {string} id - id of the form element
   * @param {string} type - type of the form element
   */
  const onFieldUpdate = (name, value, id, type) => {
    const newFilter = JSON.parse(JSON.stringify(filter));
    const exactMatch = (!(type === 'textbox' || type === 'date'));
    if (
      value === null
      || value === ''
      || (value.constructor === Array && value.length === 0)
    ) {
      delete newFilter[name];
    } else {
      newFilter[name] = {value, exactMatch};
    }
    updateFilter(newFilter);
  };

  const FilterPresets = () => {
    if (!filterPresets) {
      return null;
    };

    const presets = filterPresets.map((preset) => {
      const handleClick = () => updateFilter(preset.filter);
      return <li><a onClick={handleClick}>{preset.label}</a></li>;
    });
    return (
      <li className='dropdown'>
        <a
          className='dropdown-toggle'
          data-toggle='dropdown'
          role='button'
        >
          Load Filter Preset <span className='caret'/>
        </a>
        <ul className='dropdown-menu' role='menu'>
          {presets}
        </ul>
      </li>
    );
  };

  const filterFields = () => {
    return fields.map((field) => {
      if (field.filter && (field.filter.hide !== true)) {
        const passedProps = {
          key: field.filter.name,
          name: field.filter.name,
          label: field.label,
          value: (filter[field.filter.name] || {}).value || false,
          autoSelect: false,
          onUserInput: onFieldUpdate,
        };
        switch (field.filter.type) {
        case 'text':
          return <TextboxElement {...passedProps}/>;
        case 'select':
          return (
            <SelectElement
              {...passedProps}
              options={field.filter.options}
              sortByValue={field.filter.sortByValue}
            />
          );
        case 'multiselect':
          return (
            <SelectElement
              {...passedProps}
              options={field.filter.options}
              multiple={true}
              emptyOption={false}
            />
          );
        case 'numeric':
          return <NumericElement {...passedProps} options={field.filter.options}/>;
        case 'date':
          return <DateElement {...passedProps}/>;
        case 'checkbox':
          return <CheckboxElement {...passedProps}/>;
        default:
          return null;
        }
      }
    }, []);
  };

  return (
    <FormElement
      id={id}
      name={name}
    >
      <FieldsetElement
        legend={title}
      >
        <ul className='nav nav-tabs navbar-right' style={{borderBottom: 'none'}}>
          <FilterPresets/>
          <li>
            <a role='button' name='reset' onClick={clearFilter}>
              Clear Filter
            </a>
          </li>
        </ul>
        {filterFields()}
      </FieldsetElement>
    </FormElement>
  );
}

Filter.propTypes = {
  filter: PropTypes.object.isRequired,
  clearFilter: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  columns: PropTypes.string,
  title: PropTypes.string,
  fields: PropTypes.object.isRequired,
};

export default Filter;

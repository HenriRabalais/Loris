import React, {useEffect} from 'react';
import {SimplePanel} from './Panel';
import {DropMenu} from './Icons';

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
function Filter({
  filter = {},
  fields = [],
  updateFilter,
  clearFilter,
  filterPresets,
}) {
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

    const presets = filterPresets.map((preset, i) => {
      const handleClick = () => updateFilter(preset.filter);
      return <div key={i}><a onClick={handleClick}>{preset.label}</a></div>;
    });
    return <DropMenu>{presets}</DropMenu>;
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
    <SimplePanel>
      <FilterPresets/>
      <FormElement>{filterFields()}</FormElement>
      <a role='button' name='reset' onClick={clearFilter}>
        Clear Filter
      </a>
    </SimplePanel>
  );
}

export default Filter;

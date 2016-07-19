import React, {PropTypes, Component} from 'react';

import createFacetRefiner from '../createFacetRefiner';
import {itemsPropType, selectedItemsPropType} from '../propTypes';

import MenuLink from './MenuLink';

class Menu extends Component {
  static propTypes = {
    refine: PropTypes.func.isRequired,
    items: itemsPropType,
    selectedItems: selectedItemsPropType,
  };

  onItemClick = item => {
    const {selectedItems, refine} = this.props;
    const selected = selectedItems.indexOf(item.value) !== -1;
    refine(selected ? [] : [item.value]);
  };

  render() {
    const {items, selectedItems} = this.props;
    if (!items) {
      return null;
    }

    return (
      <ul>
        {items.map(item =>
          <li key={item.value}>
            <MenuLink
              onClick={this.onItemClick}
              item={item}
              selected={selectedItems.indexOf(item.value) !== -1}
            />
          </li>
        )}
      </ul>
    );
  }
}

export default createFacetRefiner(Menu);
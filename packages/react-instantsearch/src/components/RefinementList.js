import React, {PropTypes, Component} from 'react';
import {pick, orderBy} from 'lodash';
import translatable from '../core/translatable';
import List from './List';
import classNames from './classNames.js';
import Highlight from '../widgets/Highlight';
import SearchBox from '../components/SearchBox';
const cx = classNames('RefinementList');

class RefinementList extends Component {
  constructor(props) {
    super(props);
    this.state = {query: ''};
  }

  static propTypes = {
    translate: PropTypes.func.isRequired,
    refine: PropTypes.func.isRequired,
    searchForFacetValues: PropTypes.func.isRequired,
    createURL: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(PropTypes.string).isRequired,
      count: PropTypes.number.isRequired,
      isRefined: PropTypes.bool.isRequired,
    })),
    facetValues: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.arrayOf(PropTypes.string).isRequired,
      count: PropTypes.number.isRequired,
      isRefined: PropTypes.bool.isRequired,
    })),
    showMore: PropTypes.bool,
    isSearchable: PropTypes.bool,
    limitMin: PropTypes.number,
    limitMax: PropTypes.number,
  };

  selectItem = item => {
    this.props.refine(item.value);
    if (this.state.query !== '') {
      this.setState({query: ''});
    }
  };

  renderItem = item => {
    const label = this.state.query
      ? <Highlight attributeName="label" hit={item}/>
      : item.label;

    return (
      <label>
        <input
          {...cx('itemCheckbox', item.isRefined && 'itemCheckboxSelected')}
          type="checkbox"
          checked={item.isRefined}
          onChange={() => this.selectItem(item)}
        />
        <span {...cx('itemBox', 'itemBox', item.isRefined && 'itemBoxSelected')}></span>
        <span {...cx('itemLabel', 'itemLabel', item.isRefined && 'itemLabelSelected')}>
          {label}
        </span>
        {' '}
        <span {...cx('itemCount', item.isRefined && 'itemCountSelected')}>
          {item.count}
        </span>
      </label>);
  };

  render() {
    let facets;
    const sortedFacets = orderBy(this.props.facetValues, ['isRefined', 'count', 'name'], ['desc', 'desc', 'asc']);
    if (this.state.query !== '') {
      if (!this.props.facetValues) {
        facets = null;
      } else {
        facets = sortedFacets.length > 0
          ? <List
            renderItem={this.renderItem}
            items={sortedFacets}
            cx={cx}
            {...pick(this.props, [
              'translate',
              'limitMin',
              'limitMax',
            ])}
          />
          : <div>{this.props.translate('noResults')}</div>;
      }
    } else {
      facets = <List
        renderItem={this.renderItem}
        cx={cx}
        {...pick(this.props, [
          'translate',
          'items',
          'showMore',
          'limitMin',
          'limitMax',
        ])}
      />;
    }

    const searchBox = this.props.isSearchable ?
      <div {...cx('SearchBox')}>
        <SearchBox
          currentRefinement={this.state.query}
          refine={value => {
            this.setState({query: value});
            this.props.searchForFacetValues(value);
          }}
          translate={this.props.translate}
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            if (this.state.query !== '') {
              this.selectItem(sortedFacets[0]);
            }
          }}
        />
      </div> : null;

    return (
      <div>
        {searchBox}
        {facets}
      </div>
    );
  }
}

export default translatable({
  showMore: extended => extended ? 'Show less' : 'Show more',
  noResults: 'No Results',
})(RefinementList);



import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { connectHits } from 'instantsearch.js/es/connectors';

// Instant Search Widgets
import { hits, searchBox, configure, index } from 'instantsearch.js/es/widgets';

// Autocomplete Template
import autocompleteProductTemplate from '../templates/autocomplete-product';

const renderQSHits = ({ widgetParams, hits }, isFirstRender) => {
  console.log(hits);
  const container = document.querySelector(widgetParams.container);
  container.innerHTML = `<ul>
   ${hits
     .map(
       item => `
        
       <li>${instantsearch.highlight({
         hit: item,
         attribute: 'query',
       })}</li>
     `
     )
     .join('')}
 </ul>`;
};

const QSHits = connectHits(renderQSHits);

/**
 * @class Autocomplete
 * @description Instant Search class to display content in the page's autocomplete
 *
 *
 */
class Autocomplete {
  /**
   * @constructor
   */
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(
      '7J2ITFTP1T',
      'c65064ea779bda0cdbbaa63bd9659cfe'
    );

    this._searchInstance = instantsearch({
      indexName: 'products',
      searchClient: this._searchClient,
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
  _registerWidgets() {
    // Customize UI of the facet column
    this._searchInstance.addWidgets([
      configure({
        hitsPerPage: 5,
      }),
      searchBox({
        container: '#searchbox',
        placeholder: 'Search for products',
        showReset: true,
        showSubmit: true,
        showLoadingIndicator: true,
      }),
      hits({
        container: '#autocomplete-hits',
        placeholder: 'Search for products',
        templates: { item: autocompleteProductTemplate },
      }),

      index({
        indexName: 'products',
      }),

      index({
        indexName: 'williams_query_suggestions',
      }).addWidgets([
        configure({
          hitsPerPage: 10,
        }),
        QSHits({
          container: '#suggestions',
        }),
      ]),
    ]);
  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @return {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default Autocomplete;

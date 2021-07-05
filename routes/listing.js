const crypto = require('crypto');
const getWithRetry = require('../src/axios-retry-wrapper');

const listingProcesses = {};

module.exports = {
  invoke(url, userAgent, token, postProcessHandler = x => x) {
    let listingId;
    do {
      listingId = crypto.randomBytes(20).toString('hex');
    } while (typeof listingProcesses[listingId] !== typeof undefined);

    listingProcesses[listingId] = {
      state: {
        page: 0,
        attempt: 1,
      },
      error: null,
      result: null,
    };

    (async function() {
      try {
        let listing = [];
        let after = null;

        do {
          listingProcesses[listingId].state.page++;
          listingProcesses[listingId].state.attempt = 1;

          let actualUrl = url;
          if (after) {
            actualUrl += `?after=${after}`;
          }

          let response = await getWithRetry(actualUrl, {
            headers: {
              'User-Agent': userAgent,
              'Authorization': `Bearer ${token}`,
            },
          }, () => {
            listingProcesses[listingId].state.attempt++;
          });

          if (response.data.kind.toLowerCase() !== 'listing') {
            console.error('Returned page is not of kind Listing: ', response.data);
            listingProcesses[listingId].error = 'Invalid page';
            listingProcesses[listingId].state = null;
            return;
          }
          listing = listing.concat(response.data.data.children);
          after = response.data.data.after;
        } while (after);

        return listing;
      } catch (e) {
        console.error('Exception on Reddit:');
        console.log(e);
        listingProcesses[listingId].error = 'Exception on Reddit';
        listingProcesses[listingId].state = null;
      }
    })()
      .then(postProcessHandler)
      .then(listing => {
        listingProcesses[listingId].result = listing;
        listingProcesses[listingId].state = null;
      });

    return listingId;
  },

  pull(listingId) {
    if (typeof listingProcesses[listingId] === typeof undefined) {
      return undefined;
    }

    // Copy, not simply return, to protect from modifying.
    let state = null;
    if (listingProcesses[listingId].state !== null) {
      state = {
        page: listingProcesses[listingId].state.page,
        attempt: listingProcesses[listingId].state.attempt
      };
    }

    return {
      state,
      error: listingProcesses[listingId].error,
      result: listingProcesses[listingId].result
    };
  },
};

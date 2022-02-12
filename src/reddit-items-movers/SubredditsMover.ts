import RedditItemsMoverInterface from '../reddit-items-mover-interface';
import RedditService from '../reddit-service.js';

const impl: RedditItemsMoverInterface = {
    maxBulkSize() { return 20; },

    async put(targetToken, ids) {
        const result: { [id: string] : boolean } = {};

        try {
            await RedditService.subreddits.subscribe(targetToken, ids);
            // HTTP OK means OK for every subreddit.
            for (let idx = 0; idx < ids.length; ++idx) {
                const id = ids[idx];
                result[id] = true;
            }
        } catch (e) {
            console.error('Reddit exception: ', e);
            for (let idx = 0; idx < ids.length; ++idx) {
                const id = ids[idx];
                result[id] = false;
            }
        }

        return result;
    },

    async delete(originToken, ids) {
        const result: { [id: string] : boolean } = {};

        try {
            await RedditService.subreddits.unsubscribe(originToken, ids);
            // HTTP OK means OK for every subreddit.
            for (let idx = 0; idx < ids.length; ++idx) {
                const id = ids[idx];
                result[id] = true;
            }
        } catch (e) {
            console.error('Reddit exception: ', e);
            for (let idx = 0; idx < ids.length; ++idx) {
                const id = ids[idx];
                result[id] = false;
            }
        }

        return result;
    },
};

export default impl;

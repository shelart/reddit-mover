import RedditItemsMoverInterface from '../reddit-items-mover-interface';
import RedditService from '../reddit-service.js';

const impl: RedditItemsMoverInterface = {
    maxBulkSize() { return 1; },

    async put(targetToken, ids) {
        const result: { [id: string] : boolean } = {};

        try {
            await RedditService.savedPosts.save(targetToken, ids[0]);
            // HTTP OK means OK.
            result[ids[0]] = true;
        } catch (e) {
            console.error('Reddit exception: ', e);
            result[ids[0]] = false;
        }

        return result;
    },

    async delete(originToken, ids) {
        const result: { [id: string] : boolean } = {};

        try {
            await RedditService.savedPosts.unSave(originToken, ids[0]);
            // HTTP OK means OK.
            result[ids[0]] = true;
        } catch (e) {
            console.error('Reddit exception: ', e);
            result[ids[0]] = false;
        }

        return result;
    },
};

export default impl;

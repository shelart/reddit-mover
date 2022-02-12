import RedditItemsMoverInterface from '../reddit-items-mover-interface';

const impl: RedditItemsMoverInterface = {
    maxBulkSize() { return 5 },

    async put(targetToken, ids) {
        const result: { [id: string] : boolean } = {};

        for (let idx = 0; idx < ids.length; ++idx) {
            const id = ids[idx];
            result[id] = (idx < 4);
            console.log(`Copying ${id} into target ${targetToken} with result ${result[id]}...`);
            await new Promise<void>((resolve, _) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        }

        return result;
    },

    async delete(originToken, ids) {
        const result: { [id: string] : boolean } = {};

        for (let idx = 0; idx < ids.length; ++idx) {
            const id = ids[idx];
            result[id] = (idx < 2);
            console.log(`Deleting ${id} from origin ${originToken} with result ${result[id]}...`);
            await new Promise<void>((resolve, _) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        }

        return result;
    },
};

export default impl;

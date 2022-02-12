import RedditItemsMoverInterface from './reddit-items-mover-interface';

export default {
    async move(originToken: string,
               targetToken: string,
               mover: RedditItemsMoverInterface,
               ids: string[],
               onSubBulkFinish: (subResult: { [id: string] : boolean }) => void)
        : Promise<{ [id: string]: boolean }>
    {
        // Split the input bulk into smaller bulks up to a mover's supported size.
        const bulkSize = mover.maxBulkSize();
        const bulks = Array(Math.ceil(ids.length / bulkSize))
            .fill(null)
            .map((_, idx) => idx * bulkSize)
            .map(begin => ids.slice(begin, begin + bulkSize));

        // Move bulk by bulk.
        const result: { [id: string] : boolean } = {};
        for (const bulk of bulks) {
            console.log('Moving sub-bulk: ', bulk);

            const copiedToTarget = await mover.put(targetToken, bulk);
            console.log('copiedToTarget = ', copiedToTarget);

            const toDeleteFromOrigin = Object.entries(copiedToTarget)
                .filter(([id, result], _, _2) => result)
                .map(([id, _], _2, _3) => id);
            console.log('toDeleteFromOrigin = ', toDeleteFromOrigin);
            let deletedFromOrigin;
            if (toDeleteFromOrigin.length) {
                deletedFromOrigin = await mover.delete(originToken, toDeleteFromOrigin);
            } else {
                deletedFromOrigin = {};
            }
            console.log('deletedFromOrigin = ', deletedFromOrigin);

            const subResult: { [id: string] : boolean } = {};
            for (const id of bulk) {
                subResult[id] = copiedToTarget[id] && deletedFromOrigin[id];
                result[id] = copiedToTarget[id] && deletedFromOrigin[id];
            }
            onSubBulkFinish(subResult);
        }

        return result;
    }
};

export default interface RedditItemsMoverInterface {
    maxBulkSize(): number;
    put(targetToken: string, ids: string[]): Promise<{ [id: string]: boolean }>;
    delete(originToken: string, ids: string[]): Promise<{ [id: string]: boolean }>;
}

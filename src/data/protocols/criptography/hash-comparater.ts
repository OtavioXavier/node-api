export interface HashComparater {
    compare (value: string, hash: string): Promise<boolean>;
}
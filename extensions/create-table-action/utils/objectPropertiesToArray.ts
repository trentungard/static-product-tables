import type { TableType } from '../hooks/useProductData';

/** TODO: Refactor this to have no concept of tableData. It takes an array and either returns the keys or values in an array */
export const objectPropertiesToArray = (tableData: TableType, keys: boolean = true) => {
    const array = [];
    for (const property in tableData) {
        keys ? array.push(property) : array.push(tableData[property]);
    };
    return array;
};
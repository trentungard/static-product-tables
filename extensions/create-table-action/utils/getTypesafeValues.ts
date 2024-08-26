/**
 * Takes an arbitrary number of arguments and returns an object containing only non-undefined values
 * 
 * @throws {Error} if any argument is undefined
 * @example
 * 
 * ```typescript
 * 
 * const {firstValue, secpmdValue} = getTypesafeValues(1, 2, 3); // [1, 2, 3]
 * const unsafeValues = getTypesafeValues('hello', undefined, 3) // Throws error
 * ```
 * @param {...T[]} args - An arbitrary number of arguments. Can be of any type
 * @returns {T[]} An array containing only non-undefined values
 */
export const getTypesafeValues = <T>(...args: (T | undefined)[]): { [key: string]: T } => {
    const safeValues: { [key: string]: T } = {};
    let index = 0;

    for (const arg of args) {
        if (arg === undefined){
            throw new Error("Argument cannot be undefined");
        }
        safeValues[`args${index}`] = arg;
        index++
    }

    return safeValues;
}
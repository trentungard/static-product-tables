import type { ProductDataType } from "../hooks/useProductData";

export const parseProductData = (productData: ProductDataType, stringify = false) => {
    let localCopy = productData;
    const metafieldsLength = productData.metafields.edges.length;
    for(let x = 0; x < metafieldsLength; x++ ){
        if(localCopy.metafields.edges[x].node.namespace === 'custom_table_relationship') {
            if(stringify) {
                localCopy.metafields.edges[x].node.value = JSON.stringify(localCopy.metafields.edges[x].node.value);
            } else {
                while (typeof localCopy.metafields.edges[x].node.value === 'string'){
                    localCopy.metafields.edges[x].node.value = JSON.parse(localCopy.metafields.edges[x].node.value as string)
                }
            }
            
        }
    }
    return localCopy;
}
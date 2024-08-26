import { makeGraphQLQuery } from ".";

export interface ProductMetafields {
    namespace: string;
    key: string;
    value: string;
    type: any;
}

export async function updateCustomTableMetafields(id: number, metafields: ProductMetafields[]) {
    return await makeGraphQLQuery(`mutation UpdateProduct($productId: ID!, $metafields: [MetafieldInput!]) {
        productUpdate(input: { id: $productId, metafields: $metafields }) {
            product {
                id
            }
            userErrors {
                field
                message
            }
        }
    }`,
    {
        productId: id,
        metafields: metafields,
    }
);}

export async function initializeCustomTableMetafields(id: number) {
    return await makeGraphQLQuery(`mutation UpdateProduct($productId: ID!, $metafields: [MetafieldInput!] ) {
        productUpdate(input: { id: $productId, metafields: $metafields  }) {
          product {
            id
          }
          userErrors {
            field
            message
          }
        }
    }`,
    {
        productId: id,
        metafields: [
            {        
                type: "string",
                namespace: "custom_table_relationship",
                key: "data",
                value: "{\"columns\":[\"Edit Column 1\"],\"data\":[{\"Edit Column 1\":\"edit\"}]}"
            },
            {
                namespace: "show_static_table",
                key: "show",
                value: "false",
                type: "boolean"
            }
        ],      
    }
);}

// mutation UpdateProduct($productId: ID!, $metafields: [MetafieldInput!] ) {
//     productUpdate(input: { id: $productId, metafields: $metafields  }) {
//       product {
//         id
//       }
//       userErrors {
//         field
//         message
//       }
//     }
// }
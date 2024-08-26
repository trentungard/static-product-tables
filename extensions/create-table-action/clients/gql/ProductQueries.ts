import { makeGraphQLQuery } from ".";

export async function getProductMetafieldData(id: number) {
    return await makeGraphQLQuery(`query Product($id: ID!) {
        product(id: $id) {
          title
          metafields (first: 2) {
            edges {
              node {
                namespace
                key
                value
                id
                type
              }
            }
          }
        }
      }`,
    {
        id: id,
    }
);}
/** TODO: Fix these types */
export async function makeGraphQLQuery(query: any, variables: any) {
    const graphQLQuery = {
      query,
      variables,
    };
  
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(graphQLQuery),
    });
  
    if (!res.ok) {
      console.error("Network error during GraphQL query");
    }
  
    return await res.json();
}
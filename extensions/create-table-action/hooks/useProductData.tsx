import { PropsWithChildren, createContext, useContext, useReducer } from "react"

export type CustomTableRow = { [key: string]: unknown }

export type CustomTableRows = CustomTableRows[];

export interface CustomTableMetafield {
    columns: string[];
    data: CustomTableRows;
}

export interface MetafieldType {
    node: {
        id?: string;
        key: string;
        namespace: string;
        type: string;
        value: {}
    }
}

export type ProductDataType = { 
    title: string;
    metafields: {
        edges: MetafieldType[];
    }
};

type ReducerActionTypes = 
    'update_column_data'
    | 'update_column_header'
    | 'update_product_data'
    | 'add_row'
    | 'remove_row'
    | 'remove_column'
    | 'add_column'

type ReducerAction = { type: ReducerActionTypes, index?: number, value?: string | object, key?: string, indexOfData?: number }

const initialProductData = {
    title: '',
    metafields: {
      edges: [
        {
          node : {
            value: {
                columns: [],
                rows: []
            }
          }
        }
      ]
    }
}

const ProductDataContext = createContext(initialProductData);

const productDataReducer = (state: ProductDataType, action: ReducerAction) => {
    const { indexOfData, index, type, value, key } = action;
    switch (type) {
        case 'update_column_data': {
            if ( !indexOfData || !index || !key ) throw Error('Must pass an indexOfData, index and key to Update Column Data');
            const localCopy = { ...state };
            const custom_table_metafield = localCopy.metafields.edges[indexOfData].node.value as CustomTableMetafield;
            custom_table_metafield.data[index][key] = value;
            localCopy.metafields.edges[index].node.value = custom_table_metafield;
            return localCopy;
        }

        case 'update_column_header': {
            if ( !indexOfData || !key || !value ) throw Error('Must pass an indexOfData, value and key to Update Column Header');
            const localCopy = { ...state };
            const custom_table_metafield = state.metafields.edges[indexOfData].node.value as CustomTableMetafield;
            let oldHeader: string;
            const newColumns = custom_table_metafield.columns.map((header: string, i: number) => { 
                if(i == key){
                    oldHeader = header;
                }
                return i == key ? value : header
            });

            const newRows = custom_table_metafield.data.map((row) => {
                const lc = row;
                row[value] = lc[oldHeader];
                delete lc[oldHeader];
                return lc
            })

            localCopy.metafields.edges[indexOfData].node.value = {
                columns: newColumns,
                data: newRows
            }

            return localCopy

        }

        case 'add_column': {
            const localCopy = { ...state };
            const custom_table_metafield = localCopy.metafields.edges[indexOfData].node.value as CustomTableMetafield;
            const propertyCount = Object.keys(custom_table_metafield.columns).length;
            const newColumnName = custom_table_metafield.columns.includes(`column_${propertyCount + 1})`) ? `column_${[propertyCount + 2]}` : `column_${propertyCount + 1}`;
            
            custom_table_metafield.columns.push(newColumnName);
            custom_table_metafield.data.map(row => row[newColumnName] = '');

            localCopy.metafields.edges[index].node.value = {
                ...custom_table_metafield
            }

            return localCopy;
        }

        case 'add_row': {
            const localCopy = { ...state };
            console.log('locao', localCopy, indexOfData);
            const custom_table_metafield = localCopy.metafields.edges[indexOfData].node.value as CustomTableMetafield;
            const newRow = {};
            console.log('add row', custom_table_metafield);
            custom_table_metafield.columns.map((header) => newRow[header] = '');
            custom_table_metafield.data.push(newRow);
            localCopy.metafields.edges[indexOfData].node.value = custom_table_metafield;
            return localCopy;
        }

        case 'remove_row': {
            console.log('remove row');
            const localCopy = { ...state };
            console.log('local copy', localCopy);
            console.log('iod', indexOfData);
            console.log('index of row to remove', value);
            const custom_table_metafield = localCopy.metafields.edges[indexOfData].node.value as CustomTableMetafield;


            console.log('local copy 2', custom_table_metafield);
            // if (custom_table_metafield.data,length)
            const new_rows = localCopy.metafields.edges[indexOfData].node.value.data.filter((row, index) => index !== value);
            console.log('new rows', new_rows);
            // custom_table_metafield.data.filter((row, index) => index !== value);
            // localCopy.metafields.edges[indexOfData].node.value.data = new_rows;
            return localCopy;
        }

        case 'remove_column': {
            const localCopy = { ...state };
            const custom_table_metafield = localCopy.metafields.edges[indexOfData].node.value as CustomTableMetafield;

            const newHeaders = custom_table_metafield.columns.filter((header) => header !== key);
            const newRows = custom_table_metafield.data.map(row => { 
                const lc = row;
                delete lc[key];
                return lc
            });

            custom_table_metafield.columns = newHeaders;
            custom_table_metafield.data = newRows;

            localCopy.metafields.edges[indexOfData].node.value = custom_table_metafield;

            return localCopy;
        }
        
        case 'update_product_data': {
            return {
                ...state,
                ...value
            }
        }
    }
};

export const useProductData = () => useContext(ProductDataContext);

export const ProductDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [productData, dispatch] = useReducer(productDataReducer, initialProductData);
    return (
      <ProductDataContext.Provider value={{ productData, dispatch }}>
        {children}
      </ProductDataContext.Provider>
    );
  };
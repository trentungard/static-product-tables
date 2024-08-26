import { useEffect, useState} from 'react';
import {
  useApi,
  AdminAction,
  Button,
  Text,
  Checkbox,
  InlineStack,
} from '@shopify/ui-extensions-react/admin'
import { CustomTable } from './CustomTable';
import { useProductData } from '../hooks/useProductData';
import { initializeCustomTableMetafields, updateCustomTableMetafields } from '../clients/gql/ProductMutations';
import { parseProductData } from '../utils/parseProductData'; 
import { getProductMetafieldData } from '../clients/gql/ProductQueries';
import { config } from '../config';
import { useAppData } from '../hooks/useAppData';

const dummyMetafieldData = [
    {
      "namespace": "custom_table_relationship",
      "key": "data",
      "value": "{\"model_number\": \"xxx-xxx-xxxx\"}",
      "type": "json"
    },
    {
      "namespace": "show_static_table",
      "key": "show",
      "value": "false",
      "type": "boolean"
    }
  ];

export const BaseInterface = () => {
    // The useApi hook provides access to several useful APIs like i18n, close, and data.
    const {close, data} = useApi(config.target);

    // const [productTitle, setProductTitle] = useState('');
    const [productQueryComplete, setProductQueryComplete] = useState(false);
    const { productData, dispatch } = useProductData();
    const { state: appData } = useAppData();
    const [customTableExists, setCustomTableExists] = useState(false);
    // const [editingColumn, setEditingColumn] = useState({ name: undefined, newName: undefined })
    const productId = data.selected[0].id;
    const { indexOfData, showStaticTable } = appData;

    useEffect(() => {
        console.log('app data changed', appData);
    }, [appData]);

    useEffect(() => {
        console.log('orid data changed', productData);
    }, [productData]);

    // let showStaticTable; 

    // if(productData && productData.metafields && productData.metafields.edges[0] && productData.metafields.edges[1])
    //   showStaticTable = productData?.metafields.edges[1].node.value;

    useEffect(() => {
        (async function getProductInfo() {
            console.log('get product query')
            const { data } = await getProductMetafieldData(productId);
            const parsedProductData = parseProductData(data.product);
            // setProductTitle(productData.title);
            setProductQueryComplete(true);
            dispatch({ type: 'update_product_data', value: parsedProductData });
        })();
    }, []);

    useEffect(() => {
        if(productData && productData.metafields && productData.metafields.edges && productData.metafields.edges.some(metafield => metafield.node.namespace === 'custom_table_relationship')) {
            setCustomTableExists(true);
        }
    }, [productData])

    // let indexOfData = 0;
    // if (productData) indexOfData = productData.metafields.edges.findIndex(value => value.node.namespace == "custom_table_relationship");

    // eslint-disable-next-line no-undef
    const onSave = async () => {
        const data = indexOfData !== -1 ? parseProductData(productData, true).metafields.edges.map(row => row.node) : dummyMetafieldData;
        const filteredData = indexOfData !== -1 ? data.map(row => ({ 
        id: row.id, 
        value: row.value
        })) : data;

        await updateCustomTableMetafields(productId, filteredData);
    }

    const createEmptyTable = async () => {
        try {
            const data = await initializeCustomTableMetafields(productId);
        } catch (e) {
            console.log('error', e)
        }
    }

    return (
        <AdminAction
            primaryAction={
                <Button
                    onPress={() => {
                        close();
                    }}
                >
                    Done
                </Button>
            }
            secondaryAction={
            <Button
                onPress={() => {
                    close();
                }}
            >
                Close
            </Button>
            }
        >
            <Text fontWeight="bold">If you'd like to render a table for this product, please enter it here</Text>
            { customTableExists ? (
                <CustomTable />
                ) : (
                    <>
                        <Text>To create a Static Table for this product, </Text>
                        <Button onPress={createEmptyTable}>click here!</Button>
                    </>
            )}
            <InlineStack gap='400' columns={3}>
                <Button onClick={() => { 
                    console.log('hhsdhfs', indexOfData, appData)
                    dispatch({ type: 'add_row', indexOfData, value: ''})
                }}>New Row</Button>
                <Button onClick={() => dispatch({ type: 'add_column', indexOfData, value: ''})}>New Column</Button>
                {/* { productData && productData.metafields.edges.length > 1 && productData.metafields.edges[indexOfData].node.value.length > 1 ? <Button onClick={() => dispatch({ type: 'remove_row', indexOfData: 0, value: ''})}>Remove Row</Button> : null } */}
                <Button onClick={onSave}>Save Table</Button>
                <Checkbox checked={showStaticTable || false}>
                    Show Table?
                </Checkbox>
            </InlineStack>
            {/* <Text>Current product: {productTitle}</Text> */}
      </AdminAction>
    )
}
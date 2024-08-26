import {
    Box,
    Heading,
    Icon,
    InlineStack,
  Pressable,
  Text,
  TextField
} from '@shopify/ui-extensions-react/admin'
import { useProductData } from '../hooks/useProductData';
import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../hooks/useAppData';

export const CustomTable: React.FC = () => {
    const { productData, dispatch: productDataDispatch } = useProductData();
    const { state: appData, dispatch: appDataDispatch } = useAppData();
    const [editingColumn, setEditingColumn] = useState({ name: undefined, newName: undefined });
    const { indexOfData } = appData;
    
    const tableData = useMemo(() => productData.metafields.edges.find((metafield) => metafield.node.namespace === 'custom_table_relationship'), [productData]);

    useEffect(() => { 
        if(!tableData || !tableData.node) return undefined;
        const indexOfData = productData.metafields.edges.findIndex(value => value.node.namespace == "custom_table_relationship");
        appDataDispatch({ type: 'set_index_of_data', value: indexOfData});
    }, [productData]);

    console.log('in custom table', appData.indexOfData, rows, tableData);

    return (
        <>
            <InlineStack gap='400' columns={5}>
                {columns.map((header, i) => (
                    <InlineStack key={i} blockAlignment='center'>
                        { 
                        editingColumn.name == header ? (
                            <TextField value={editingColumn.newName} onChange={(value) => setEditingColumn(state => ({...state, newName: value}))} />              
                            ) : (
                            <Heading>
                            { header.charAt(0).toUpperCase() + header.slice(1) }
                            </Heading>
                            )
                        }
                        {
                            editingColumn.name == header ? (
                            <Pressable onClick={() => setEditingColumn({name: undefined, newName: undefined })}>
                                <Icon name='CircleCancelMajor' />
                            </Pressable>
                            ) : (
                            <Pressable onClick={() => productDataDispatch({
                                type: 'remove_column',
                                key: header,
                                indexOfData: indexOfData
                            })}>
                                <Icon name='CircleMinusMajor' />
                            </Pressable>
                            )
                        }
                        { editingColumn.name == header ? (
                            <Pressable onClick={() => { 
                                    productDataDispatch({
                                        type: 'update_column_header',
                                        value: editingColumn.newName,
                                        indexOfData: indexOfData,
                                        key: i
                                    });
                                    setEditingColumn({ name: undefined, newName: undefined});
                                }}
                            >
                                <Icon name='CircleTickMajor' />
                            </Pressable>
                        ) : (
                            <Pressable onClick={() => setEditingColumn({ name: header, newName: undefined })}>
                                <Icon name='EditMajor' />
                            </Pressable>
                        )}
                    </InlineStack>
                    ))
                }
            </InlineStack>
            <Box>
                {
                columns && rows && rows.map((row, rowIndex) => {
                    return (
                    <InlineStack key={rowIndex} gap='400' columns={columns ? columns.length : 0}>
                        { columns.map((header, columnIndex) => (
                        <TextField
                            value={row[header]}
                            key={columnIndex}
                            onChange={(value) => productDataDispatch({
                            type: 'update_column_data',
                            key: header,
                            value: value,
                            indexOfData: indexOfData,
                            index: rowIndex
                            })}
                        />
                        ))}
                        <Pressable onClick={() => { 
                            console.log('remove fired')
                            productDataDispatch({
                                type: 'remove_row',
                                indexOfData: indexOfData,
                                value: rowIndex
                            })}}>
                        <Icon name='CircleCancelMajor' />
                        </Pressable>
                    </InlineStack>
                    )
                }
                )}
            </Box>
        </>
    )
}
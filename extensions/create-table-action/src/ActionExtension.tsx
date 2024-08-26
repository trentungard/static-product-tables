
import {
  reactExtension,
} from '@shopify/ui-extensions-react/admin'
import './styles.css';
import { ProductDataProvider } from '../hooks/useProductData';
import { BaseInterface } from './BaseInterface';
import { config } from '../config';
import { AppDataProvider } from '../hooks/useAppData';


/** 
 * The general philosophy here is to treat the remote data as the source of truth. Make a local copy (in state) and only manipulate that. Then,
 * once a save is done, sync with the remote data and start again.
 */

export default reactExtension(config.target, () => <App />);

function App() {
  return (
    <ProductDataProvider>
      <AppDataProvider>
        <BaseInterface />
      </AppDataProvider>
    </ProductDataProvider>
  );
}
import type { PropsWithChildren} from 'react';
import React, { createContext, useContext, useReducer } from 'react';

// Define the shape of the state
interface AppState {
  showStaticTable: boolean;
  indexOfData: number;
}

// Initial state
const initialAppState: AppState = {
  showStaticTable: false,
  indexOfData: 0,
};

// Define action types
type Action =
  | { type: 'toggle_show_static_table' }
  | { type: 'set_index_of_data'; value: number };

// Reducer function to handle state changes
function appDataReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'toggle_show_static_table':
      return {
        ...state,
        showStaticTable: !state.showStaticTable,
      };
    case 'set_index_of_data':
      return {
        ...state,
        indexOfData: action.value,
      };
    default:
      return state;
  }
}

// Create the context
const AppDataContext = createContext(initialAppState);

// Provider component
export const AppDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(appDataReducer, initialAppState);
  return (
    <AppDataContext.Provider value={{ state, dispatch }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook to use the app data context
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
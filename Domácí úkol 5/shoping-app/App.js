import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShoppingListsPage from './components/ShoppingListsPage';
import ShoppingListDetail from './components/ShoppingListDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/shopping-lists" element={<ShoppingListsPage />} />
        <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

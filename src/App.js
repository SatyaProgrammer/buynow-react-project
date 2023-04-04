import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/products/:id' element={<ProductDetail />}/>
        <Route path='/categories' element={<Categories />}/>
        <Route path='/categories/:id' element={<Categories />}/>
      </Routes>
    </div>
  );
}

export default App;

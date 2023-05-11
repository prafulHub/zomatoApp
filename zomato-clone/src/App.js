import { Route, Routes } from "react-router-dom";
import './App.css';
import FilterPage from './Components/FilterPage';
import Home from './Components/Home';
import Restaurant from './Components/Restaurant';



function App() {
  return (
    <>   
      <Routes>
        <Route path ="/"element ={<Home/>} />
        <Route path="/search/:id/:type"element= {<FilterPage/>} />
        <Route path="/reastaurant/:id"element= {<Restaurant />} />      
      </Routes>
    </>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import OtherPage from './OtherPage';
import Fib from './Fib';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Fibonacci calculator v2</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>
        <div>
          <Routes>
            <Route path='/' element={<Fib />} />
            <Route path='/otherpage' element={<OtherPage />} />
          </Routes>
        </div>
      </div>
    </Router>
    
  );
}

export default App;

import { Route, Switch, Link } from 'react-router-dom';

import Routes from './utils/Routes'

function App() {

  const logout = () => {
    localStorage.removeItem('token')

    // redirect to login page
    window.location.href = '/'
  }

  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>

          <li>
            <Link to="/home">Home</Link>
          </li>

          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>

      <Routes />
    </div>
  );
}

export default App;

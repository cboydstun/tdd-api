import Routes from './utils/Routes'

import './App.css';

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
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>

      <Routes />
    </div>
  );
}

export default App;

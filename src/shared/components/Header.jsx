import { NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header>
      <nav>
        <div className="logo">
          <NavLink to="/">PianoFlux</NavLink>
        </div>

        <div className="nav-links">
          <NavLink to="/practice">Practice</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </div>
      </nav>
    </header>
  )
}

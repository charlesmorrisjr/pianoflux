import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div>
      <h1>Landing Page</h1>
      <p>Welcome to PianoFlux!</p>
      <Link to="/practice" className='cta-button'>Start Practicing</Link>
    </div>
  )
}

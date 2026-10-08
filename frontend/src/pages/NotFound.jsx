import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page section text-center">
      <div className="container">
        <h1 style={{ fontSize: '6rem', color: 'var(--primary-color)', marginBottom: '10px' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">Return to Homepage</Link>
      </div>
    </div>
  );
};

export default NotFound;

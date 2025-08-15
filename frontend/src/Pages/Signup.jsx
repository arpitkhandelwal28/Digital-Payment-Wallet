import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const user = { name, email, password };

    try {
      const response = await axios.post('http://localhost:4003/api/signup', user);
      alert('Signup successful');
      setName('');
      setEmail('');
      setPassword('');
      navigate('/login');
    } catch (err) {
      console.error("Signup error:", err.response?.data?.message || err.message);
      setErrorMessage(err.response?.data?.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row">
        <div className="">
          <div className="card p-4 shadow-sm">
            <h2 className="card-title mb-4 text-center">CREATE AN ACCOUNT</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Signing up...' : 'Submit'}
              </button>
            </form>
            <p className="mt-3 text-center">
              Have an account?{" "}
              <Link to="/login" className="link-primary">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;


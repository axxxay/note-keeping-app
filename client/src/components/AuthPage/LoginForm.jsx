import Cookies from 'js-cookie';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import {  useNavigate, Navigate } from 'react-router-dom';


function LoginForm({setToggleLogin}) {

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value
    });
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setError('Please fill all the fields');
      return;
    }

    const url = process.env.REACT_APP_BACKEND_URL + '/api/user/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    }
    setLoader(true);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        Cookies.set('jwt_token', data.jwtToken, { expires: 7 });
        setError('');
        navigate('/notes', { replace: true });
        window.location.reload();
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
      setError('Something went wrong. Please try again later.');
    }
    setLoader(false);
  }

  if(Cookies.get('jwt_token')) {
    return <Navigate to='/notes' replace />
  }

  return (
    <form className='auth-form' onSubmit={handleLogin}>
        <h1 className='auth-heading'>Login</h1>
        <label htmlFor="email" className='auth-label'>EMAIL</label>
        <input type="email" id="email" className='auth-input' placeholder='John@mail.com' value={loginData.email} onChange={handleChange} />
        <label htmlFor="password" className='auth-label'>PASSWORD</label>
        <input type="password" id="password" className='auth-input' placeholder='Password' value={loginData.password} onChange={handleChange} />
        { error && <p className='auth-error'>{error}</p> }
        <button type="submit" className='auth-btn'>
          { loader ?
            <Oval
            visible={true}
            height="19"
            width="19"
            color="#C8ACD6"
            secondaryColor='#f0f0f0'
            strokeWidth={3}
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />
            :
            "Login"
          }
        </button>
        <p className='auth-para'>Don't have an account? <span className='auth-link' onClick={() => setToggleLogin(false)}>Register</span></p>
    </form>
  )
}

export default LoginForm
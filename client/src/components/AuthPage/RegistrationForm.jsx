import React, { useState } from 'react'
import './style.css'
import { Oval } from 'react-loader-spinner';
import toast from 'react-hot-toast';

function RegistrationForm({setToggleLogin}) {

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState('');
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.id]: e.target.value
    });
  }

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!registerData.username || !registerData.email || !registerData.password) {
      setError('Please fill all the fields');
      return;
    }

    const url = process.env.REACT_APP_BACKEND_URL + '/api/user/register';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    }
    setLoader(true);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        setError('');
        setToggleLogin(true);
        toast.success('Account created successfully. Please login to continue.');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
      setError('Something went wrong. Please try again later.');
    }
    setLoader(false);
  }
  return (
    <form className='auth-form' onSubmit={handleSignUp}>
        <h1 className='auth-heading'>Sign Up</h1>
        <label htmlFor="username" className='auth-label'>USERNAME</label>
        <input type="text" id="username" className='auth-input' placeholder='John Doe' value={registerData.username} onChange={handleChange} />
        <label htmlFor="email" className='auth-label'>EMAIL</label>
        <input type="email" id="email" className='auth-input' placeholder='John@mail.com' value={registerData.email} onChange={handleChange} />
        <label htmlFor="password" className='auth-label'>PASSWORD</label>
        <input type="password" id="password" className='auth-input' placeholder='Password' value={registerData.password} onChange={handleChange} />
        {error && <p className='auth-error'>{error}</p>}
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
            "Sign Up"
          }
        </button>
        <p className='auth-para'>Already have an account? <span className='auth-link' onClick={() => setToggleLogin(true)}>Login</span></p>
    </form>
  )
}

export default RegistrationForm
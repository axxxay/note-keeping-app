import React, { useState } from 'react'
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import './style.css'

function AuthPage() {
    const [toggleLogin, setToggleLogin] = useState(true);
    return (
        <div className='authpage-container'>
            <div className='authpage-content'>
                <h1 className='authpage-heading'>Keep Notes</h1>
                {toggleLogin ?
                    <LoginForm setToggleLogin={setToggleLogin}/>
                    :
                    <RegistrationForm setToggleLogin={setToggleLogin}/>
                }
            </div>
            <div className='authpage-img-con'>
                <img src='/auth-bg.jpg' alt='keep notes' draggable={false} className='authpage-img' />
            </div>
        </div>
    )
}

export default AuthPage
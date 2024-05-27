import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

import { Oval } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showSpinner, setSpinner] = useState(false)
  const [showForgotPasswordForm, setForgotPasswordForm] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSpinner(true)
    axios.post('/api/auth/signin', {...formData})
    .then(({data}) => {
      window.location.assign("/dashboard")
      toast.info(data.message)
    })
    .catch(err => {
      toast.warn(err.response.data.message)
    })
    .finally(() => {
      setSpinner(false)
    })
  };
  function handleEmailSubmission(email) {
    axios.get(`/api/auth/password/reset?email=${email}`)
    .then(({data}) => {
      toast.info(data.message)
    })
    .catch(err => {
      toast.warn(err.response.data.message)
    })
    .finally(() => {
      setForgotPasswordForm(false)
    })
  }
  useEffect(() => {
    // Parse the query parameters if any
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error === 'oauth_provider_id_mismatch') {
      toast.error('Email is already registered with a different OAuth provider');
    }
  }, [])


  return (
    <>
    <div className="auth-wrapper animate__animated animate__fadeInDown">
      <h2 className="">Sign In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Your work email'
            required
            className=""
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder='Your password'
            onChange={handleChange}
            required
            className=""
          />
          <span 
            className="cursor-pointer text-[#666] w-full flex justify-end text-sm my-[10px]"
            onClick={() => setForgotPasswordForm(true)}
          >
            Forgot Password?
          </span>
        </div>
        <button
          type="submit"
          className=""
        >
          Sign In
          {
            showSpinner &&
            <Oval
              visible={true}
              height="25"
              width="25"
              color="#fff"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          }
        </button>
        <div className='auth_delimeter'> OR </div>
        <div className="oauth-wrapper">
          <a href="/api/auth/google">
            <FcGoogle className='text-[1.6rem]' />
            Sign in with Google
          </a>
        </div>
        <div className="mt-3">
          <p>Don&apos;t have an account? <a href="/signup">Sign up</a></p>
        </div>
      </form>
    </div>
    <ToastContainer />
    {
      showForgotPasswordForm && 
      <ForgotPasswordForm submitEmail={email => handleEmailSubmission(email)} />
    }
    </>
  );
};


const ForgotPasswordForm = ({submitEmail}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your verification logic here
    setLoading(true);
    submitEmail(email)
  };
  return (
    <div className="modal animate__animated animate__fadeIn">
      <div className="modal-content">
        <h2 className="text-[1.2rem] font-[700] text-center mb-[10px] ">Forgot Password</h2>
        <p className="">Enter Your Email Address To Receive A Password Reset Link </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <input
              id="email"
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className=""
            disabled={isLoading ? true : false}
          >
            Submit
            {
              isLoading &&
              <Oval
                visible={true}
                height="25"
                width="25"
                color="#fff"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            }
          </button>
        </form>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <SigninForm />
)
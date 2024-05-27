import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom/client"
import { FcGoogle } from "react-icons/fc";
import { Oval } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerificationForm = ({verify, email}) => {
  const [code, setCode] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your verification logic here
    setLoading(true);
    verify(code)
  };
  return (
    <div className="modal animate__animated animate__fadeIn">
      <div className="modal-content">
        <h2>Email Verification</h2>
        <p className="text-center mb-[10px]">Enter the verification code sent to {email} </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <input
              id="code"
              type="text"
              placeholder="Enter 6 digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className=""
            disabled={isLoading ? true : false}
          >
            Verify
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


const SignupForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const token = useRef(null)
  const [showSpinner, setSpinner] = useState(false)
  const [showAuthInput, setAuthInput] = useState(false)

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
    for (const field in formData) {
      if (formData[field].trim() === "") {
        toast.warn("Please complete your form to continue")
        return
      }
    }

    // Verify Email if no signup token is present
    if (!token.current) {
      requestEmailVerificationCode()
      return
    }
    sendSignupRequest(token.current)
  };
  function requestEmailVerificationCode() {
    axios.get(`/api/auth/email/code?email=${formData.email}&reason=signup`)
    .then(({data}) => {
      toast.info(data.message)

      // Display the Auth Code Verification modal
      setAuthInput(true)
    })
    .catch(err => {
      toast.warn(err.response.data.message)
    })
    .finally(() => {
      setSpinner(false)
    })
  }

  function sendSignupRequest() {
    axios.post('/api/auth/signup', {...formData}, {
      headers: {
        'Authorization': `Bearer ${token.current}`
      }
    })
    .then(({data}) => {
      toast.info(data.message)
    })
    .catch(err => {
      toast.warn(err.response.data.message)
    })
    .finally(() => {
      setSpinner(false)
    })
  }

  
  function handleEmailVerification(code) {
    axios.put('/api/auth/email/verify', {code, email: formData.email})
    .then(({data}) => {
      toast.info(data.message)
      token.current = data.data.token
      sendSignupRequest()
    })
    .catch(err => {
      toast.warn(err.response.data.message)
    })
    .finally(() => {
      setSpinner(false)
      setAuthInput(false)
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
        <h2 className="">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder='Your full name'
              required
              className=""
            />
          </div>
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
          </div>
          <button
            type="submit"
            className=""
            disabled={showSpinner ? true : false}
          >
            Sign Up
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
              Sign up with Google
            </a>
          </div>
          <div className="mt-3">
            <p>Already have an account? <a href="/signin">Sign in</a></p>
          </div>
        </form>
      </div>
      {
        showAuthInput &&
        <VerificationForm verify={handleEmailVerification} email={formData.email} />
      }
      <ToastContainer />
    </>
  )};

ReactDOM.createRoot(document.getElementById('root')).render(
  <SignupForm />
)
import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client"
import axios from 'axios';

import { Oval } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    repeat_password: '',
    new_password: ''
  });
  const [showSpinner, setSpinner] = useState(false)
  const [resetLinkSlug, setResetLinkSlug] = useState("")

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
    axios.put(`/api/auth/password/reset/${resetLinkSlug}`, {...formData})
    .then(({data}) => {
      toast.info(data.message)
      window.location.href = '/signin';
    })
    .catch(err => {
      toast.warn(err.response.data.message)
    })
    .finally(() => {
      setSpinner(false)
    })
  };
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const slug = parts[parts.length - 1];
    setResetLinkSlug(slug)
  }, [])

  return (
    <>
    <div className="auth-wrapper">
      <h2 className="">Reset Password</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder='Your New Password'
            required
            className=""
          />
        </div>
        <div>
          <input
            type="password"
            name="repeat_password"
            value={formData.repeat_password}
            placeholder='Re-enter New Password'
            onChange={handleChange}
            required
            className=""
          />
        </div>
        <button
          type="submit"
          className=""
        >
          Send
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
        <hr></hr>
        <div className="mt-3">
          <p>Or Proceed with <a href="/signin">Sign In</a></p>
        </div>
      </form>
    </div>
    <ToastContainer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ResetPasswordForm />
)
import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import EyeIcon from '../components/icons/EyeIcon';
import EyeCrossedIcon from '../components/icons/EyeCrossedIcon';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

interface ErrorData {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

const initialErrorValues = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
};

interface ResponseData {
  isError: boolean;
  message: string;
}

const initialResponse = {
  isError: false,
  message: '',
};

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [formValues, setFormValues] = useState<FormData>(initialFormValues);
  const [formError, setFormError] = useState<ErrorData>(initialErrorValues);
  const [response, setResponse] = useState<ResponseData>(initialResponse);

  const { mutate: signUpMutate, isLoading: signupIsLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/sign-up`,
        {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        }
      );
      return data;
    },
    onSuccess(data) {
      console.log(data);
      setFormValues(() => initialFormValues);
      setFormError(() => initialErrorValues);
      const message = `User with email ${data.data.user.email} created!`;
      setResponse(() => ({ isError: false, message }));
    },
    onError(error: any) {
      console.log(error.response.data);
      setResponse(() => ({
        isError: true,
        message: error.response.data.message,
      }));
    },
  });

  const { mutate: loginMutate, isLoading: loginIsLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        {
          email: formValues.email,
          password: formValues.password,
        }
      );
      return data;
    },
    onSuccess(data) {
      console.log(data);
      setFormValues(() => initialFormValues);
      setFormError(() => initialErrorValues);
    },
    onError(error: any) {
      console.log(error.response.data);
      setFormValues(() => initialFormValues);
      setResponse(() => ({
        isError: true,
        message: error.response.data.message,
      }));
    },
  });

  const { mutate: forgotPasswordMutate, isLoading: forgotPasswordIsLoading } =
    useMutation({
      mutationKey: ['forgot-password'],
      mutationFn: async () => {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/users/forgot-password`,
          { email: formValues.email }
        );
        return data;
      },
      onSuccess(data) {
        console.log(data);
        setFormValues(() => initialFormValues);
        setFormError(() => initialErrorValues);
        setResponse(() => ({ isError: false, message: data.message }));
      },
      onError(error: any) {
        console.log(error);
        setResponse(() => ({
          isError: true,
          message: error.response.data.message,
        }));
      },
    });

  const loginErrorHandler = () => {
    if (!formValues.email) setFormError((prev) => ({ ...prev, email: true }));
    if (!formValues.password)
      setFormError((prev) => ({ ...prev, password: true }));
  };

  const forgotPasswordErrorHandler = () => {
    if (!formValues.email) setFormError((prev) => ({ ...prev, email: true }));
  };

  const signupErrorHandler = () => {
    if (!formValues.name) setFormError((prev) => ({ ...prev, name: true }));
    if (!formValues.email) setFormError((prev) => ({ ...prev, email: true }));
    if (!formValues.password)
      setFormError((prev) => ({ ...prev, password: true }));
    if (!formValues.confirmPassword)
      setFormError((prev) => ({ ...prev, confirmPassword: true }));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin && !isForgotPassword) {
      if (!formValues.email || !formValues.password) {
        loginErrorHandler();
        return;
      }
      loginMutate();
    } else if (!isLogin && !isForgotPassword) {
      if (
        !formValues.name ||
        !formValues.email ||
        !formValues.password ||
        !formValues.confirmPassword
      ) {
        signupErrorHandler();
        return;
      }
      signUpMutate();
    } else if (isForgotPassword && !isLogin) {
      if (!formValues.email) {
        forgotPasswordErrorHandler();
        return;
      }
      forgotPasswordMutate();
    }
  };

  const forgotPassword = () => {
    setIsForgotPassword(() => true);
    setIsLogin(() => false);
    setResponse(() => ({
      isError: false,
      message: 'Enter your email',
    }));
  };

  return (
    <form className='flex flex-col gap-6 w-5/12' onSubmit={submitHandler}>
      {response?.message && (
        <h2
          className='self-center font-medium text-lg text-green-600'
          style={{
            color: response?.isError ? 'red' : '',
          }}
        >
          {response?.message}
        </h2>
      )}
      {!isLogin && !isForgotPassword && (
        <input
          className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid'
          type='text'
          id='name'
          value={formValues?.name}
          placeholder='Name'
          style={{
            border: formError.name && !formValues.name ? '1px solid red' : '',
          }}
          onChange={(event) =>
            setFormValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
      )}
      <input
        className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid'
        type='text'
        id='email'
        value={formValues?.email}
        placeholder='Email'
        style={{
          border: formError.email && !formValues.email ? '1px solid red' : '',
        }}
        onChange={(event) =>
          setFormValues((prev) => ({ ...prev, email: event.target.value }))
        }
      />
      {!isForgotPassword && (
        <div className='relative'>
          <input
            className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid w-full'
            type={viewPassword ? 'text' : 'password'}
            id='password'
            value={formValues?.password}
            placeholder='Password'
            style={{
              border:
                formError.password && !formValues.password
                  ? '1px solid red'
                  : '',
            }}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
          />
          {!viewPassword && (
            <EyeIcon
              className='absolute top-[50%] translate-y-[-50%] right-4'
              onClick={() => setViewPassword((prev) => !prev)}
            />
          )}
          {viewPassword && (
            <EyeCrossedIcon
              className='absolute top-[50%] translate-y-[-50%] right-4'
              onClick={() => setViewPassword((prev) => !prev)}
            />
          )}
        </div>
      )}
      {!isLogin && !isForgotPassword && (
        <div className='relative'>
          <input
            className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid w-full'
            type={viewPassword ? 'text' : 'password'}
            id='confirmPassword'
            value={formValues?.confirmPassword}
            placeholder='Confirm Password'
            style={{
              border:
                formError.confirmPassword && !formValues.confirmPassword
                  ? '1px solid red'
                  : '',
            }}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
          />

          {!viewPassword && (
            <EyeIcon
              className='absolute top-[50%] translate-y-[-50%] right-4'
              onClick={() => setViewPassword((prev) => !prev)}
            />
          )}

          {viewPassword && (
            <EyeCrossedIcon
              className='absolute top-[50%] translate-y-[-50%] right-4'
              onClick={() => setViewPassword((prev) => !prev)}
            />
          )}
        </div>
      )}

      {!isForgotPassword && (
        <button
          className='px-6 py-3 text-white font-medium bg-green-600 hover:bg-green-600/70 transition rounded-md'
          disabled={signupIsLoading}
          style={{
            backgroundColor: signupIsLoading ? '#e0e0e0' : '',
          }}
        >
          {isLogin
            ? loginIsLoading
              ? 'Signing In...'
              : 'Sign In'
            : signupIsLoading
            ? 'Signing Up...'
            : 'Sign Up'}
        </button>
      )}

      {isForgotPassword && (
        <button
          className='px-6 py-3 text-white font-medium bg-green-600 hover:bg-green-600/70 transition rounded-md'
          disabled={signupIsLoading}
          style={{
            backgroundColor: signupIsLoading ? '#e0e0e0' : '',
          }}
        >
          {forgotPasswordIsLoading
            ? 'Sending reset token...'
            : 'Send reset token'}
        </button>
      )}

      {!isLogin && (
        <h2 className='text-slate-500'>
          Already have an account?{' '}
          <span
            className='cursor-pointer font-medium text-blue-600'
            onClick={() => {
              setIsLogin((prev) => !prev);
              setIsForgotPassword(() => false);
              setResponse(() => initialResponse);
            }}
          >
            Sign In
          </span>
        </h2>
      )}
      {isLogin && (
        <div className='flex justify-between items-center'>
          <h2 className='text-slate-500'>
            Don't have an account?{' '}
            <span
              className='cursor-pointer font-medium text-blue-600'
              onClick={() => {
                setIsLogin((prev) => !prev);
                setIsForgotPassword(() => false);
                setResponse(() => initialResponse);
              }}
            >
              Sign Up
            </span>
          </h2>
          <h3
            className='text-orange-400 cursor-pointer transition hover:text-orange-600'
            onClick={forgotPassword}
          >
            Forgot password?
          </h3>
        </div>
      )}
    </form>
  );
};

export default LoginForm;

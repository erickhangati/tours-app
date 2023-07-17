import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

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
      const message = `User with email ${data.data.email} created!`;
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
    },
  });

  const loginErrorHandler = () => {
    if (!formValues.email) setFormError((prev) => ({ ...prev, email: true }));
    if (!formValues.password)
      setFormError((prev) => ({ ...prev, password: true }));
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
    if (isLogin) {
      if (!formValues.email || !formValues.password) {
        loginErrorHandler();
        return;
      }
      loginMutate();
    } else {
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
    }
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
      {!isLogin && (
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
      <input
        className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid'
        type='text'
        id='password'
        value={formValues?.password}
        placeholder='Password'
        style={{
          border:
            formError.password && !formValues.password ? '1px solid red' : '',
        }}
        onChange={(event) =>
          setFormValues((prev) => ({ ...prev, password: event.target.value }))
        }
      />
      {!isLogin && (
        <input
          className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid'
          type='text'
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
      )}
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
      {!isLogin && (
        <h2 className='text-slate-500'>
          Already have an account?{' '}
          <span
            className='cursor-pointer font-medium text-blue-600'
            onClick={() => setIsLogin((prev) => !prev)}
          >
            Sign In
          </span>
        </h2>
      )}
      {isLogin && (
        <h2 className='text-slate-500'>
          Don't have an account?{' '}
          <span
            className='cursor-pointer font-medium text-blue-600'
            onClick={() => setIsLogin((prev) => !prev)}
          >
            Sign Up
          </span>
        </h2>
      )}
    </form>
  );
};

export default LoginForm;

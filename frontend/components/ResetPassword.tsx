import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

import EyeIcon from './icons/EyeIcon';
import EyeCrossedIcon from './icons/EyeCrossedIcon';

interface FormData {
  password: string;
  confirmPassword: string;
}

const initialFormValues = {
  password: '',
  confirmPassword: '',
};

interface ErrorData {
  password: boolean;
  confirmPassword: boolean;
}

const initialErrorValues = {
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

const ResetPassword = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [formValues, setFormValues] = useState<FormData>(initialFormValues);
  const [formError, setFormError] = useState<ErrorData>(initialErrorValues);
  const [response, setResponse] = useState<ResponseData>(initialResponse);
  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, mutate, isSuccess } = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async () => {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/reset-password/${token}`,
        {
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
      setResponse(() => ({
        isError: false,
        message: 'Password reset successful',
      }));
    },
    onError(error: any) {
      console.log(error);
      setResponse(() => ({
        isError: true,
        message: error.response.data.message,
      }));
    },
  });

  const navigateAfterDelay = useCallback(() => {
    // navigate('/');
    console.log('Navigate away');
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const delay = 3000; // Set the desired delay in milliseconds
      const timeoutId = setTimeout(navigateAfterDelay, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [isSuccess, navigateAfterDelay]);

  const resetPasswordErrorHandler = () => {
    if (!formValues.password)
      setFormError((prev) => ({ ...prev, password: true }));
    if (!formValues.confirmPassword)
      setFormError((prev) => ({ ...prev, confirmPassword: true }));
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.password || !formValues.confirmPassword) {
      resetPasswordErrorHandler();
      return;
    }
    mutate();
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

      <div className='relative'>
        <input
          className='px-6 py-3 outline-none rounded-md border border-gray-400 border-solid w-full'
          type={viewPassword ? 'text' : 'password'}
          id='password'
          value={formValues?.password}
          placeholder='Password'
          style={{
            border:
              formError.password && !formValues.password ? '1px solid red' : '',
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

      <button
        className='px-6 py-3 text-white font-medium bg-green-600 hover:bg-green-600/70 transition rounded-md'
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#e0e0e0' : '',
        }}
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPassword;

'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { fetchData } from '@/apiHandlers/fetch';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/store/store';

const SignIn = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const { mutate: authMutation, isLoading } = useMutation({
    mutationFn: async (userData: {
      email: string;
      name?: string;
      password: string;
    }) => {
      const endpoint = isLogin ? '/login' : '/register';
      const data = await fetchData(endpoint, 'POST', userData, {
        includeAuth: false,
      });
      return data;
    },
    onSuccess: (data: { user: User; token: string }) => {
      if (data?.user && data?.token) {
        login({ ...data.user, roomId: null }, data.token);
        router.push('/home');
      }
    },
    onError: (error: Error) => {
      console.error('Authentication failed:', error);
      if (error.message) {
        setError(error.message);
      } else {
        setError(
          isLogin
            ? 'Login failed. Please try again.'
            : 'Registration failed. Please try again.',
        );
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!isLogin && !name) {
      setError('Name is required for registration');
      return;
    }

    const userData = isLogin
      ? { email, password }
      : { email, password, name: name! };

    authMutation(userData);
  };

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center">
      <h1 className="my-4 -mt-20 text-3xl font-bold">
        {isLogin ? 'Welcome Back!' : 'Join QuickChat'}
      </h1>
      <div className="w-full max-w-md rounded-lg bg-slate-300 p-6">
        {/* Toggle between Login and Register */}
        <div className="mb-4 flex rounded-lg bg-gray-200 p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              !isLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            ref={emailRef}
            className="rounded-md bg-neutral-200 px-4 py-2"
            type="email"
            placeholder="Email Address"
            required
          />

          {!isLogin && (
            <input
              ref={nameRef}
              className="rounded-md bg-neutral-200 px-4 py-2"
              type="text"
              placeholder="Full Name"
              required={!isLogin}
            />
          )}

          <input
            ref={passwordRef}
            className="rounded-md bg-neutral-200 px-4 py-2"
            type="password"
            placeholder="Password"
            required
          />

          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { usePostStore, Data } from '../store/store';

const Home = () => {
  const { setPost } = usePostStore();
  const navigate = useNavigate();

  const { isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts/1'
      );
      return data as Data;
    },
    onSuccess: (data) => {
      setPost(() => data);
    },
    onError: (error: any) => {
      console.log(error.message);
      navigate('/not-found');
    },
  });

  if (isLoading) return <h1>Loading post...</h1>;

  return (
    <>
      <Helmet>
        <title>Home page</title>
      </Helmet>
      <h1>Home</h1>
    </>
  );
};

export default Home;

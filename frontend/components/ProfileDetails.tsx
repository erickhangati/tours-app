import { useState, useEffect } from 'react';
import { useUserStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

const ProfileDetails = () => {
  const { user } = useUserStore();
  const [content, setContent] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <main className='grid grid-cols-[300px,1fr] gap-x-10'>
      <ul className='p-8 bg-green-50 rounded-md flex flex-col'>
        <img
          className='w-24 rounded-full self-center mb-6'
          src={`/img/users/${user?.photo}`}
          alt=''
        />
        <li
          className='py-4 text-slate-600 border-b border-slate-200 cursor-pointer'
          onClick={() => setContent('dashboard')}
        >
          My Tours
        </li>
        <li
          className='py-4 text-slate-600 cursor-pointer'
          onClick={() => setContent('password')}
        >
          Account Settings
        </li>
      </ul>
      <div>{content[0].toUpperCase() + content.slice(1)}</div>
    </main>
  );
};

export default ProfileDetails;

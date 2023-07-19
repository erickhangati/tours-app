import { NavLink, Outlet, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useUserStore } from '../store/store';

const Nav = () => {
  const { tourId } = useParams();
  const { pathname } = useLocation();
  const { user, setUser } = useUserStore();

  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`
      );
      return data.user;
    },
    onSuccess(data) {
      console.log(data);
      if (data === null) {
        setUser(null);
        return;
      }
      setUser({ name: data.name, email: data.email, photo: data.photo });
    },
    onError(error: any) {
      console.log(error);
      setUser(null);
    },
  });

  return (
    <>
      <nav className='py-8'>
        <ul className='flex items-center'>
          <li className='pr-4'>
            <NavLink
              to='/'
              className={(navData) =>
                navData.isActive || pathname === `/${tourId}`
                  ? 'text-blue-500 font-medium text-xl'
                  : 'text-slate-500 font-medium text-xl'
              }
            >
              Tours
            </NavLink>
          </li>
          {!user && (
            <li className='pr-4 ml-auto'>
              <NavLink
                to='/login'
                className={(navData) =>
                  navData.isActive
                    ? 'text-blue-500 font-medium text-xl'
                    : 'text-slate-500 font-medium text-xl'
                }
              >
                Login / Sign Up
              </NavLink>
            </li>
          )}
          {user && (
            <li className='text-slate-500 font-medium ml-auto flex items-center gap-6'>
              <span>{`Welcome, ${user?.name.split(' ')[0]}`}</span>
              <NavLink to='/profile'>
                <img
                  className='w-12 rounded-full'
                  src={`/img/users/${user.photo}`}
                  alt=''
                />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Nav;

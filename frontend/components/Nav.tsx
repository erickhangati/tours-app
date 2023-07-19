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
      setUser({ email: data.email, name: data.name });
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
                  ? 'text-blue-500 font-medium'
                  : 'text-slate-500 font-medium'
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
                    ? 'text-blue-500 font-medium'
                    : 'text-slate-500 font-medium'
                }
              >
                Login / Sign Up
              </NavLink>
            </li>
          )}
          {user && (
            <li className='text-slate-500 font-medium ml-auto'>{`Welcome, ${
              user?.name.split(' ')[0]
            }`}</li>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Nav;

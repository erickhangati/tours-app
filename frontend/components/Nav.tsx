import { NavLink, Outlet, useParams, useLocation } from 'react-router-dom';

const Nav = () => {
  const { tourId } = useParams();
  const { pathname } = useLocation();

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
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Nav;

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Tours from '../pages/Tours';
import TourDetails from '../pages/TourDetails';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound';
import Nav from '../components/Nav';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Nav />}>
      <Route index element={<Tours />} />
      <Route path='/:tourId' element={<TourDetails />} />
      <Route path='/login' element={<Login />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/not-found' element={<NotFound />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

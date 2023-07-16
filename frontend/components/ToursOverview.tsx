import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Link, useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

import { Tours } from '../data/type';
import { useToursStore } from '../store/store';

const ToursOverview = () => {
  const { tours, setTours, setTour } = useToursStore();
  const navigate = useNavigate();

  const { isLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://tours-app-api.vercel.app/api/v1/tours'
      );
      return data.data as Tours;
    },
    onSuccess(data) {
      setTours(data);
      setTour(null);
    },
    onError: (error: any) => {
      console.log(error.message);
      navigate('/not-found');
    },
  });

  if (isLoading)
    return (
      <main className='mx-auto min-h-screen'>
        <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Oval
            height={40}
            width={40}
            color='#4fa94d'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#4fa94d'
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>
      </main>
    );

  return (
    <main className='mb-8'>
      <ul className='grid grid-cols-3 gap-8'>
        {tours?.map((tour) => (
          <li className='shadow-md' key={tour._id}>
            <img
              src={`/img/tours/${tour.imageCover}`}
              alt={tour.name}
              className='w-full h-52 object-cover'
            />
            <div className='p-5 py-8 flex flex-col gap-4'>
              <h2 className='text-green-700 font-medium uppercase'>
                {tour.name}
              </h2>
              <p className='text-slate-600'>{tour.summary}</p>
              <Link to={`/${tour._id}`}>
                <button className='self-start bg-green-700 text-white py-2 px-6 rounded-md mt-4 transition hover:bg-green-700/70'>
                  Details
                </button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ToursOverview;

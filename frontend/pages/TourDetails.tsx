import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { Helmet } from 'react-helmet';

import { Tour } from '../data/type';
import { useToursStore } from '../store/store';

const TourDetails = () => {
  const params = useParams();
  const { tourId } = params;
  const navigate = useNavigate();
  const { tour, setTour } = useToursStore();

  const { isLoading: queryIsLoading } = useQuery({
    queryKey: ['tour'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/tours/${tourId}`
      );
      return data.data as Tour;
    },
    onSuccess(data) {
      setTour(data);
    },
    onError: (error: any) => {
      console.log(error.message);
      navigate('/not-found');
    },
  });

  const { mutate: editTourMutation, isLoading: patchIsLoading } = useMutation({
    mutationKey: ['tour'],
    mutationFn: async () => {
      const updatedName = tour?.name.startsWith('Edited')
        ? tour.name.slice(8)
        : `Edited: ${tour?.name}`;

      const updatedTour = {
        ...tour,
        name: updatedName,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/tours/${tour?._id}`,
        {
          name: updatedName,
        }
      );

      return updatedTour as Tour;
    },
    onSuccess(data) {
      setTour(data);
    },
    onError: (error: any) => {
      console.log(error.message);
      navigate('/not-found');
    },
  });

  const editTour = async () => {
    if (!tour) return;
    editTourMutation();
  };

  const { mutate: mutateDeleteTour, isLoading: deleteIsLoading } = useMutation({
    mutationKey: ['tour'],
    mutationFn: async () => {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/tours/${tour?._id}`
      );
    },
    onSuccess() {
      navigate('/', { replace: true });
      setTour(null);
    },
    onError: (error: any) => {
      console.log(error.message);
      navigate('/not-found');
    },
  });

  const deleteTour = async () => {
    if (!tour) return;
    mutateDeleteTour();
  };

  if (queryIsLoading)
    return (
      <>
        <Helmet>
          <title>Tour loading...</title>
        </Helmet>
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
      </>
    );

  return (
    <>
      <Helmet>
        <title>{queryIsLoading ? 'Tour loading...' : tour?.name}</title>
      </Helmet>
      <div
        className='w-full h-96 bg-cover bg-center rounded-lg  mb-6'
        style={{
          backgroundImage: `url(/img/tours/${tour?.imageCover})`,
        }}
      ></div>
      <div className='flex items-center gap-6 mb-6'>
        <h1 className='text-green-700 text-3xl font-bold'>{tour?.name}</h1>
        <button
          className='bg-green-700 text-white py-2 px-6 rounded-md mt-4 transition hover:bg-green-700/70 ml-auto disabled:bg-green-700/40'
          onClick={editTour}
          disabled={patchIsLoading}
        >
          {patchIsLoading ? 'Editing...' : 'Edit'}
        </button>
        <button
          className='bg-red-700 text-white py-2 px-6 rounded-md mt-4 transition hover:bg-red-700/70 disabled:bg-red-700/40'
          onClick={deleteTour}
          disabled={deleteIsLoading}
        >
          {deleteIsLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </>
  );
};

export default TourDetails;

import { useEffect } from 'react';
import ToursOverview from '../components/ToursOverview';

const Tours = () => {
  useEffect(() => {
    document.title = 'Tours Overview';
  }, []);

  return (
    <>
      <ToursOverview />
    </>
  );
};

export default Tours;

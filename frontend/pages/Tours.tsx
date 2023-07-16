import ToursOverview from '../components/ToursOverview';
import { Helmet } from 'react-helmet';

const Tours = () => {
  return (
    <>
      <Helmet>
        <title>Tours Overview</title>
      </Helmet>
      <ToursOverview />
    </>
  );
};

export default Tours;

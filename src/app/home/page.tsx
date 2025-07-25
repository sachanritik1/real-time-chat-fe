import ChatBox from './ChatBox';
import ProtectedRoute from '@/components/ProtectedRoute';

const Home = () => {
  return (
    <ProtectedRoute>
      <ChatBox />
    </ProtectedRoute>
  );
};

export default Home;

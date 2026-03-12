import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  allowedRole?: string;
}

const PrivateRoute = ({ allowedRole }: Props) => {
  const { user, token } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/contests" />;
  return <Outlet />;
};

export default PrivateRoute;
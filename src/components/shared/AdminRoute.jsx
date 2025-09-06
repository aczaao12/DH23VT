import { Navigate } from 'react-router-dom';

const AdminRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;

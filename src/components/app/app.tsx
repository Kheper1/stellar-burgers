import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useEffect } from 'react';
import { AppDispatch, useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';

interface LocationState {
  background?: Location;
}

const modalRoutesConfig = [
  {
    path: '/ingredients/:id',
    title: 'Детали ингредиента',
    element: <IngredientDetails />
  },
  {
    path: '/feed/:number',
    title: 'Детали заказа',
    element: <OrderInfo />
  },
  {
    path: '/profile/orders/:number',
    title: 'Детали заказа',
    element: <OrderInfo />
  }
];

const ModalRoutes = ({ onClose }: { onClose: () => void }) => (
  <Routes>
    {modalRoutesConfig.map(({ path, title, element }) => (
      <Route
        key={path}
        path={path}
        element={
          <Modal title={title} onClose={onClose}>
            {element}
          </Modal>
        }
      />
    ))}
  </Routes>
);

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute notInit>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute notInit>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute notInit>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute notInit>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && <ModalRoutes onClose={handleModalClose} />}
    </div>
  );
};

export default App;

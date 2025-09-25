import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';

import { Welcome } from './Welcome/WelcomePage';
import { SignIn } from './Pages/SignIn/SignIn';
import { SignUp } from './Pages/SignUp/SignUp';
import { DashboardLayout } from './Pages/DashboardLayout';
import { Overview } from './Pages/Overview/Overview';
import { Invoicing } from './Pages/Invoicing/Invoicing';



function App() {

  const router = createBrowserRouter([
    // { path: '/', element: <Welcome /> },
    { path: '/', element: <Navigate to='/signin' /> },
    { path: '/signin', element: <SignIn /> },
    { path: '/signup', element: <SignUp /> },
    {
      path: '/dashboard', element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <Overview /> },
        { path: 'invoicing', element: <Invoicing /> },
      ]
    },

  ]);

  return (
    <ChakraProvider>
      <Provider store={store} >
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  );
}

export default App

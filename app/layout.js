import 'styles/theme.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import NotificationListener from 'data/NotificationListener';

export const metadata = {
  title: 'Club Management System',
  description: '',
  keywords: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-light">
        {children}
        <NotificationListener />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}

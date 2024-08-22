
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImportBootstrap = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return null;
};

export default ImportBootstrap;

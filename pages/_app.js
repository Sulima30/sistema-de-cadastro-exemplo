import '../app/custom.css';
import '../app/globals.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImportBootstrap from '@/components/bootstrap';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // Mantém o scroll da página ao mudar de rota
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      if (!shallow) {
        window.scrollTo(0, 0);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <ImportBootstrap />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
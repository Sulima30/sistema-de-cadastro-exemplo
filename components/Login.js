import { useState } from 'react';
import { MyButton } from './MyButton';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    // Simulando verificação de login e perfil
    let userProfile = '';

    // Substituir esta lógica pela verificação real de login
    if (username === 'Admin' && password === '1234') {
      userProfile = 'admin';
    } else if (username === 'garcom' && password === 'garcom') {
      userProfile = 'garcom';
    } else if (username === 'cozinheiro' && password === 'cozinheiro') {
      userProfile = 'cozinheiro';
    } else {
      alert('Credenciais inválidas');
      return;
    }

    // Redirecionar baseado no perfil do usuário
    switch (userProfile) {
      case 'admin':
        router.push('/admin');
        break;
      case 'garcom':
        router.push('/garcom');
        break;
      case 'cozinheiro':
        router.push('/cozinheiro');
        break;
      default:
        router.push('/login');
    }
  };
  return (
    <section className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 bg-sistem">
      <div className="align-items-center justify-content-center g-0 min-vh-100 row">
        <div className="py-8 py-xl-0 col-lg-5 col-md-5">
          <div className="card">
            <div className="p-6 card-body bg-gray-sistem">
              <div className="mb-4">
                <Link href="/">
                  <div className='text-center m-0'>
                    <Image
                      src="/img/Spurgeon.svg"
                      width={300}
                      height={150}
                      alt="Logo da Empresa"
                      priority
                    />
                  </div>
                </Link>
                <hr className="my-4" />
                <h3 className="mb-1 fw-bold sl-color">Bem-Vindo!</h3>
                <span className='text-gray-dark small'>Por favor, preencha com suas credenciais de acesso para utilizar o sistema.</span>
              </div>
              <form onSubmit={handleLogin} method='post'>
                <div className="row">
                  <div className="mb-3 col-lg-12 col-md-12">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Image
                          src="/icons/person-fill-lock.svg"
                          width={30}
                          height={30}
                          alt="Ícone de Pessoa"
                          priority
                        />
                      </span>
                      <input
                        type="text"
                        aria-label="username"
                        className="form-control bg-white"
                        placeholder='Usuário'
                        value={username}
                        id='username'
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-lg-12 col-md-12">
                    <div className="input-group">
                      <span className="input-group-text sl-color">
                        <Image
                          src="/icons/key-fill.svg"
                          width={30}
                          height={30}
                          alt="Ícone de Cadeado"
                          priority
                        />
                      </span>
                      <input
                        type="password"
                        aria-label="password"
                        className="form-control bg-white"
                        id='password'
                        placeholder='Senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3 col-lg-12 col-md-12">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="mb-3 mb-md-0">
                        <div className="form-check">
                          <input type="checkbox" id="formBasicCheckbox" className="form-check-input" />
                          <label title="" htmlFor="formBasicCheckbox" className="form-check-label">Lembre-me!</label>
                        </div>
                      </div>
                      <Link href="" className='sl-color-link'>Esqueci minha senha?</Link>
                    </div>
                  </div>
                  <div className="mb-0 d-grid gap-2 col-lg-12 col-md-12">
                    <MyButton name="Acessar" type="submit" className="btn-sl" />
                  </div>
                </div>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
              <hr className="my-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BarraInicial() {
  return (
    <>
      <nav class="navbar navbar-expand-lg px-4 py-2 bg-gray-sistem">
        <Link href={'/admin'}>
          <Image
            src="/img/Spurgeon.svg"
            width={100}
            height={100}
            alt="Logo da Empresa"
            margin={0}
            style={{ maxWidth: '100%', height: '100%' }}
          /></Link>
        <ul class="ms-auto d-flex align-items-center list-unstyled mb-0">
          <li class="nav-item dropdown ms-auto"><a class="nav-link pe-0" id="userInfo" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><Image className="avatar p-1" src="/img/avatar-de-perfil.png" alt="Imagem do Perfil" width={20} height={20}></Image></a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated" aria-labelledby="userInfo">
              <div class="dropdown-header text-gray-700">
                <h6 class="text-uppercase font-weight-bold">Sistema Comercial</h6><small>Administrador</small>
              </div>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">
                <Image src="/icons/gear-fill.svg" width={20} height={20} alt="Logo da Empresa" /> Configurações</a>
              <a class="dropdown-item" href="#">
                <Image src="/icons/question-circle.svg" width={20} height={20} alt="Logo da Empresa" /> Ajuda</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#"><Image src="/icons/box-arrow-right.svg" width={20} height={20} alt="Logo da Empresa" /> Sair</a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  )
}
import React from "react";
import Link from "next/link";
import Image from "next/image";
// import DateTime from "./Date-and-Time";

export function NavTelasOperacionais({ nome_Sistema }) {
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-gray-sistem small">
        <div class="container-fluid">
          <Link className="" href="/admin">
            <Image src="/Favicon.svg" width={20} height={20} style={{ margin: "0 10px" }} alt="icone sistema" />
            {nome_Sistema}
          </Link>
          {/* <span><DateTime /></span> */}
          <span>| Versão: 1.0</span>
        </div>
      </nav>
    </>
  )
}
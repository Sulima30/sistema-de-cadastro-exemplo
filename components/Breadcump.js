import React from "react";
import Link from "next/link";

export default function Breadcump({ primeiroNivel, segundoNivel, link }) {

  return (
    <>
      <div class="page-breadcrumb">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <Link href={link}>{primeiroNivel}</Link></li>
          <li class="breadcrumb-item active">{segundoNivel}</li>
        </ul>
      </div>
    </>
  )
}
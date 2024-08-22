import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CardIndicator() {

  return (
    <>
      <div className="row">
        <div class="col-lg-4 col-sm-6">
          <div class="card mb-2">
            <div class="card-body p-3">
              <div class="row">
                <div class="col-2">
                  <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                    <Image src="/icons/currency-dollar.svg" width={30} height={30}
                      style={{ margin: "0 10px" }} alt="desc imagem" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-capitalize font-weight-bold">Volume de Pedidos</p>
                    <h5 className="font-weight-bolder mb-0">
                      {/* {QuantFaturadosFormatados !== null ? QuantFaturadosFormatados : 'Carregando...'} */}
                      5
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}









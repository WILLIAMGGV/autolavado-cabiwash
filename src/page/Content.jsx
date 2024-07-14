import React from "react";
import imgcliente from "../img/auto-clientes.jpg";

const Content = () => {
  return (
    <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
      <div className="m-2">
        <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
          <img
            className="relative h-40 w-full rounded-t-md"
            src={imgcliente}
            alt=""
          />
          <span className="flex font-semibold text-gray-200 shadow-2xl place-content-end rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
            Clientes&nbsp;&nbsp;&nbsp;
          </span>
        </div>
        <div className=" bg-white rounded-b-md">Contenido</div>
      </div>
      <div className="m-2 bg-white rounded-md">HOLA</div>
    </div>
  );
};

export default Content;

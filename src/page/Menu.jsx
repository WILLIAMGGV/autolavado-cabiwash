import React from "react";

const Menu = ({ opcion }) => {
  const enviaropcion = (valor) => {
    opcion(valor);
  };
  return (
    <div className=" h-[60px] bg-[#18304f] p-2">
      <div className="w-40 flex pl-2">
        <a
          href="#"
          onClick={() => {
            enviaropcion("ventas");
          }}
          class="flex items-center p-2 text-white rounded-lg hover:text-gray-800 hover:font-bold hover:bg-gradient-to-tr hover:from-[#03f6ff] hover:to-white group"
        >
          <svg
            class="w-5 h-5 hover:text-gray-800 text-white  "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 12v6h8v-6H8Z"
            />
          </svg>

          <span class="ms-3">Ventas</span>
        </a>
        <a
          href="#"
          onClick={() => {
            enviaropcion("clientes");
          }}
          class="flex items-center p-2 text-white rounded-lg hover:text-gray-800 hover:font-bold hover:bg-gradient-to-tr hover:from-[#03f6ff] hover:to-white group"
        >
          <svg
            class="w-6 h-6 hover:text-gray-800  text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2 8v-2h7v2H4Zm0 2v2h7v-2H4Zm9 2h7v-2h-7v2Zm7-4v-2h-7v2h7Z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="ms-3">Productos</span>
        </a>
        <a
          href="#"
          onClick={() => {
            enviaropcion("services");
          }}
          class="flex items-center p-2 text-white rounded-lg hover:text-gray-800 hover:font-bold hover:bg-gradient-to-tr hover:from-[#03f6ff] hover:to-white group"
        >
          <svg
            class="w-6 h-6 hover:text-gray-800  text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
            />
          </svg>

          <span class="ms-3">Dolar</span>
        </a>
      </div>
    </div>
  );
};

export default Menu;

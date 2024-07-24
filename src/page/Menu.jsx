import React from "react";

const Menu = ({ opcion }) => {
  const enviaropcion = (valor) => {
    opcion(valor);
  };
  return (
    <div className=" h-[60px] bg-black p-2">
      <div className="w-40 flex pl-2">
        <a
          href="#"
          onClick={() => {
            enviaropcion("ventas");
          }}
          class="flex items-center p-2 text-white rounded-lg hover:text-gray-800 hover:font-bold hover:bg-gradient-to-tr hover:from-[#1ab6f3] hover:to-white group"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
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
          class="flex items-center p-2 text-white rounded-lg hover:text-gray-800 hover:font-bold hover:bg-gradient-to-tr hover:from-[#1ab6f3] hover:to-white group"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="ms-3">Clientes</span>
        </a>
        <a
          href="#"
          onClick={() => {
            enviaropcion("services");
          }}
          class="flex items-center p-2 text-white rounded-lg hover:text-gray-800 hover:font-bold hover:bg-gradient-to-tr hover:from-[#1ab6f3] hover:to-white group"
        >
          <svg
            class="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 6h16v6H4v-6Z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M5 14a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Zm5 0a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1Z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="ms-3">Suscripciones</span>
        </a>
      </div>
    </div>
  );
};

export default Menu;

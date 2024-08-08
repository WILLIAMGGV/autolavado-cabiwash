import React from "react";
import { useState, useEffect } from "react";
import logo from "../img/logo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erroruser, setErroruser] = useState(false);

  const entrar = () => {
    if (
      email === "lacasadelahumado@gmail.com" &&
      password === "LaCasa2024-22"
    ) {
      // Convertir el objeto a JSON
      const session = {
        user: "omar",
        tipo: "adminwash",
      };
      const sessionJSON = JSON.stringify(session);

      // Guardar la sesión en localStorage
      localStorage.setItem("session", sessionJSON);
      window.location.href = "/";
    } else {
      setErroruser(true);
    }
  };

  useEffect(() => {
    setErroruser(false);
  }, [email, password]);

  return (
    <div className=" m-0 h-screen w-screen flex max-md:flex-col  place-content-center items-center bg-slate-900">
      <div className=" max-md:border-b-0 max-md:rounded-b-0 max-md:rounded-l-none max-md:border-t-0 max-md:border-l-0 border-t-2 border-t-teal-800 border-b-2 border-b-teal-800  border-l-2 border-l-teal-800 w-[300px] max-md:h-[120px] h-[50%] rounded-tl-3xl rounded-bl-3xl shadow-2xl">
        <img
          className=" max-md:hidden h-full rounded-l-3xl max-md:rounded-none max-md:rounded-t-2xl"
          src={logo}
        />
        <img
          className="md:hidden max-md:w-full rounded-l-3xl max-md:rounded-none max-md:rounded-t-2xl"
          src={logo}
        />
      </div>

      <div className=" max-md:border-b-0 max-md:rounded-b-3xl max-md:border-t-0 max-md:rounded-none  max-md:border-r-0 w-[300px] bg-slate-800 border-r-2 border-r-teal-800 border-t-2 border-t-teal-800 border-b-2 border-b-teal-800 h-[50%] rounded-br-3xl rounded-tr-3xl shadow-2xl">
        <div className=" text-xl text-center pt-4 text-cyan-100">
          INICIAR SESION
        </div>
        <div className="pl-4 pt-4 text-cyan-600 text-[12px]">
          Ingrese su Usuario
        </div>
        <div class="flex pl-4 pr-4 pt-2">
          <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          </span>
          <input
            type="email"
            id="email"
            name="email"
            class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="jose@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="pl-4 pt-4 text-cyan-600 text-[12px]">
          Clave de Acceso:
        </div>
        <div class="flex pl-4 pr-4 pt-2">
          <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <input
            type="password"
            id="password"
            name="password"
            class="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          {erroruser == false ? (
            <div></div>
          ) : (
            <div className="pt-2 text-red-600 font-bold text-[12px] text-center">
              Credenciales Invalidas
            </div>
          )}
        </div>
        <div className="pl-4 pt-4 pr-4">
          <button
            type="submit"
            onClick={() => {
              entrar();
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-1 w-full focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Ingresar
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Login;

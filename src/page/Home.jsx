import React from "react";
import { useState } from "react";
import logo from "../img/logo.jpg";
import salir from "../img/logout.png";
import Menu from "./Menu";
import Content from "./Content";

const Home = () => {
  const [selectmenu, setSelectmenu] = useState("juegos");

  const opcion = (actual) => {
    setSelectmenu(actual);
  };

  const logout = async () => {
    window.location = "./#/login";
  };

  return (
    <div className="m-0 h-full w-full p-0  bg-slate-900">
      <div className=" bg-white p-2 h-28 w-full flex place-content-between items-center border-b-4 border-b-[#1ab6f3]">
        <div className="">
          <img src={logo} alt="logo" priority className="h-full w-36 " />
        </div>

        <div className="flex">
          <div className="p-2">
            <div className="flex items-center gap-4 ">
              <div className="font-medium shadow-md rounded-md border-1 p-2 border-gray-600    bg-gradient-to-tr from-[#1ab6f3] to-white ">
                <div className="text-blue-950 ">Omar Matos</div>
                <div className="text-sm text-gray-500 italic dark:text-gray-400 ">
                  Administrador
                </div>
              </div>
              <img
                onClick={() => {
                  logout();
                }}
                className="w-12 h-12 shadow-md p-2 rounded-full border-2 hover:bg-black bg-slate-200 cursor-pointer border-[#1ab6f3]"
                src={salir}
                alt=""
              />
            </div>
          </div>

          <div></div>
        </div>
      </div>
      <Menu opcion={opcion} />
      {selectmenu == "juegos" ? <Content /> : <></>}
      <div className=" bg-black w-full p-2 m-0 h-[80%]">
        <div className="">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="https://toppower.com/" className="hover:underline">
              CABI-WASH™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
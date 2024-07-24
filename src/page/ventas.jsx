import React, { useState, useEffect } from "react";
import imgcliente from "../img/auto-clientes.jpg";
import imgqr from "../img/generatorqr.jpg";
import imgcar1 from "../img/car1.jpg";
import imgregcar from "../img/registercar.jpg";
import imgventas from "../img/ventas.jpg";
import sincar from "../img/sincar.png";
import { Tooltip } from "antd";
import { Scanner } from "@yudiel/react-qr-scanner";
import { uploadFile } from "../firebase/db";
import { db } from "../firebase/db";
import { collection, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "@firebase/firestore";
import { click } from "@testing-library/user-event/dist/click";
import Vendido from "./vendido";

var escaneo = [];
const Ventas = () => {
  const obtenerfecha = () => {
    //TOMAR HORA ACTUAL
    var tomarfecha = "";
    tomarfecha = "" + moment.utc().format();
    tomarfecha = tomarfecha.replace("Z", "");
    var date3 = new Date(tomarfecha);
    date3.setHours(date3.getHours() - 4);
    //FIN DE HORA ACTUAL RESULT EN date3
    var dia;
    if (parseInt(date3.getDate()) > 0 && parseInt(date3.getDate()) < 10) {
      dia = "0" + date3.getDate();
    } else {
      dia = date3.getDate();
    }
    //TOMA LA FECHA EN FORMATO YYYY-MM-DD
    var mes;
    if (date3.getMonth() + 1 > 9) {
      var date4 =
        date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-" + dia;
    } else {
      mes = "0" + (date3.getMonth() + 1);
      var date4 = date3.getFullYear() + "-" + mes + "-" + dia;
    }
    //LA FECHA EN FORMATO YYYY-MM-DD GUARDADA EN LA VARIABLE data4
    return date4;
  };

  const [option, setOption] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [codeqr, setCodeqr] = useState(false);
  const [valorqr, setValorqr] = useState("");
  const [rutacarro, setRutacarro] = useState("");
  const [file, setFile] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [carros, setCarros] = useState([]);
  const [editcarro, setEditCarro] = useState([]);
  const [escaneo2, setEscaneo2] = useState([]);
  const [registro, setRegistro] = useState(1);
  const [valorfecha, setValorfecha] = useState(obtenerfecha());
  const [reporte, setReporte] = useState("ventas");

  const msjsave = (mensajesave, tipodemensaje) => {
    if (tipodemensaje == "save") {
      toast.success(mensajesave, {});
    }
    if (tipodemensaje == "error") {
      toast.error(mensajesave, {});
    }
    if (tipodemensaje == "warning") {
      toast.warning(mensajesave, {});
    }
    if (tipodemensaje == "info") {
      toast.info(mensajesave, {});
    }
  };

  const onChange = (date, dateString) => {
    setValorfecha(dateString);
    console.log(dateString);
  };

  const getbuscarcar = () => {
    escaneo = [];
    for (let i = 0; i < clientes.length; i++) {
      console.log(clientes[i].id);
      const collectionRef = collection(db, `clientes/${clientes[i].id}/carros`);
      getDocs(collectionRef).then((querySnapshot) => {
        const arraydoc = [];
        querySnapshot.forEach((doc) => {
          arraydoc.push({ ...doc.data(), id: doc.id });
          console.log(doc.data().color);
          console.log(clientes[i].id);
          console.log(doc.id);
          console.log(valorqr);
          if (escaneo.length == 0) {
            if (doc.id == valorqr) {
              console.log("entro");
              escaneo.push(clientes[i].id);
              escaneo.push(clientes[i].nombre);
              escaneo.push(clientes[i].apellido);
              escaneo.push(clientes[i].suscripcion);
              escaneo.push(clientes[i].fechafinal);
              escaneo.push(doc.data().rutacarro);
            }
          }
        });
        console.log(escaneo);
        setEscaneo2(escaneo);
      });
    }
  };

  const getclientes = async () => {
    const protemploCollection = collection(db, "clientes");
    const data = await getDocs(protemploCollection);
    console.log(data.docs);

    setClientes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const obtenervigencia = (fechae) => {
    const fechaActual = new Date();
    const fechaSumada = new Date(fechae);
    console.log(fechaSumada);
    console.log(fechaActual);
    if (fechaActual < fechaSumada) {
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }
  };

  const confirmarregistrosimple = () => {
    Swal.fire({
      title: "Confirma esta venta simple?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Confirmo",
    }).then((result) => {
      if (result.isConfirmed) {
        registrarventasimple();
        Swal.fire({
          title: "Venta Registrada con Exito!",
          text: "Puede consultar sus ventas diarias",
          icon: "success",
        });
      }
    });
  };

  const confirmarvisita = () => {
    Swal.fire({
      title: "Confirma esta visita?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Confirmo",
    }).then((result) => {
      if (result.isConfirmed) {
        registrarvisita();
        Swal.fire({
          title: "Visita Registrada con Exito!",
          text: "Puede consultar las visitas diarias",
          icon: "success",
        });
      }
    });
  };

  const registrarventasimple = async () => {
    var venta = document.getElementById("list-venta-moto").checked;
    var venta2 = document.getElementById("list-venta-carro").checked;
    var venta3 = document.getElementById("list-venta-camioneta").checked;

    var precio = 0;
    var tipo = "";
    if (venta == true) {
      precio = document.getElementById("list-venta-moto").value;
      tipo = "moto";
    }
    if (venta2 == true) {
      precio = document.getElementById("list-venta-carro").value;
      tipo = "carro";
    }
    if (venta3 == true) {
      precio = document.getElementById("list-venta-camioneta").value;
      tipo = "camioneta";
    }

    var fecha = obtenerfecha();

    try {
      const docRef = doc(db, "ventas", fecha); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        //Agrega más campos según sea necesario
      });

      const path = `ventas/${fecha}/vendido`;

      const min = 100000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const docRef2 = doc(db, path, "V" + randomNumber);
      await setDoc(docRef2, {
        tipodeventa: "Venta Regular",
        tipo: tipo,
        precio: parseFloat(precio),
      });

      setValorqr("");

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }
  };

  const registrarvisita = async () => {
    var fecha = obtenerfecha();

    try {
      const docRef = doc(db, "visitas", fecha); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        //Agrega más campos según sea necesario
      });

      const path = `visitas/${fecha}/vendido`;

      const min = 100000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const docRef2 = doc(db, path, "V" + randomNumber);
      await setDoc(docRef2, {
        dni: escaneo2[0],
        nombre: escaneo2[1] + " " + escaneo2[2],
        suscripcion: escaneo2[3],
      });
      setValorqr("");
      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }
  };

  const actualiarreporte = () => {
    var opcion1 = document.getElementById("list-venta").checked;
    var opcion2 = document.getElementById("list-visita").checked;

    console.log(opcion1);
    console.log(opcion2);

    if (opcion1 == true) {
      setReporte("ventas");
    }

    if (opcion2 == true) {
      setReporte("visitas");
    }
  };

  useEffect(() => {
    getclientes();
  }, []);

  useEffect(() => {
    getbuscarcar();
  }, [clientes]);

  useEffect(() => {
    if (valorqr != "") {
      setShowModal(false);
      getbuscarcar();
    }
  }, [valorqr]);

  return (
    <>
      {option == 1 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-center rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgventas}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Escanear Codigo QR&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                {valorqr == "" ? (
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(true);
                        setValorqr("");
                      }}
                      class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                    >
                      <svg
                        class="w-[32px] h-[32px] text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"
                        />
                        <path
                          stroke="currentColor"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"
                        />
                      </svg>
                      &nbsp;Escanear Codigo QR
                    </button>
                  </div>
                ) : (
                  <>
                    {valorqr == "CABI-VENTASIMPLE" ? (
                      <>
                        <div className="flex flex-col place-content-center m-2 rounded-md border-2 border-zinc-700 bg-slate-400">
                          <span className=" text-center font-bold text-2xl p-4 text-blue-900">
                            VENTA SIMPLE
                          </span>
                          <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                              <div class="flex items-center ps-3">
                                <input
                                  id="list-venta-moto"
                                  type="radio"
                                  value="3"
                                  name="list-venta"
                                  checked
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  for="list-venta-moto"
                                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  Moto 3$
                                </label>
                              </div>
                            </li>
                            <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                              <div class="flex items-center ps-3">
                                <input
                                  id="list-venta-carro"
                                  type="radio"
                                  value="5"
                                  name="list-venta"
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  for="list-venta-carro"
                                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  Carro 5$
                                </label>
                              </div>
                            </li>
                            <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                              <div class="flex items-center ps-3">
                                <input
                                  id="list-venta-camioneta"
                                  type="radio"
                                  value="7"
                                  name="list-venta"
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  for="list-venta-camioneta"
                                  class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  Camioneta 7$
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <div className=" flex flex-row place-content-end">
                            <button
                              type="button"
                              onClick={() => {
                                confirmarregistrosimple();
                              }}
                              class="m-2 text-gray-900 bg-[#2badd2] hover:bg-[#38cef7]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                            >
                              <svg
                                class="w-6 h-6 text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              &nbsp;REGISTRAR VENTA
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row m-2 rounded-md border-2 border-zinc-700 bg-slate-400">
                          {escaneo2.length == 0 ? (
                            <div className=" flex flex-col rounded-md w-full border-black bg-red-600 text-center">
                              <span>
                                <span className=" text-white text-xl font-bold">
                                  SIN RESULTADOS
                                </span>
                              </span>
                            </div>
                          ) : (
                            <>
                              <div>
                                <img
                                  className="relative h-full w-[280px] rounded-l-md"
                                  src={escaneo2[5]}
                                  alt=""
                                />
                              </div>
                              <div className="w-[70%]">
                                <div className="flex flex-col ml-2">
                                  <span>
                                    <b className=" text-blue-800">DNI:</b>{" "}
                                    {escaneo2[0]}
                                  </span>
                                  <span>
                                    <b className=" text-blue-800 italic">
                                      {escaneo2[1]} {escaneo2[2]}
                                    </b>
                                  </span>
                                  <span>
                                    <b className=" flex flex-row text-red-800">
                                      <svg
                                        class="w-6 h-6 text-gray-800"
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
                                      {escaneo2[3] == "" ? (
                                        <span>No tiene Suscripcion</span>
                                      ) : (
                                        <span>{escaneo2[3]}</span>
                                      )}
                                    </b>
                                  </span>
                                  {escaneo2[3] == "" ? (
                                    <></>
                                  ) : (
                                    <>
                                      {obtenervigencia(escaneo2[4]) == true ? (
                                        <span className=" flex flex-col rounded-md border-2 m-2 border-black bg-green-600 text-center">
                                          <span className=" text-white text-xl font-bold">
                                            ACTIVA
                                          </span>
                                          <span className=" italic text-blue-950">
                                            fecha de Expiracion
                                          </span>
                                          <span>
                                            <b>{escaneo2[4]}</b>
                                          </span>
                                        </span>
                                      ) : (
                                        <span className=" flex flex-col rounded-md border-2 m-2 border-black bg-red-600 text-center">
                                          <span className=" text-white text-xl font-bold">
                                            VENCIDA
                                          </span>
                                          <span className=" italic text-blue-950">
                                            fecha de Expiracion
                                          </span>
                                          <span>
                                            <b>{escaneo2[4]}</b>
                                          </span>
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div>
                          <div className=" flex flex-row place-content-end">
                            {escaneo2.length == 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setShowModal(true);
                                  setValorqr("");
                                }}
                                class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                              >
                                <svg
                                  class="w-[32px] h-[32px] text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"
                                  />
                                  <path
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"
                                  />
                                </svg>
                                &nbsp;Escanear Codigo QR
                              </button>
                            ) : (
                              <>
                                {obtenervigencia(escaneo2[4]) == true ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      confirmarvisita();
                                    }}
                                    class="m-2 text-gray-900 bg-[#2badd2] hover:bg-[#38cef7]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                                  >
                                    <svg
                                      class="w-6 h-6 text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                    &nbsp;REGISTRAR VISITA
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowModal(true);
                                      setValorqr("");
                                    }}
                                    class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
                                  >
                                    <svg
                                      class="w-[32px] h-[32px] text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"
                                      />
                                      <path
                                        stroke="currentColor"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"
                                      />
                                    </svg>
                                    &nbsp;Escanear Codigo QR
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          {registro == 1 ? (
            <div className="m-2">
              <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
                <img
                  className="relative h-40 w-full rounded-t-md"
                  src={imgcliente}
                  alt=""
                />
                <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                  Ventas Diarias
                </span>
              </div>

              <div className=" bg-white rounded-b-md">
                <div className=" flex flex-col ml-4 pt-4">
                  <span className=" text-blue-900 font-semibold">
                    Seleccionar Fecha
                  </span>
                  <div className="flex flex-row">
                    <DatePicker onChange={onChange} />
                    <div className="pt-2">
                      &nbsp;&nbsp;&nbsp;
                      <input
                        id="list-venta"
                        type="radio"
                        value="ventas"
                        name="list-tipo"
                        onChange={() => {
                          actualiarreporte();
                        }}
                        onClick={() => {
                          actualiarreporte();
                        }}
                        checked
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        for="list-venta"
                        class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Venta
                      </label>
                      &nbsp;&nbsp;&nbsp;
                      <input
                        id="list-visita"
                        type="radio"
                        value="visitas"
                        onChange={() => {
                          actualiarreporte();
                        }}
                        onClick={() => {
                          actualiarreporte();
                        }}
                        name="list-tipo"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        for="list-visita"
                        class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Visitas
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="mt-2" />
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <Vendido fecha={valorfecha} reporte={reporte} />
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-lg">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-white">
                {/*body*/}
                <div className="h-12 bg-black rounded-t-lg place-content-center flex flex-grow text-[#1ab6f3] text-xl font-semibold">
                  <span className="mt-2 pl-2">Registrar Suscripcion</span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div>
                      <Scanner
                        onScan={(result) => {
                          setValorqr(result[0].rawValue);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="h-14 bg-black rounded-b-lg place-content-end flex flex-grow text-cyan-300 text-2xl font-semibold font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                    }}
                    data-modal-hide="popup-modal"
                    class="m-2 text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {showModal2 ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-lg">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-white">
                {/*body*/}
                <div className="h-12 bg-black rounded-t-lg place-content-center flex flex-grow text-[#1ab6f3] text-xl font-semibold">
                  <span className="mt-2 pl-2">Editar Vehiculo</span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div>
                      <div className="p-2 md:p-2">
                        <div className="p-2">
                          <label
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            for="file_input"
                          >
                            Subir Foto (Opcional)
                          </label>
                          <input
                            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
                            id="file_input2"
                            type="file"
                          ></input>
                        </div>

                        <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                          <div>
                            <label
                              for="placa_edit"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Placa
                            </label>
                            <input
                              type="text"
                              id="placa_edit"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder=""
                              required
                            />
                          </div>
                          <div>
                            <label
                              for="marca_edit"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Marca
                            </label>
                            <input
                              type="text"
                              id="marca_edit"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder="John"
                              required
                            />
                          </div>
                          <div>
                            <label
                              for="modelo_edit"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Modelo
                            </label>
                            <input
                              type="text"
                              id="modelo_edit"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder="Doe"
                              required
                            />
                          </div>
                          <div>
                            <label
                              for="color_edit"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Color
                            </label>
                            <input
                              type="text"
                              id="color_edit"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-14 bg-black rounded-b-lg place-content-end flex flex-grow text-cyan-300 text-2xl font-semibold font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal2(false);
                    }}
                    data-modal-hide="popup-modal"
                    class="m-2 text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="m-2 text-gray-900 bg-[#2badd2] hover:bg-[#38cef7]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    &nbsp;GUARDAR
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <ToastContainer theme="dark" />
    </>
  );
};

export default Ventas;

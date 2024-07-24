import React, { useState, useEffect } from "react";
import imgcliente from "../img/auto-clientes.jpg";
import imgqr from "../img/generatorqr.jpg";
import imgcar1 from "../img/car1.jpg";
import imgregcar from "../img/registercar.jpg";
import imgregmem from "../img/registermembresia.jpg";
import imgsuscripcion from "../img/suscripcion.jpg";
import sincar from "../img/sincar.png";
import { Tooltip } from "antd";
import { Scanner } from "@yudiel/react-qr-scanner";
import { uploadFile } from "../firebase/db";
import { db } from "../firebase/db";
import { collection } from "firebase/firestore";
import Swal from "sweetalert2";

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

var todoslosc = [];
const Services = () => {
  const [option, setOption] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [codeqr, setCodeqr] = useState(false);
  const [valorqr, setValorqr] = useState("codigoqr");
  const [rutacarro, setRutacarro] = useState("");
  const [file, setFile] = useState(null);
  const [suscripciones, setsuscripciones] = useState([]);
  const [carros, setCarros] = useState([]);
  const [editcarro, setEditCarro] = useState([]);
  const [registro, setRegistro] = useState(1);
  const [idsuscripcion, setIdsuscripcion] = useState("");

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

  const getsuscripciones = async () => {
    const protemploCollection = collection(db, "suscripciones");
    const data = await getDocs(protemploCollection);
    console.log(data.docs);
    setsuscripciones(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const editarsuscripcion = (id) => {
    setIdsuscripcion(id);
    setRegistro(2);
  };

  const obtenersuscripcion = (id, campo) => {
    for (let i = 0; i < suscripciones.length; i++) {
      if (suscripciones[i].id == id) {
        if (campo == "preciom") {
          return suscripciones[i].preciom;
        }
        if (campo == "precios") {
          return suscripciones[i].precios;
        }
      }
    }
  };

  const eliminarsuscripcion = (id) => {
    Swal.fire({
      title: "Desea Eliminar este registro?",
      text: "Es importante mantener los registros y solo modificar el precio",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deletesuscripcion(id);
        Swal.fire({
          title: "Eliminado!",
          text: "Este registro se elimino con exito",
          icon: "success",
        });
      }
    });
  };

  const deletesuscripcion = async (id) => {
    try {
      const documentRef = doc(db, "suscripciones", id); // Reemplazar con la ruta del documento
      await deleteDoc(documentRef);
      console.log("Documento eliminado con éxito!");
      getsuscripciones();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const nuevosuscripcion = async () => {
    try {
      var nombre = document.getElementById("suscripcion_nuevo").value;
      var preciom = document.getElementById("preciom_nuevo").value;
      var precios = document.getElementById("precios_nuevo").value;

      const docRef = doc(db, "suscripciones", nombre); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        nombre: nombre,
        preciom: preciom,
        precios: precios,

        // Agrega más campos según sea necesario
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Suscripcion Registrado con exito", "save");
    document.getElementById("suscripcion_nuevo").value = "";
    document.getElementById("preciom_nuevo").value = "";
    document.getElementById("precios_nuevo").value = "";
    getsuscripciones();
    setOption(1);
  };

  const modificarsuscripcion = async () => {
    try {
      var nombre = document.getElementById("suscripcion_edit").value;
      var preciom = document.getElementById("preciom_edit").value;
      var precios = document.getElementById("precios_edit").value;

      const docRef = doc(db, "suscripciones", nombre); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        nombre: nombre,
        preciom: preciom,
        precios: precios,
        // Agrega más campos según sea necesario
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Suscripcion Actualizada con exito", "save");
    getsuscripciones();
    setOption(1);
    setRegistro(1);
    setIdsuscripcion(0);
  };

  useEffect(() => {
    getsuscripciones();
  }, []);

  useEffect(() => {
    console.log(suscripciones);
  }, [suscripciones]);

  return (
    <>
      {option == 1 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgsuscripcion}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Suscripciones&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead class="text-xs text-gray-700 uppercase ">
                    <tr>
                      <th scope="col" class="px-6 py-3 bg-gray-50 ">
                        Nombre
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Precio Mensual
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Precio Semestral
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 flex place-content-center"
                      >
                        <Tooltip
                          title="Nuevo Registro"
                          color="#1ab6f3"
                          key="#1ab6f3"
                          className="hover:text-green-500 cursor-pointer"
                          onClick={() => {
                            setOption(1);
                            setRegistro(1);
                            setIdsuscripcion(0);
                          }}
                        >
                          <svg
                            class="w-6 h-6 text-gray-800 hover:text-green-500 cursor-pointer"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {suscripciones.map((val, key) => {
                      return (
                        <tr key={val.id} class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val.id}
                          </th>
                          <td class="px-6 py-4">{val.preciom}</td>
                          <td class="px-6 py-4">{val.precios}</td>

                          <td className="px-6 py-6 flex flex-row">
                            <Tooltip
                              title="Editar este Registro"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-blue-500 cursor-pointer"
                              onClick={() => {
                                editarsuscripcion(val.id);
                              }}
                            >
                              <svg
                                class="w-6 h-6 text-gray-800 hover:text-blue-600 cursor-pointer"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </Tooltip>
                            <span>&nbsp;&nbsp;&nbsp;</span>
                            <Tooltip
                              title="Eliminar"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                eliminarsuscripcion(val.id);
                              }}
                            >
                              <svg
                                class="w-6 h-6 text-gray-800 hover:text-red-600 cursor-pointer"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {registro == 1 ? (
            <div className="m-2">
              <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
                <img
                  className="relative h-40 w-full rounded-t-md"
                  src={imgregmem}
                  alt=""
                />
                <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                  Nueva Suscripcion
                </span>
              </div>
              <div className=" bg-white rounded-b-md">
                <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                  <div>
                    <label
                      for="suscripcion_nuevo"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Nombre de Suscripcion:
                    </label>
                    <input
                      type="text"
                      id="suscripcion_nuevo"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder=""
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="preciom_nuevo"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Precio Mensual
                    </label>
                    <input
                      type="number"
                      id="preciom_nuevo"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Example: 19.99"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="precios_nuevo"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Precio Semestral
                    </label>
                    <input
                      type="number"
                      id="precios_nuevo"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Example: 59.99"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex place-content-end">
                <button
                  type="button"
                  onClick={() => {
                    nuevosuscripcion();
                  }}
                  class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                  &nbsp;GUARDAR DATOS
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {registro == 2 ? (
            <div className="m-2">
              <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
                <img
                  className="relative h-40 w-full rounded-t-md"
                  src={imgregmem}
                  alt=""
                />
                <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                  Editar Suscripcion
                </span>
              </div>
              <div className=" bg-white rounded-b-md">
                <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                  <div>
                    <label
                      for="suscripcion_nuevo"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Nombre de Suscripcion:
                    </label>
                    <input
                      type="text"
                      id="suscripcion_edit"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder=""
                      defaultValue={idsuscripcion}
                      disabled="true"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="preciom_edit"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Precio Mensual
                    </label>
                    <input
                      type="number"
                      id="preciom_edit"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Example: 19.99"
                      defaultValue={obtenersuscripcion(
                        idsuscripcion,
                        "preciom"
                      )}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="precios_edit"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Precio Semestral
                    </label>
                    <input
                      type="number"
                      id="precios_edit"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Example: 59.99"
                      defaultValue={obtenersuscripcion(
                        idsuscripcion,
                        "precios"
                      )}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex place-content-end">
                <button
                  type="button"
                  onClick={() => {
                    modificarsuscripcion();
                  }}
                  class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                  &nbsp;GUARDAR DATOS
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {option == 2 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgcliente}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Nuevo Cliente
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                <div>
                  <label
                    for="dni_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    DNI
                  </label>
                  <input
                    type="text"
                    id="dni_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                  />
                </div>
                <div>
                  <label
                    for="name_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    for="lastname_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastname_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    for="phone_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                    placeholder="123-45-678"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label
                    for="email_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgregcar}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Registro de Vehiculos&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead class="text-xs text-gray-700 uppercase ">
                    <tr>
                      <th scope="col" class="px-6 py-3 bg-gray-50 ">
                        FOTO
                      </th>
                      <th scope="col" class="px-6 py-3 bg-gray-50 ">
                        PLACA
                      </th>
                      <th scope="col" class="px-6 py-3">
                        MARCA
                      </th>
                      <th scope="col" class="px-6 py-3">
                        color
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 flex place-content-center"
                      >
                        <svg
                          onClick={() => {
                            if (carros.length > 1) {
                              msjsave(
                                "Maximo 2 Vehiculos por Cliente",
                                "error"
                              );
                            } else {
                              setShowModal(true);
                              setRutacarro("");
                              setRegistro(1);
                              setCodeqr(false);
                            }
                          }}
                          class="w-6 h-6 text-gray-800 hover:text-green-500 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
            <div className="flex place-content-end mr-[-10px] mt-4">
              <button
                type="button"
                class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                &nbsp;GUARDAR DATOS
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {option == 3 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgcliente}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Editar Cliente
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                <div>
                  <label
                    for="dni_edit"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Suscripcion
                  </label>
                  <input
                    type="text"
                    id="dni_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    defaultValue={idsuscripcion}
                    disabled="true"
                    required
                  />
                </div>
                <div>
                  <label
                    for="name_edit"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="John"
                    defaultValue={obtenersuscripcion(idsuscripcion, "nombre")}
                    required
                  />
                </div>
                <div>
                  <label
                    for="lastname_edit"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastname_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Doe"
                    defaultValue={obtenersuscripcion(idsuscripcion, "apellido")}
                    required
                  />
                </div>
                <div>
                  <label
                    for="phone_edit"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                    placeholder="123-45-678"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label
                    for="email_edit"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgregcar}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Registro de Vehiculos&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead class="text-xs text-gray-700 uppercase ">
                    <tr>
                      <th scope="col" class="px-6 py-3 bg-gray-50 ">
                        FOTO
                      </th>
                      <th scope="col" class="px-6 py-3 bg-gray-50 ">
                        PLACA
                      </th>
                      <th scope="col" class="px-6 py-3">
                        MARCA
                      </th>
                      <th scope="col" class="px-6 py-3">
                        color
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 flex place-content-center"
                      >
                        <svg
                          class="w-6 h-6 text-gray-800 hover:text-green-500 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
            <div className="flex place-content-end mr-[-10px] mt-4">
              <button
                type="button"
                onClick={() => {
                  modificarsuscripcion();
                }}
                class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                &nbsp;GUARDAR DATOS
              </button>
            </div>
          </div>
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
                      <div className="p-2 md:p-2">
                        <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                          <div>
                            <label
                              for="placa_nuevo"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Placa
                            </label>
                            <input
                              type="text"
                              id="placa_nuevo"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder=""
                              required
                            />
                          </div>
                          <div>
                            <label
                              for="marca_nuevo"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Marca
                            </label>
                            <input
                              type="text"
                              id="marca_nuevo"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder="John"
                              required
                            />
                          </div>
                          <div>
                            <label
                              for="modelo_nuevo"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Modelo
                            </label>
                            <input
                              type="text"
                              id="modelo_nuevo"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              placeholder="Doe"
                              required
                            />
                          </div>
                          <div>
                            <label
                              for="color_nuevo"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Color
                            </label>
                            <input
                              type="text"
                              id="color_nuevo"
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

export default Services;

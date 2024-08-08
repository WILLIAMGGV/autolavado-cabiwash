import React, { useState, useEffect } from "react";
import imgcliente from "../img/auto-clientes.jpg";
import imgingre from "../img/ingredientes.jpg";
import imgadicional from "../img/adicional.jpg";

import { Tooltip } from "antd";
import { db } from "../firebase/db";
import { collection } from "firebase/firestore";
import Swal from "sweetalert2";
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

var todoslosc = [];
var todoslosa = [];
const Content = () => {
  const [option, setOption] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [productos, setproductos] = useState([]);
  const [adicional, setadicional] = useState([]);
  const [ingredientes, setingredientes] = useState([]);
  const [editcarro, setEditCarro] = useState([]);
  const [registro, setRegistro] = useState(1);
  const [idproducto, setIdproducto] = useState("");
  const [idadicional, setIdadicional] = useState("");

  const msjsave = (mensajesave, tipodemensaje) => {
    if (tipodemensaje === "save") {
      toast.success(mensajesave, {});
    }
    if (tipodemensaje === "error") {
      toast.error(mensajesave, {});
    }
    if (tipodemensaje === "warning") {
      toast.warning(mensajesave, {});
    }
    if (tipodemensaje === "info") {
      toast.info(mensajesave, {});
    }
  };

  const getproductos = async () => {
    const protemploCollection = collection(db, "productos");
    const data = await getDocs(protemploCollection);

    setproductos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getadicional = async () => {
    const protemploCollection = collection(db, "adicional");
    const data = await getDocs(protemploCollection);

    setadicional(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const editarproducto = (id) => {
    todoslosc = [];

    const collectionRef = collection(db, `productos`);
    getDocs(collectionRef).then((querySnapshot) => {
      const arraydoc = [];
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          arraydoc.push({ ...doc.data(), id: doc.id });
        }
      });

      todoslosc = arraydoc;
      setingredientes(todoslosc[0].ingredientes);
      setIdproducto(id);
      setOption(3);
    });
  };

  const editaradicional = (id) => {
    todoslosa = [];

    const collectionRef = collection(db, `adicional`);
    getDocs(collectionRef).then((querySnapshot) => {
      const arraydoc = [];
      querySnapshot.forEach((doc) => {
        if (doc.id === id) {
          arraydoc.push({ ...doc.data(), id: doc.id });
        }
      });

      todoslosa = arraydoc;

      setIdadicional(id);
      setShowModal3(true);
    });
  };

  const obtenerproducto = (id, campo) => {
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === id) {
        if (campo === "nombre") {
          return productos[i].nombre;
        }
        if (campo === "precio") {
          return productos[i].precio;
        }
      }
    }
  };

  const obteneradicional = (id, campo) => {
    for (let i = 0; i < adicional.length; i++) {
      if (adicional[i].id === id) {
        if (campo === "nombre") {
          return adicional[i].nombre;
        }
        if (campo === "precio") {
          return adicional[i].precio;
        }
      }
    }
  };

  const eliminarproducto = (id) => {
    Swal.fire({
      title: "Desea Eliminar este registro?",
      text: "Al Eliminar, se eliminaran todos los ingredientes de este producto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteproducto(id);
        Swal.fire({
          title: "Eliminado!",
          text: "Este registro se elimino con exito",
          icon: "success",
        });
      }
    });
  };

  const eliminaradicional = (id) => {
    Swal.fire({
      title: "Desea Eliminar este Producto Adicional?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteadicional(id);
        Swal.fire({
          title: "Eliminado!",
          text: "Este registro se elimino con exito",
          icon: "success",
        });
      }
    });
  };

  const deleteproducto = async (id) => {
    try {
      const documentRef = doc(db, "productos", id); // Reemplazar con la ruta del documento
      await deleteDoc(documentRef);
      console.log("Documento eliminado con éxito!");
      getproductos();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const deleteadicional = async (id) => {
    try {
      const documentRef = doc(db, "adicional", id); // Reemplazar con la ruta del documento
      await deleteDoc(documentRef);
      console.log("Documento eliminado con éxito!");
      getadicional();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const nuevoproducto = async () => {
    try {
      var nombre = document.getElementById("name_nuevo").value;
      var precio = document.getElementById("precio_nuevo").value;

      await addDoc(collection(db, "productos"), {
        nombre: nombre,
        precio: precio,
        ingredientes: ingredientes,
        // Agrega más campos según sea necesario
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("producto Registrado con exito", "save");
    getproductos();
    setOption(1);
  };

  const nuevoadicional = async () => {
    try {
      var nombre = document.getElementById("namea_nuevo").value;
      var precio = document.getElementById("precioa_nuevo").value;

      await addDoc(collection(db, "adicional"), {
        nombre: nombre,
        precio: precio,
        // Agrega más campos según sea necesario
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Adicional Producto Registrado con exito", "save");
    getadicional();
    setShowModal2(false);
  };

  const registraringrediente = () => {
    const nombrei = document.getElementById("nombrei_nuevo").value;

    setingredientes([...ingredientes, nombrei]);
    setShowModal(false);
  };

  const modificarproducto = async () => {
    try {
      var nombre = document.getElementById("name_edit").value;
      var precio = document.getElementById("precio_edit").value;

      const docRef = doc(db, "productos", idproducto); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        nombre: nombre,
        precio: precio,
        ingredientes: ingredientes,
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Producto Actualizado con exito", "save");
    getproductos();
    setOption(1);
  };

  const modificaradicional = async () => {
    try {
      var nombre = document.getElementById("namea_edit").value;
      var precio = document.getElementById("precioa_edit").value;

      const docRef = doc(db, "adicional", idadicional); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        nombre: nombre,
        precio: precio,
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Producto Actualizado con exito", "save");
    getadicional();
    setShowModal3(false);
  };

  const eliminaringrediente = async (id) => {
    setingredientes(ingredientes.filter((carro, index) => index !== id));
  };

  useEffect(() => {
    getproductos();
    getadicional();
  }, []);

  return (
    <>
      {option === 1 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-center rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgcliente}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Productos&nbsp;&nbsp;&nbsp;
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
                      <th scope="col" class="px-6 py-3 text-center">
                        Precio
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
                            setOption(2);
                            setingredientes([]);
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
                    {productos.map((val, key) => {
                      return (
                        <tr key={val.id} class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val.nombre}
                          </th>
                          <td class="px-6 py-4 text-center">{val.precio}</td>
                          <td className="px-6 py-6 flex flex-row place-content-center">
                            <Tooltip
                              title="Editar este Registro"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-blue-500 cursor-pointer"
                              onClick={() => {
                                editarproducto(val.id);
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
                                eliminarproducto(val.id);
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
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-center rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgadicional}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Adicional&nbsp;&nbsp;&nbsp;
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
                      <th scope="col" class="px-6 py-3 text-center">
                        Precio
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
                            setShowModal2(true);
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
                    {adicional.map((val, key) => {
                      return (
                        <tr key={val.id} class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val.nombre}
                          </th>
                          <td class="px-6 py-4 text-center">{val.precio}</td>
                          <td className="px-6 py-6 flex flex-row place-content-center">
                            <Tooltip
                              title="Editar este Registro"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-blue-500 cursor-pointer"
                              onClick={() => {
                                editaradicional(val.id);
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
                                eliminaradicional(val.id);
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
        </div>
      ) : (
        <></>
      )}
      {option === 2 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgcliente}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Nuevo producto
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                <div>
                  <label
                    for="dni_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                  />
                </div>
                <div>
                  <label
                    for="precio_nuevo"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio_nuevo"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Example: 19.99"
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
                src={imgingre}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Registro de Ingredientes&nbsp;&nbsp;&nbsp;
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

                      <th
                        scope="col"
                        class="px-6 py-3 flex place-content-center"
                      >
                        <svg
                          onClick={() => {
                            setShowModal(true);
                            setRegistro(1);
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
                  <tbody>
                    {ingredientes.map((val, key) => {
                      return (
                        <tr class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val}
                          </th>

                          <td className="px-6 py-3 flex flex-row place-content-center items-center">
                            <Tooltip
                              title="Eliminar"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                eliminaringrediente(key);
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
            <div className="flex place-content-end mr-[-10px] mt-4">
              <button
                type="button"
                onClick={() => {
                  nuevoproducto();
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
      {option === 3 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgcliente}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Editar Producto
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
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
                    placeholder=""
                    defaultValue={obtenerproducto(idproducto, "nombre")}
                    disabled="true"
                    required
                  />
                </div>
                <div>
                  <label
                    for="precio_edit"
                    class="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    id="precio_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Example: 19.99"
                    defaultValue={obtenerproducto(idproducto, "precio")}
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
                src={imgingre}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Registro de Ingredientes&nbsp;&nbsp;&nbsp;
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

                      <th
                        scope="col"
                        class="px-6 py-3 flex place-content-center"
                      >
                        <svg
                          onClick={() => {
                            setShowModal(true);
                            setRegistro(1);
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
                  <tbody>
                    {ingredientes.map((val, key) => {
                      return (
                        <tr class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-6 py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val}
                          </th>

                          <td className="px-6 py-3 flex flex-row place-content-center items-center">
                            <Tooltip
                              title="Eliminar"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                eliminaringrediente(key);
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
            <div className="flex place-content-end mr-[-10px] mt-4">
              <button
                type="button"
                onClick={() => {
                  modificarproducto();
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
                  <span className="mt-2 pl-2">Registrar Ingrediente</span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div class="p-4">
                      <div>
                        <label
                          for="nombrei_nuevo"
                          class="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="nombrei_nuevo"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder=""
                          required
                        />
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
                    onClick={() => {
                      registraringrediente();
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
                  <span className="mt-2 pl-2 ml-2 mr-2">
                    Registrar Producto Adicional
                  </span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div class="p-4">
                      <div>
                        <label
                          for="namea_nuevo"
                          class="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="namea_nuevo"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder=""
                          required
                        />
                      </div>
                      <div>
                        <label
                          for="precioa_nuevo"
                          class="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Precio
                        </label>
                        <input
                          type="number"
                          id="precioa_nuevo"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder=""
                          required
                        />
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
                    onClick={() => {
                      nuevoadicional();
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
                    &nbsp;GUARDAR
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      {showModal3 ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-lg">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-white">
                {/*body*/}
                <div className="h-12 bg-black rounded-t-lg place-content-center flex flex-grow text-[#1ab6f3] text-xl font-semibold">
                  <span className="mt-2 pl-2 ml-2 mr-2">
                    Editar Producto Adicional
                  </span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div class="p-4">
                      <div>
                        <label
                          for="namea_edit"
                          class="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="namea_edit"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder=""
                          defaultValue={obteneradicional(idadicional, "nombre")}
                          required
                        />
                      </div>
                      <div>
                        <label
                          for="precioa_edit"
                          class="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Precio
                        </label>
                        <input
                          type="number"
                          id="precioa_edit"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder=""
                          defaultValue={obteneradicional(idadicional, "precio")}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-14 bg-black rounded-b-lg place-content-end flex flex-grow text-cyan-300 text-2xl font-semibold font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal3(false);
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
                    onClick={() => {
                      modificaradicional();
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

export default Content;

import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase/db";
import { collection } from "@firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "@firebase/firestore";
import { matchScreen } from "antd/es/_util/responsiveObserver";
var produc2 = [];
var totalgeneral = 0;
const Vendido = ({ fecha, reporte }) => {
  const query = collection(db, `${reporte}/${fecha}/pedidos`);

  const [docs, loading, error] = useCollectionData(query);
  const [comentario, setComentario] = useState("");
  const [total, setTotal] = useState(0);
  const [pedido, setPedido] = useState("");
  const [fechad, setFechad] = useState("");
  const [productos, setProductos] = useState([]);
  const [quitar, setQuitar] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const obtenerproductos = async () => {
    const protemploCollection = collection(
      db,
      `ventas/${fechad}/pedidos/P${pedido}/productos`
    );
    const data = await getDocs(protemploCollection);

    setProductos(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        sinque: [],
      }))
    );
  };

  const obtenerquitar = async (id) => {
    const protemploCollection = collection(
      db,
      `ventas/${fechad}/pedidos/P${pedido}/productos/${id}/quitar`
    );
    const data = await getDocs(protemploCollection);

    var nuevovalor = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (nuevovalor.length != 0) {
      produc2.push({ id: id, quitar: nuevovalor });
      setQuitar(produc2);
    }
  };

  const mostrarpedido = (id, fechan, docs) => {
    obtenerpedido();
  };

  const obtenerpedido = (orden, tipo) => {
    for (let i = 0; i < docs.length; i++) {
      if (tipo === "cliente") {
        if (docs[i].orden === orden) {
          return docs[i].cliente;
        }
      }
      if (tipo === "delivery") {
        if (docs[i].orden === orden) {
          return docs[i].delivery;
        }
      }
      if (tipo === "direccion") {
        if (docs[i].orden === orden) {
          return docs[i].direccion;
        }
      }
      if (tipo === "envio") {
        if (docs[i].orden === orden) {
          return docs[i].envio;
        }
      }
      if (tipo === "total") {
        if (docs[i].orden === orden) {
          return docs[i].total;
        }
      }
      if (tipo === "totalbs") {
        if (docs[i].orden === orden) {
          return docs[i].totalbs;
        }
      }
      if (tipo === "estatus") {
        if (docs[i].orden === orden) {
          return docs[i].estatus;
        }
      }
    }
  };

  const obtenerloquitado = (id) => {
    var cantidad = 0;

    for (let i = 0; i < quitar.length; i++) {
      if (quitar[i].id === id) {
        return (
          <div className="italic m-2 pl-1 pr-1 pt-1 flex flex-col text-[10px] bg-slate-300 rounded-md">
            <span className="font-semibold">Sin que contenga:</span>
            {quitar[i].quitar.map((val, key) => {
              return (
                <span className="m-0">
                  ({val.cantidad}){" "}
                  {val.ingredientes.map((val2, key2) => {
                    return <>{val2}, </>;
                  })}
                </span>
              );
            })}
          </div>
        );
      }
    }
  };

  useEffect(() => {
    if (pedido != "") {
      obtenerproductos();
    }

    setQuitar([]);
  }, [pedido]);

  useEffect(() => {
    produc2 = [];
    for (let i = 0; i < productos.length; i++) {
      obtenerquitar(productos[i].id);
    }
  }, [productos]);

  if (loading) {
    return <div className="text-center italic font-bold mb-4">Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!docs) {
    return <div>No data found</div>;
  }

  const calculartotal = () => {
    if (reporte == "ventas") {
      totalgeneral = 0;
      docs.map((val, key) => {
        if (val.estatus === "facturado") {
          totalgeneral = parseFloat(totalgeneral) + parseFloat(val.total);
        }
      });
      return totalgeneral.toFixed(2);
    }
  };

  const calculartotalbs = () => {
    if (reporte == "ventas") {
      totalgeneral = 0;
      docs.map((val, key) => {
        if (val.estatus === "facturado") {
          totalgeneral = parseFloat(totalgeneral) + parseFloat(val.totalbs);
        }
      });
      return totalgeneral.toFixed(2);
    }
  };

  const facturarpedido = async () => {
    const docRef2 = doc(db, `ventas/${fechad}/pedidos`, "P" + pedido);
    await updateDoc(docRef2, {
      estatus: "facturado",
    });
  };

  if (reporte == "ventas") {
    return (
      <>
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" class="px-6 py-3 text-center bg-gray-50 ">
                # Orden
              </th>

              <th scope="col" class="px-6 py-3 text-center">
                Cliente
              </th>
              <th scope="col" class="px-6 py-3 text-center">
                Total ($)
              </th>
              <th scope="col" class="px-6 py-3 text-center">
                Total (Bs)
              </th>
            </tr>
          </thead>
          <tbody>
            {docs.map((val, key) => {
              return (
                <tr key={key} class="border-b border-gray-200 ">
                  <th
                    scope="row"
                    class="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                  >
                    {val.estatus == "pendiente" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPedido(val.orden);
                          setFechad(fecha);
                          mostrarpedido(val.orden, fecha, docs);
                          setShowModal(true);
                        }}
                        class="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-xl text-sm px-3 py-1 text-center me-2 mb-2"
                      >
                        {val.orden}
                      </button>
                    ) : (
                      <></>
                    )}
                    {val.estatus == "facturado" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPedido(val.orden);
                          setFechad(fecha);
                          mostrarpedido(val.orden, fecha, docs);
                          setShowModal(true);
                        }}
                        class="text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-xl text-sm px-3 py-1 text-center me-2 mb-2"
                      >
                        {val.orden}
                      </button>
                    ) : (
                      <></>
                    )}
                    {val.estatus == "anulado" ? (
                      <button
                        type="button"
                        class="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-3 py-1 text-center me-2 mb-2"
                      >
                        {val.orden}
                      </button>
                    ) : (
                      <></>
                    )}
                  </th>
                  <td class="px-6 py-4 text-center flex flex-col">
                    <strong>{val.cliente}</strong>
                    <span>{val.envio}</span>
                  </td>
                  {val.estatus == "facturado" ? (
                    <td class="px-6 py-4 text-center font-bold text-green-600">
                      {val.total}
                    </td>
                  ) : (
                    <td class="px-6 py-4 text-center">{val.total}</td>
                  )}

                  {val.estatus == "facturado" ? (
                    <td class="px-6 py-4 text-center font-bold text-green-600">
                      {val.totalbs}
                    </td>
                  ) : (
                    <td class="px-6 py-4 text-center">{val.totalbs}</td>
                  )}
                </tr>
              );
            })}
            <tr class="border-b border-gray-200 ">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
              ></th>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4 text-center text-green-600 font-bold">
                <span className=" bg-black rounded-md p-1 text-green-300 font-bold">
                  {calculartotal()}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-green-600 font-bold">
                <span className=" bg-black rounded-md p-1 text-green-300 font-bold">
                  {calculartotalbs()}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-lg">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-white">
                  {/*body*/}
                  <div className="h-12 bg-black rounded-t-lg place-content-center flex flex-grow text-[#1ab6f3] text-xl font-semibold">
                    <span className="mt-2 ml-2 mr-2 pl-2">
                      Pedido #{pedido}
                    </span>
                  </div>
                  <div className="relative p-1 flex-auto">
                    <div className="p-1 md:p-1">
                      <div>
                        <div className="m-2">
                          <div className="flex flex-col text-sm">
                            <span>
                              <strong>Fecha:</strong> {fechad}
                            </span>
                            <span>
                              <strong>Cliente:</strong>{" "}
                              {obtenerpedido(pedido, "cliente")}
                            </span>
                            <span>
                              <strong>Datos de Envio:</strong>{" "}
                              {obtenerpedido(pedido, "envio")}
                            </span>
                            <span>
                              <strong>Total a Pagar:</strong>{" "}
                              {obtenerpedido(pedido, "total")} ($) -{" "}
                              {obtenerpedido(pedido, "totalbs")} (Bs)
                            </span>
                          </div>
                          <div className="flex flex-row place-content-end text-sm">
                            <span className="mr-2 mt-1 text-gray-600 font-semibold">
                              Estatus
                            </span>
                            {obtenerpedido(pedido, "estatus") == "facturado" ? (
                              <span className="bg-green-600 font-bold p-1 rounded-md">
                                Facturado
                              </span>
                            ) : (
                              <span className="bg-yellow-400 font-bold p-1 rounded-md">
                                Pendiente
                              </span>
                            )}
                          </div>
                          <table className="bg-gray-300 rounded-sm mt-2">
                            <tr className="p-2 text-sm font-bold text-blue-950">
                              <td className="p-2">Cant</td>
                              <td className="p-2">Producto</td>
                              <td className="p-2">Precio ($)</td>
                              <td className="p-2">Total ($)</td>
                            </tr>
                            {productos.map((val2, key2) => {
                              return (
                                <tr className="bg-teal-600 text-sm">
                                  <td className="text-center  font-bold">
                                    {val2.cantidad}
                                  </td>
                                  <td className="p-2">
                                    <span className="font-bold text-sm">
                                      {val2.nombre}
                                    </span>
                                    {obtenerloquitado(val2.id)}
                                  </td>
                                  <td className="text-center font-bold">
                                    {val2.precio}
                                  </td>
                                  <td className="text-center font-bold">
                                    {val2.total}
                                  </td>
                                </tr>
                              );
                            })}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-12 bg-black rounded-b-lg place-content-end flex flex-grow text-cyan-300 text-2xl font-semibold font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                      }}
                      data-modal-hide="popup-modal"
                      class="m-2 text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center me-2 mb-2"
                    >
                      <svg
                        class="w-6 h-6 text-black"
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
                      data-modal-hide="popup-modal"
                      class="mt-2 text-white bg-[#234c8d] hover:bg-[#3167bd]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center me-2 mb-2"
                    >
                      <svg
                        class="w-6 h-6 text-white"
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
                          d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z"
                        />
                      </svg>
                      Comanda
                    </button>
                    {obtenerpedido(pedido, "estatus") == "facturado" ? (
                      <></>
                    ) : (
                      <button
                        type="button"
                        data-modal-hide="popup-modal"
                        onClick={() => {
                          facturarpedido();
                        }}
                        class="mt-2 text-white bg-[#1a8942] hover:bg-[#1fa851]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center me-2 mb-2"
                      >
                        <svg
                          class="w-6 h-6 text-white"
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
                        Facturar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  }
};

export default Vendido;

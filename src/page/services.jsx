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
    const protemploCollection = collection(db, "dolar");
    const data = await getDocs(protemploCollection);

    setsuscripciones(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const obtenersuscripcion = (id, campo) => {
    for (let i = 0; i < suscripciones.length; i++) {
      if (suscripciones[i].id == id) {
        if (campo == "precio") {
          return suscripciones[i].precio;
        }
      }
    }
  };

  const actualizarprecio = async () => {
    try {
      var precio = document.getElementById("preciodolar").value;

      const docRef = doc(db, "dolar", idsuscripcion); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        precio: precio,
        // Agrega más campos según sea necesario
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Precio del Dolar Actualizado", "save");
  };

  useEffect(() => {
    getsuscripciones();
  }, []);

  useEffect(() => {
    if (suscripciones.length > 0) {
      setIdsuscripcion(suscripciones[0].id);
    }
  }, [suscripciones]);

  return (
    <>
      {option == 1 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          {registro == 1 ? (
            <div className="m-2">
              <div className="flex shadow-2xl border-2 place-content-center rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
                <img
                  className="relative h-40 w-full rounded-t-md"
                  src={imgsuscripcion}
                  alt=""
                />
                <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                  Precio del Dolar
                </span>
              </div>
              <div className=" bg-white rounded-b-md">
                <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                  <div>
                    <label
                      for="suscripcion_nuevo"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Precio (BS):
                    </label>
                    <input
                      type="number"
                      id="preciodolar"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder=""
                      defaultValue={obtenersuscripcion(idsuscripcion, "precio")}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex place-content-end">
                <button
                  type="button"
                  onClick={() => {
                    actualizarprecio();
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
                  &nbsp;ACTUALIZAR PRECIO
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
      <ToastContainer theme="dark" />
    </>
  );
};

export default Services;

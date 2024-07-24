import React, { useState, useEffect } from "react";
import imgcliente from "../img/auto-clientes.jpg";
import imgqr from "../img/generatorqr.jpg";
import imgcar1 from "../img/car1.jpg";
import imgregcar from "../img/registercar.jpg";
import sincar from "../img/sincar.png";
import { Tooltip } from "antd";
import { Scanner } from "@yudiel/react-qr-scanner";
import { uploadFile } from "../firebase/db";
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
const Content = () => {
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
  const [showModal3, setShowModal3] = useState(false);
  const [codeqr, setCodeqr] = useState(false);
  const [valorqr, setValorqr] = useState("codigoqr");
  const [rutacarro, setRutacarro] = useState("");
  const [file, setFile] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [editcarro, setEditCarro] = useState([]);
  const [registro, setRegistro] = useState(1);
  const [idcliente, setIdcliente] = useState("");
  const [suscripciones, setsuscripciones] = useState([]);
  const [fechainicio, setFechainicio] = useState("");
  const [fechafinal, setFechafinal] = useState("");
  const [precioapagar, setPrecioapagar] = useState(0);

  const getsuscripciones = async () => {
    const protemploCollection = collection(db, "suscripciones");
    const data = await getDocs(protemploCollection);
    console.log(data.docs);
    setsuscripciones(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

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

  const getclientes = async () => {
    const protemploCollection = collection(db, "clientes");
    const data = await getDocs(protemploCollection);
    console.log(data.docs);
    setClientes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const subirarchivo = async (e) => {
    if (file) {
      try {
        const valornuevo = valorqr + carros.length;
        const result = await uploadFile(file, valornuevo);
        console.log(result);
        setRutacarro(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editarcliente = (id) => {
    todoslosc = [];
    const collectionRef = collection(db, `clientes/${id}/carros`);
    getDocs(collectionRef).then((querySnapshot) => {
      const arraydoc = [];
      querySnapshot.forEach((doc) => {
        arraydoc.push({ ...doc.data(), id: doc.id });
        console.log(arraydoc);
      });

      todoslosc = arraydoc;
      setCarros(todoslosc);
      setIdcliente(id);
      setOption(3);
    });
  };

  const editarsuscripcion = (id) => {
    setIdcliente(id);
    setShowModal3(true);
  };

  const obtenercliente = (id, campo) => {
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].id == id) {
        if (campo == "dni") {
          return clientes[i].dni;
        }
        if (campo == "nombre") {
          return clientes[i].nombre;
        }
        if (campo == "apellido") {
          return clientes[i].apellido;
        }
        if (campo == "telefono") {
          return clientes[i].phone;
        }
        if (campo == "email") {
          return clientes[i].email;
        }
        if (campo == "suscripcion") {
          return clientes[i].suscripcion;
        }

        if (campo == "tipo") {
          console.log(clientes[i].tipo);
          return clientes[i].tipo;
        }
        if (campo == "precio") {
          return clientes[i].precio;
        }
        if (campo == "fechainicio") {
          return clientes[i].fechainicio;
        }
        if (campo == "fechafinal") {
          return clientes[i].fechafinal;
        }
      }
    }
  };

  const obtenervigencia = (id) => {
    var fechai = obtenercliente(idcliente, "fechainicio");
    var fechaf = obtenercliente(idcliente, "fechafinal");

    const fechaActual = new Date();
    const fechaSumada = new Date(fechaf);
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

  const obtenersuscripcion = (id, campo) => {
    for (let i = 0; i < suscripciones.length; i++) {
      if (suscripciones[i].id == id) {
        if (campo == "nombre") {
          return suscripciones[i].nombre;
        }
        if (campo == "preciom") {
          return suscripciones[i].preciom;
        }
        if (campo == "precios") {
          return suscripciones[i].precios;
        }
      }
    }
  };

  const eliminarcliente = (id) => {
    Swal.fire({
      title: "Desea Eliminar este registro?",
      text: "Al Eliminar, se eliminan las suscripciones disponibles.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deletecliente(id);
        Swal.fire({
          title: "Eliminado!",
          text: "Este registro se elimino con exito",
          icon: "success",
        });
      }
    });
  };

  const deletecliente = async (id) => {
    try {
      const documentRef = doc(db, "clientes", id); // Reemplazar con la ruta del documento
      await deleteDoc(documentRef);
      console.log("Documento eliminado con éxito!");
      getclientes();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  const nuevocliente = async () => {
    try {
      var nombre = document.getElementById("name_nuevo").value;
      var apellido = document.getElementById("lastname_nuevo").value;
      var email = document.getElementById("email_nuevo").value;
      var telefono = document.getElementById("phone_nuevo").value;
      var dni = document.getElementById("dni_nuevo").value;

      const docRef = doc(db, "clientes", dni); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        nombre: nombre,
        apellido: apellido,
        email: email,
        phone: telefono,
        dni: dni,
        suscripcion: "",
        tipo: "",
        precio: 0,
        fechainicio: "NO DEFINIDO",
        fechafinal: "NO DEFINIDO",

        // Agrega más campos según sea necesario
      });

      agregarcarros(dni);
      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Cliente Registrado con exito", "save");
    getclientes();
    setOption(1);
  };

  const suscribirse = async () => {
    try {
      var nombre = document.getElementById("nombresuscripcion").value;
      var tipo = document.getElementById("tiposuscripcion").value;

      const docRef = doc(db, "clientes", idcliente); // Reemplazar con el ID del documento
      await updateDoc(docRef, {
        suscripcion: nombre,
        tipo: tipo,
        precio: precioapagar,
        fechainicio: fechainicio,
        fechafinal: fechafinal,
      });

      var fecha = obtenerfecha();

      const docRef1 = doc(db, "ventas", fecha); // Reemplazar con el ID del documento
      await setDoc(docRef1, {
        //Agrega más campos según sea necesario
      });

      const path = `ventas/${fecha}/vendido`;

      const min = 100000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const docRef2 = doc(db, path, "V" + randomNumber);
      await setDoc(docRef2, {
        dni: idcliente,
        tipodeventa: "Suscripcion",
        tipo: nombre,
        precio: parseFloat(precioapagar),
      });

      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Suscripcion Realizada con Exito", "save");
    setShowModal3(false);
    getclientes();
  };

  const modificarcliente = async () => {
    try {
      var nombre = document.getElementById("name_edit").value;
      var apellido = document.getElementById("lastname_edit").value;
      var email = document.getElementById("email_edit").value;
      var telefono = document.getElementById("phone_edit").value;
      var dni = document.getElementById("dni_edit").value;

      const docRef = doc(db, "clientes", dni); // Reemplazar con el ID del documento
      await setDoc(docRef, {
        nombre: nombre,
        apellido: apellido,
        email: email,
        phone: telefono,
        dni: dni,
        suscripcion: obtenercliente(idcliente, "suscripcion"),
        tipo: obtenercliente(idcliente, "tipo"),
        precio: obtenercliente(idcliente, "precio"),
        fechainicio: obtenercliente(idcliente, "fechainicio"),
        fechafinal: obtenercliente(idcliente, "fechafinal"),

        // Agrega más campos según sea necesario
      });

      agregarcarros(dni);
      console.log("Documento agregado con éxito!");
    } catch (error) {
      console.error("Error al agregar el documento:", error);
    }

    msjsave("Cliente Registrado con exito", "save");
    getclientes();
    setOption(1);
  };

  const agregarcarros = async (dni) => {
    const clienteRef = doc(db, "clientes", dni); // Reemplazar con el ID del documento
    const carrosRef = collection(clienteRef, "carros"); // Referencia a la subcolección "carros"

    for (let i = 0; i < carros.length; i++) {
      const carroRef = doc(carrosRef, carros[i].id);
      const carroData = {
        marca: carros[i].marca,
        modelo: carros[i].modelo,
        color: carros[i].color,
        placa: carros[i].placa,
        rutacarro: carros[i].rutacarro,
      };
      try {
        await setDoc(carroRef, carroData);
        console.log("Carro agregado con éxito!");
      } catch (error) {
        console.error("Error al agregar el carro:", error);
      }
    }
  };

  //REGISTRO DE CARROS
  const registrarcarro = (carro) => {
    if (registro == 1) {
      const marca = document.getElementById("marca_nuevo").value;
      const modelo = document.getElementById("modelo_nuevo").value;
      const color = document.getElementById("color_nuevo").value;
      const placa = document.getElementById("placa_nuevo").value;

      const nuevoCarro = {
        id: valorqr,
        marca: marca,
        modelo: modelo,
        color: color,
        placa: placa,
        rutacarro: rutacarro,
      };

      setRutacarro("");
      setShowModal(false);
      setCarros([...carros, nuevoCarro]);
    }

    if (registro == 2) {
      const carrosEditados = carros.map((carro) => {
        const marcae = document.getElementById("marca_edit").value;
        const modeloe = document.getElementById("modelo_edit").value;
        const colore = document.getElementById("color_edit").value;
        const placae = document.getElementById("placa_edit").value;
        console.log(marcae);
        console.log(modeloe);
        console.log(colore);
        console.log(placae);

        if (carro.id === editcarro.id) {
          const editaCarro = {
            id: editcarro.id,
            marca: marcae,
            modelo: modeloe,
            color: colore,
            placa: placae,
            rutacarro: rutacarro,
          };
          console.log(editaCarro);
          const nuevosCarros = carros.map((carro) => {
            if (carro.id === editcarro.id) {
              return editaCarro;
            }
            return carro;
          });
          setCarros(nuevosCarros);
          msjsave("Datos Modificados con exito", "info");
          setShowModal2(false);
        }
      });
    }
  };

  const editarcarro = (id) => {
    const carro = carros[id];

    setEditCarro(carro);
    console.log(carro);
    setRutacarro(carro.rutacarro);

    setShowModal2(true);
    setRegistro(2);
  };

  const eliminarcarronuevo = async (id) => {
    setCarros(carros.filter((carro, index) => index !== id));
  };

  const eliminarcarro = async (id, dni, idcarro) => {
    setCarros(carros.filter((carro, index) => index !== idcarro));
    console.log(dni);
    console.log(id);
    const clienteRef = doc(db, "clientes", dni); // Reemplazar con el ID del documento
    const carrosRef = collection(clienteRef, "carros"); // Referencia a la subcolección "carros"
    const carroRef = doc(carrosRef, id); // Reemplazar con el ID del documento a eliminar

    await deleteDoc(carroRef);
  };

  //ACTUALIZAR FECHAS Y PRECIO DE SUSCRIPCION
  const actualizarfechas = () => {
    const nombre = document.getElementById("nombresuscripcion").value;
    const tipo = document.getElementById("tiposuscripcion").value;

    //TOMAR HORA ACTUAL
    const fechaActual = new Date();
    const fechaSumada = new Date(fechaActual.getTime());

    const fechafinicio = fechaActual.toLocaleDateString("en-US");

    var dia;
    if (
      parseInt(fechaActual.getDate()) > 0 &&
      parseInt(fechaActual.getDate()) < 10
    ) {
      dia = "0" + fechaActual.getDate();
    } else {
      dia = fechaActual.getDate();
    }
    //TOMA LA FECHA EN FORMATO YYYY-MM-DD
    var mes;
    if (fechaActual.getMonth() + 1 > 9) {
      var date4 =
        fechaActual.getFullYear() +
        "-" +
        (fechaActual.getMonth() + 1) +
        "-" +
        dia;
    } else {
      mes = "0" + (fechaActual.getMonth() + 1);
      var date4 = fechaActual.getFullYear() + "-" + mes + "-" + dia;
    }

    if (tipo == "Mensual") {
      setPrecioapagar(obtenersuscripcion(nombre, "preciom"));

      fechaSumada.setDate(fechaActual.getDate() + 30);
      const fechaFormateada = fechaSumada.toLocaleDateString("en-US");

      if (
        parseInt(fechaSumada.getDate()) > 0 &&
        parseInt(fechaSumada.getDate()) < 10
      ) {
        dia = "0" + fechaSumada.getDate();
      } else {
        dia = fechaSumada.getDate();
      }
      //TOMA LA FECHA EN FORMATO YYYY-MM-DD

      if (fechaSumada.getMonth() + 1 > 9) {
        var date4 =
          fechaSumada.getFullYear() +
          "-" +
          (fechaSumada.getMonth() + 1) +
          "-" +
          dia;
      } else {
        mes = "0" + (fechaSumada.getMonth() + 1);
        var date5 = fechaSumada.getFullYear() + "-" + mes + "-" + dia;
      }
      setFechafinal(date5);

      setFechainicio(date4);
    }
    if (tipo == "Semestral") {
      setPrecioapagar(obtenersuscripcion(nombre, "precios"));

      fechaSumada.setDate(fechaActual.getDate() + 180);

      if (
        parseInt(fechaSumada.getDate()) > 0 &&
        parseInt(fechaSumada.getDate()) < 10
      ) {
        dia = "0" + fechaSumada.getDate();
      } else {
        dia = fechaSumada.getDate();
      }
      //TOMA LA FECHA EN FORMATO YYYY-MM-DD

      if (fechaSumada.getMonth() + 1 > 9) {
        var date4 =
          fechaSumada.getFullYear() +
          "-" +
          (fechaSumada.getMonth() + 1) +
          "-" +
          dia;
      } else {
        mes = "0" + (fechaSumada.getMonth() + 1);
        var date5 = fechaSumada.getFullYear() + "-" + mes + "-" + dia;
      }
      setFechafinal(date5);

      setFechainicio(date4);
    }
  };

  const generarqr = () => {
    var cantidad = document.getElementById("cantidad").value;
    window.open("/#/codigosqr/" + cantidad, "_blank");
  };

  useEffect(() => {
    console.log(editcarro);
  }, [editcarro]);

  useEffect(() => {
    subirarchivo();
  }, [file]);

  useEffect(() => {
    console.log(rutacarro);
  }, [rutacarro]);

  useEffect(() => {
    getclientes();
    getsuscripciones();
  }, []);

  useEffect(() => {
    console.log(carros);
  }, [carros]);

  useEffect(() => {
    console.log(clientes);
  }, [clientes]);

  useEffect(() => {
    if (showModal3 == true) {
      actualizarfechas();
    }
  }, [showModal3]);

  return (
    <>
      {option == 1 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgcliente}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Clientes&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead class="text-xs text-gray-700 uppercase ">
                    <tr>
                      <th scope="col" class="px-6 py-3 bg-gray-50 ">
                        DNI
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Phone
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Email
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
                            setCarros([]);
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
                    {clientes.map((val, key) => {
                      return (
                        <tr key={val.id} class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val.dni}
                          </th>
                          <td class="px-6 py-4">{val.nombre}</td>
                          <td class="px-6 py-4">{val.phone}</td>
                          <td class="px-6 py-4">{val.email}</td>
                          <td className="px-6 py-6 flex flex-row">
                            <Tooltip
                              title="Ver Suscripcion"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-blue-500 cursor-pointer"
                              onClick={() => {
                                editarsuscripcion(val.id);
                              }}
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
                                  d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </Tooltip>
                            <span>&nbsp;&nbsp;&nbsp;</span>
                            <Tooltip
                              title="Editar este Registro"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-blue-500 cursor-pointer"
                              onClick={() => {
                                editarcliente(val.id);
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
                                eliminarcliente(val.id);
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
                src={imgqr}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Generador de QR&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div className="p-4 grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-blue-950"
                  >
                    Cantidad:
                  </label>
                  <select
                    id="cantidad"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option value="10" selected>
                      10
                    </option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div className="mt-[28px]">
                  <button
                    type="button"
                    onClick={() => {
                      generarqr();
                    }}
                    class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
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
                    &nbsp;Generar QR's
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  <tbody>
                    {carros.map((val, key) => {
                      return (
                        <tr class="border-b border-gray-200 ">
                          <td className="p-2 bg-gray-50">
                            <img
                              src={val.rutacarro}
                              className="w-36 h-26 rounded-md border-2 "
                              alt=""
                            />
                          </td>
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val.placa}
                          </th>
                          <td class="px-6 py-4">{val.marca}</td>
                          <td class="px-6 py-4">{val.color}</td>
                          <td className="px-6 py-12 flex flex-row place-content-center items-center">
                            <svg
                              class="w-6 h-6 text-gray-800 hover:text-blue-600 cursor-pointer"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              onClick={() => {
                                editarcarro(key);
                              }}
                            >
                              <path
                                fill-rule="evenodd"
                                d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span>&nbsp;&nbsp;&nbsp;</span>
                            <Tooltip
                              title="Eliminar"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                eliminarcarronuevo(key);
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
                  nuevocliente();
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
                    DNI
                  </label>
                  <input
                    type="text"
                    id="dni_edit"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    defaultValue={obtenercliente(idcliente, "dni")}
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
                    defaultValue={obtenercliente(idcliente, "nombre")}
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
                    defaultValue={obtenercliente(idcliente, "apellido")}
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
                    defaultValue={obtenercliente(idcliente, "telefono")}
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
                    defaultValue={obtenercliente(idcliente, "email")}
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
                  <tbody>
                    {carros.map((val, key) => {
                      return (
                        <tr class="border-b border-gray-200 ">
                          <td className="p-2 bg-gray-50">
                            {val.rutacarro == "" ? (
                              <img
                                src={sincar}
                                className="w-36 h-26 rounded-md border-2 "
                                alt=""
                              />
                            ) : (
                              <img
                                src={val.rutacarro}
                                className="w-36 h-26 rounded-md border-2 "
                                alt=""
                              />
                            )}
                          </td>
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            {val.placa}
                          </th>
                          <td class="px-6 py-4">{val.marca}</td>
                          <td class="px-6 py-4">{val.color}</td>
                          <td className="px-6 py-12 flex flex-row place-content-center items-center">
                            <svg
                              class="w-6 h-6 text-gray-800 hover:text-blue-600 cursor-pointer"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              onClick={() => {
                                editarcarro(key);
                              }}
                            >
                              <path
                                fill-rule="evenodd"
                                d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
                                clip-rule="evenodd"
                              />
                            </svg>

                            <span>&nbsp;&nbsp;&nbsp;</span>
                            <Tooltip
                              title="Eliminar"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                eliminarcarro(val.id, idcliente, key);
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
                  modificarcliente();
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
                  <span className="mt-2 pl-2">Registrar Vehiculo</span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    {codeqr == true ? (
                      <div>
                        <div className="p-2 md:p-2">
                          <div className="p-2">
                            {rutacarro == "" ? (
                              <img
                                src={sincar}
                                width="160px"
                                className="rounded-lg bg-slate-400 border-2 border-gray-800"
                                alt=""
                              />
                            ) : (
                              <img
                                src={rutacarro}
                                width="160px"
                                className="rounded-lg bg-slate-400 border-2 border-gray-800"
                                alt=""
                              />
                            )}

                            <label
                              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              for="file_input"
                            >
                              Subir Foto (Opcional)
                            </label>
                            <input
                              onChange={(e) => {
                                const filer = e.target.files[0];
                                setFile(filer);
                                console.log(filer);
                              }}
                              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
                              id="file_input"
                              type="file"
                            ></input>
                          </div>
                          <div>SU CODIGO QR: {valorqr}</div>
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
                    ) : (
                      <div>
                        <Scanner
                          onScan={(result) => {
                            setValorqr(result[0].rawValue);
                            setCodeqr(true);
                          }}
                        />
                      </div>
                    )}
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
                  {codeqr == true ? (
                    <button
                      type="button"
                      onClick={() => {
                        registrarcarro();
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
                  ) : (
                    <div></div>
                  )}
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
                          {rutacarro == "" ? (
                            <img
                              src={sincar}
                              width="160px"
                              className="rounded-lg bg-slate-400 border-2 border-gray-800"
                              alt=""
                            />
                          ) : (
                            <img
                              src={rutacarro}
                              width="160px"
                              className="rounded-lg bg-slate-400 border-2 border-gray-800"
                              alt=""
                            />
                          )}

                          <label
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            for="file_input"
                          >
                            Subir Foto (Opcional)
                          </label>
                          <input
                            onChange={(e) => {
                              const filer = e.target.files[0];
                              setFile(filer);
                              console.log(filer);
                            }}
                            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
                            id="file_input2"
                            type="file"
                          ></input>
                        </div>
                        <div>SU CODIGO QR: {editcarro.id}</div>
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
                              defaultValue={editcarro.placa}
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
                              defaultValue={editcarro.marca}
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
                              defaultValue={editcarro.modelo}
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
                              defaultValue={editcarro.color}
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
                    onClick={() => {
                      registrarcarro();
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
                  <span className="mt-2 pl-2">Suscripcion</span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div>
                      <div className="p-2 md:p-2">
                        {obtenercliente(idcliente, "suscripcion") == "" ? (
                          <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                            <div>
                              <label
                                for="nombresuscripcion"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Nombre de Suscripcion
                              </label>
                              <select
                                id="nombresuscripcion"
                                onChange={() => {
                                  actualizarfechas();
                                }}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                              >
                                {suscripciones.map((val, key) => {
                                  return (
                                    <option value={val.id}>{val.id}</option>
                                  );
                                })}
                              </select>
                            </div>
                            <div>
                              <label
                                for="tiposuscripcion"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Tipo
                              </label>
                              <select
                                id="tiposuscripcion"
                                onChange={() => {
                                  actualizarfechas();
                                }}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                              >
                                <option value="Mensual" selected>
                                  Mensual
                                </option>
                                <option value="Semestral">Semestral</option>
                              </select>
                            </div>
                            <div>
                              <label
                                for="fechainicio"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Fecha de Inicio
                              </label>
                              <span className=" text-blue-950 font-bold">
                                {fechainicio}
                              </span>
                            </div>
                            <div>
                              <label
                                for="fechafinal"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Fecha de Expiracion
                              </label>
                              <span className=" text-blue-950 font-bold">
                                {fechafinal}
                              </span>
                            </div>
                            <div>
                              <label
                                for="precio"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Precio
                              </label>
                              <span className=" text-red-500 font-bold">
                                {precioapagar} USD
                              </span>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {obtenercliente(idcliente, "suscripcion") != "" ? (
                          <div class="grid gap-6 mb-6 md:grid-cols-2 p-2">
                            <div>
                              <label
                                for="nombresuscripcion"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Nombre de Suscripcion
                              </label>
                              {obtenervigencia(idcliente) == false ? (
                                <select
                                  id="nombresuscripcion"
                                  onChange={() => {
                                    actualizarfechas();
                                  }}
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                >
                                  {suscripciones.map((val, key) => {
                                    return (
                                      <>
                                        {obtenercliente(
                                          idcliente,
                                          "suscripcion"
                                        ) == val.id ? (
                                          <option value={val.id} selected>
                                            {val.id}
                                          </option>
                                        ) : (
                                          <option value={val.id}>
                                            {val.id}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </select>
                              ) : (
                                <select
                                  id="nombresuscripcion"
                                  disabled="true"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                >
                                  {suscripciones.map((val, key) => {
                                    return (
                                      <>
                                        {obtenercliente(
                                          idcliente,
                                          "suscripcion"
                                        ) == val.id ? (
                                          <option value={val.id} selected>
                                            {val.id}
                                          </option>
                                        ) : (
                                          <option value={val.id}>
                                            {val.id}
                                          </option>
                                        )}
                                      </>
                                    );
                                  })}
                                </select>
                              )}
                            </div>

                            <div>
                              <label
                                for="tiposuscripcion"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Tipo
                              </label>
                              {obtenervigencia(idcliente) == false ? (
                                <select
                                  id="tiposuscripcion"
                                  onChange={() => {
                                    actualizarfechas();
                                  }}
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                >
                                  {obtenercliente(idcliente, "tipo") ==
                                  "Mensual" ? (
                                    <option value="Mensual" selected>
                                      Mensual
                                    </option>
                                  ) : (
                                    <option value="Mensual">Mensual</option>
                                  )}

                                  {obtenercliente(idcliente, "tipo") ==
                                  "Semestral" ? (
                                    <option value="Semestral" selected>
                                      Semestral
                                    </option>
                                  ) : (
                                    <option value="Semestral">Semestral</option>
                                  )}
                                </select>
                              ) : (
                                <select
                                  id="tiposuscripcion"
                                  disabled="true"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                >
                                  {obtenercliente(idcliente, "tipo") ==
                                  "Mensual" ? (
                                    <option value="Mensual" selected>
                                      Mensual
                                    </option>
                                  ) : (
                                    <option value="Mensual">Mensual</option>
                                  )}

                                  {obtenercliente(idcliente, "tipo") ==
                                  "Semestral" ? (
                                    <option value="Semestral" selected>
                                      Semestral
                                    </option>
                                  ) : (
                                    <option value="Semestral">Semestral</option>
                                  )}
                                </select>
                              )}
                            </div>
                            <div>
                              <label
                                for="fechainicio"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Fecha de Inicio
                              </label>
                              {obtenervigencia(idcliente) == true ? (
                                <span className=" text-blue-950 font-bold">
                                  {obtenercliente(idcliente, "fechainicio")}
                                </span>
                              ) : (
                                <span className=" text-blue-950 font-bold">
                                  {fechainicio}
                                </span>
                              )}
                            </div>
                            <div>
                              <label
                                for="fechafinal"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Fecha de Expiracion
                              </label>
                              {obtenervigencia(idcliente) == true ? (
                                <span className=" text-blue-950 font-bold">
                                  {obtenercliente(idcliente, "fechafinal")}
                                </span>
                              ) : (
                                <span className=" text-blue-950 font-bold">
                                  {fechafinal}
                                </span>
                              )}
                            </div>
                            {obtenervigencia(idcliente) == true ? (
                              <div>
                                <span className=" text-white bg-green-500 font-bold">
                                  SUSCRIPCION ACTIVA
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className=" text-white bg-red-500 font-bold">
                                  SUSCRIPCION VENCIDA
                                </span>
                                <span className=" italic font-semibold">
                                  Fecha que Expiro:
                                </span>
                                <span className="text-red-500 font-bold">
                                  {obtenercliente(idcliente, "fechafinal")}
                                </span>
                              </div>
                            )}
                            <div>
                              <label
                                for="precio"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Precio
                              </label>
                              {obtenervigencia(idcliente) == true ? (
                                <span className=" text-red-500 font-bold">
                                  {obtenercliente(idcliente, "precio")} USD{" "}
                                </span>
                              ) : (
                                <span className=" text-red-500 font-bold">
                                  {precioapagar} USD{" "}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
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

                  {obtenervigencia(idcliente) == false &&
                  obtenercliente(idcliente, "suscripcion") != "" ? (
                    <button
                      type="button"
                      onClick={() => {
                        suscribirse();
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
                      &nbsp;RENOVAR
                    </button>
                  ) : (
                    <></>
                  )}

                  {obtenervigencia(idcliente) == false &&
                  obtenercliente(idcliente, "suscripcion") == "" ? (
                    <button
                      type="button"
                      onClick={() => {
                        suscribirse();
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
                      &nbsp;SUSCRIBIRSE
                    </button>
                  ) : (
                    <></>
                  )}
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

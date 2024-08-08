import React, { useState, useEffect } from "react";
import imgcliente from "../img/auto-clientes.jpg";
import imgqr from "../img/generatorqr.jpg";
import imgdelivery from "../img/delivery.jpg";
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
import { Select } from "antd";
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
  const [adicional, setAdicional] = useState([]);
  const [productos, setproductos] = useState([]);
  const [suscripciones, setsuscripciones] = useState([]);
  const [idsuscripcion, setIdsuscripcion] = useState("");
  const [ventas, setVentas] = useState([]);
  const [carros, setCarros] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [escaneo2, setEscaneo2] = useState([]);
  const [pedidos, setpedidos] = useState([]);
  const [registro, setRegistro] = useState(1);
  const [pedido, setPedido] = useState(0);
  const [totalgeneral, setTotalgeneral] = useState(0);
  const [valorfecha, setValorfecha] = useState(obtenerfecha());
  const [reporte, setReporte] = useState("ventas");
  const [envio, setEnvio] = useState("Retiro");
  const [direccion, setDireccion] = useState("");
  const [cliente, setCliente] = useState("");
  const [costo, setCosto] = useState(0);

  const [nombreproducto, setNombreproducto] = useState("");
  const [idproduct, setIdproduct] = useState("");
  const [quitar, setQuitar] = useState([]);
  const [ingredientes, setingredientes] = useState([]);
  const [productospedido, setproductospedido] = useState([]);

  const [menosingredientes, setMenosingredientes] = useState([]);

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
    if (dateString === "") {
    } else {
      setValorfecha(dateString);
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

    if (opcion1 == true) {
      setReporte("ventas");
    }

    if (opcion2 == true) {
      setReporte("visitas");
    }
  };

  const actualizarenvio = () => {
    var opcion1 = document.getElementById("option-retiro").checked;
    var opcion2 = document.getElementById("option-delivery").checked;

    if (opcion1 == true) {
      setEnvio("Retiro");
      document.getElementById("formu-delivery").className = "p-2 hidden";
    }

    if (opcion2 == true) {
      setEnvio("Delivery");
      document.getElementById("formu-delivery").className = "p-2";
    }
  };

  //PREPARAR PRESUPUESTO

  const getproductos = async () => {
    const protemploCollection = collection(db, "productos");
    const data = await getDocs(protemploCollection);

    setproductos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getadicional = async () => {
    const protemploCollection = collection(db, "adicional");
    const data = await getDocs(protemploCollection);

    setAdicional(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
        if (campo === "ingredientes") {
          return productos[i].ingredientes;
        }
      }
    }
    return null;
  };

  const obtenercarrito = (id, campo) => {
    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].id === id) {
        if (campo === "sinque") {
          return carrito[i].sinque;
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
    return null;
  };

  const eliminarcarrito = (indice) => {
    setCarrito(carrito.filter((producto, index) => index !== indice));
  };

  const agregaralcarrito = () => {
    var idproducto = document.getElementById("productos").value;

    if (obtenerproducto(idproducto, "nombre") != null) {
      var producto = obtenerproducto(idproducto, "nombre");
      var precio = obtenerproducto(idproducto, "precio");
      var tipo = "productos";
    } else {
      var producto = obteneradicional(idproducto, "nombre");
      var precio = obteneradicional(idproducto, "precio");
      var tipo = "adicional";
    }

    var cantidad = document.getElementById("cantidad").value;

    var total = parseInt(cantidad) * parseFloat(precio);

    var sin = [];

    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].id === idproducto) {
        msjsave("Ya existe este Producto en su lista", "error");
        return null;
      }
    }

    msjsave("Agregado a la Lista", "save");
    setCarrito([
      ...carrito,
      {
        id: idproducto,
        nombre: producto,
        precio: precio,
        cantidad: cantidad,
        tipo: tipo,
        total: total,
        sinque: sin,
      },
    ]);
  };

  const poneryquitar = (valor, indice) => {
    setQuitar([...quitar, valor]);
    setingredientes(ingredientes.filter((valor, index) => index !== indice));
  };

  const quitaryponer = (valor, indice) => {
    setingredientes([...ingredientes, valor]);
    setQuitar(quitar.filter((valor, index) => index !== indice));
  };

  const actualizarsinque = () => {
    setCarrito(
      carrito.map((item) => {
        if (item.id === idproduct) {
          return { ...item, sinque: menosingredientes };
        }
        return item;
      })
    );

    setMenosingredientes([]);
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

  const getproductospedido = async (fecha) => {
    const protemploCollection = collection(
      db,
      `ventas/${fecha}/pedidos/P${pedido}/productos`
    );
    const data = await getDocs(protemploCollection);

    setproductospedido(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getingredientes = async (produc) => {
    var fecha = obtenerfecha();

    const protemploCollection = collection(
      db,
      `ventas/${fecha}/pedidos/P${pedido}/productos/${produc}/quitar`
    );
    const data = await getDocs(protemploCollection);

    var array = data.docs.map((doc) => doc.id);

    for (let i = 0; i < array.length; i++) {
      try {
        const documentRef2 = doc(
          db,
          `ventas/${fecha}/pedidos/P${pedido}/productos/${produc}/quitar`,
          array[i]
        );
        await deleteDoc(documentRef2);
        console.log("Documento eliminado con éxito!");
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
      }
    }
  };

  const obtenernumeropedido = async () => {
    var fecha = obtenerfecha();
    const protemploCollection = collection(db, `ventas/${fecha}/pedidos`);
    const data = await getDocs(protemploCollection);

    setpedidos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteproductospedido = async (fecha) => {
    for (let i = 0; i < productospedido.length; i++) {
      getingredientes(productospedido[i].id);
      try {
        const documentRef = doc(
          db,
          `ventas/${fecha}/pedidos/P${pedido}/productos`,
          productospedido[i].id
        );
        await deleteDoc(documentRef);
        console.log("Documento eliminado con éxito!");
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
      }
    }
  };

  const enviaryfacturar = async () => {
    var fecha = obtenerfecha();
    var text =
      "%F0%9F%8F%A0%20%2ALa%20Casa%20del%20Ahumado%2A%20%F0%9F%94%A5%0A%2APedido%3A%2A%23000" +
      pedido +
      "%0A%2AFecha%3A%2A%20" +
      fecha +
      "%0A----------------------------------------------%0A%2A_Productos--_%3E%2A%0A";
    var productostext = "";
    var adicionaltext = "";
    var sinque = "";
    var totaldolares = 0;
    var totalbolivares = 0;

    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].tipo === "productos") {
        productostext =
          productostext +
          "%28" +
          carrito[i].cantidad +
          "%29%20" +
          carrito[i].nombre +
          "%20-%3E%20" +
          carrito[i].total +
          "%24%0A";
        totaldolares = parseFloat(totaldolares) + parseFloat(carrito[i].total);
        if (carrito[i].sinque.length === 0) {
        } else {
          let contenido = "";

          for (let e = 0; e < carrito[i].sinque.length; e++) {
            contenido =
              contenido + "%28" + carrito[i].sinque[e].cantidad + "%29%20";

            for (let a = 0; a < carrito[i].sinque[e].ingredientes.length; a++) {
              if (a > 0) {
                contenido =
                  contenido + "%2C%20" + carrito[i].sinque[e].ingredientes[a];
              } else {
                if (a === carrito[i].sinque[e].ingredientes.length - 1) {
                  contenido =
                    contenido + carrito[i].sinque[e].ingredientes[a] + ".";
                } else {
                  contenido =
                    contenido + "-" + carrito[i].sinque[e].ingredientes[a];
                }
              }
            }
          }
          sinque = "-%20_Sin%3A%20" + contenido + "_%0A";
          productostext = productostext + sinque;
        }
      } else {
        adicionaltext =
          adicionaltext +
          "%28" +
          carrito[i].cantidad +
          "%29%20" +
          carrito[i].nombre +
          "%20-%3E%20" +
          carrito[i].total +
          "%24%0A";
        totaldolares = parseFloat(totaldolares) + parseFloat(carrito[i].total);
      }
    }

    if (envio === "Delivery") {
      adicionaltext = adicionaltext + "Delivery%20--%3E%20" + costo + "%24%0A";
      totaldolares = parseFloat(totaldolares) + parseFloat(costo);
    }

    var bolivar = parseFloat(obtenersuscripcion(idsuscripcion, "precio"));

    totalbolivares = parseFloat(totaldolares) * parseFloat(bolivar);

    totalbolivares = totalbolivares.toFixed(2);
    totaldolares = totaldolares.toFixed(2);

    // var adicional =
    //   "%282%29%20Pizzas%20-%3E%2016%24%0A%0A%2AAdicional--%3E%2A%0A%281%29%20CocaCola%20-%3E%201.5%24%0A----------------------------------------------%0A%2ATotal%20a%20Pagar%20---%3E%2015.50%24%2A%0A%2ATotal%20al%20Cambio%20--%3E%20620Bs%2A%0A%0A%2AEnvi%C3%B3%20o%20Retiro%20--%3E%2A%0A----------------------------------------------%0A%2ADelivery%2A%0A%2ADireccion%3A%2A%20Campo%20el%20Milagro%20Calle%204%20casa%2046.%0A%0A%2AGracias%20por%20preferirnos...%F0%9F%98%89%2A";
    var totales =
      "----------------------------------------------%0A%2A_Total%20a%20Pagar_%20---%3E%20" +
      totaldolares +
      "%24%2A%0A%2A_Total%20al%20Cambio_%20--%3E%20" +
      totalbolivares +
      "Bs%2A%0A%0A%2AEnvi%C3%B3%20o%20Retiro%20--%3E%2A%0A----------------------------------------------%0A%2A";

    var clientetext =
      "%F0%9F%99%8E%F0%9F%8F%BB%E2%80%8D%E2%99%82%EF%B8%8F%20%2ACliente:%2A%20" +
      cliente +
      "%0A";
    var delivery = "";
    if (envio === "Retiro") {
      delivery =
        "Retiro%20en%20Local%2A%0A" +
        clientetext +
        "%2A_Gracias%20por%20preferirnos..._%F0%9F%98%89%2A";
    } else {
      delivery =
        "%F0%9F%9B%B5%20Delivery%2A%0A" +
        clientetext +
        "%2A%F0%9F%93%8C%20Direccion%3A%2A%20" +
        direccion +
        "%0A%0A%2A_Gracias%20por%20preferirnos..._%F0%9F%98%89%2A";
    }

    text = text + productostext + adicionaltext + totales + delivery;
    text = text.replace(/\s+/g, "%20");

    //GUARDAR
    const docRef = doc(db, "ventas", fecha); // Reemplazar con el ID del documento
    await setDoc(docRef, {
      nombre: "",
    });

    if (envio === "Retiro") {
      const docRef2 = doc(db, `ventas/${fecha}/pedidos`, "P" + pedido); // Reemplazar con el ID del documento
      await setDoc(docRef2, {
        envio: envio,
        orden: pedido,
        total: totaldolares,
        totalbs: totalbolivares,
        direccion: "S/D",
        cliente: cliente,
        delivery: 0,
        estatus: "pendiente",
      });
    } else {
      const docRef2 = doc(db, `ventas/${fecha}/pedidos`, "P" + pedido); // Reemplazar con el ID del documento
      await setDoc(docRef2, {
        envio: envio,
        orden: pedido,
        total: totaldolares,
        totalbs: totalbolivares,
        direccion: direccion,
        cliente: cliente,
        delivery: costo,
        estatus: "pendiente",
      });
    }

    deleteproductospedido(fecha);

    for (let i = 0; i < carrito.length; i++) {
      const docRef2 = doc(
        db,
        `ventas/${fecha}/pedidos/P${pedido}/productos`,
        "P" + i
      ); // Reemplazar con el ID del documento
      await setDoc(docRef2, {
        nombre: carrito[i].nombre,
        precio: carrito[i].precio,
        cantidad: carrito[i].cantidad,
        total: carrito[i].total,
        // Agrega más campos según sea necesario
      });

      for (let a = 0; a < carrito[i].sinque.length; a++) {
        const docRef3 = doc(
          db,
          `ventas/${fecha}/pedidos/P${pedido}/productos/P${i}/quitar`,
          "I" + a
        );

        await setDoc(docRef3, {
          cantidad: carrito[i].sinque[a].cantidad,
          ingredientes: carrito[i].sinque[a].ingredientes,
        });
      }
    }

    getproductospedido(fecha);

    window.location = "https://wa.me/?text=" + text;
  };

  const imprimircomanda = () => {
    msjsave("Esperando impresora para hacer pruebas", "warning");
  };

  const agregarquitado = () => {
    var cantidad = document.getElementById("canti").value;
    var quitado = quitar;

    if (quitado.length === 0) {
      msjsave("No hay Ingredientes seleccionados", "warning");
    } else {
      setMenosingredientes([
        ...menosingredientes,
        {
          cantidad: cantidad,
          ingredientes: quitado,
        },
      ]);

      setQuitar([]);
      setingredientes(obtenerproducto(idproduct, "ingredientes"));
    }
  };

  const eliminarmenostabla = (index) => {
    const nuevosMenosingredientes = [...menosingredientes];
    nuevosMenosingredientes.splice(index, 1);
    setMenosingredientes(nuevosMenosingredientes);
  };

  useEffect(() => {
    getproductos();
    getadicional();
    getsuscripciones();
    obtenernumeropedido();
  }, []);

  useEffect(() => {
    setPedido(pedidos.length + 1);
  }, [pedidos]);

  useEffect(() => {
    var fecha = obtenerfecha();
    getproductospedido(fecha);
  }, [pedido]);

  useEffect(() => {
    if (suscripciones.length > 0) {
      setIdsuscripcion(suscripciones[0].id);
    }
  }, [suscripciones]);

  useEffect(() => {
    var totalg = 0;
    for (let i = 0; i < carrito.length; i++) {
      totalg = parseFloat(totalg) + carrito[i].total;
    }
    setTotalgeneral(totalg);
  }, [carrito]);

  return (
    <>
      {option == 1 ? (
        <div className=" bg-gradient-to-tr from-[#828991] to-slate-800 grid max-md:grid-cols-1 max-md:gap-1 grid-cols-2 gap-2">
          <div className="m-2">
            <div className="flex shadow-2xl border-2 place-content-end rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
              <img
                className="relative h-40 w-full rounded-t-md"
                src={imgventas}
                alt=""
              />
              <span className="flex font-semibold text-gray-200 shadow-2xl place-content-center rounded-md absolute w-[200px] h-8 bg-gradient-to-tr from-[#0a151a] to-[#828991]">
                Presupuesto&nbsp;&nbsp;&nbsp;
              </span>
            </div>
            <div className=" bg-white rounded-b-md">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex flex-row">
                  <div className="m-2">
                    <label
                      for="productos"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                    >
                      Elija un Producto
                    </label>
                    <select
                      id="productos"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <optgroup label="Productos">
                        {productos.map((val, key) => {
                          return (
                            <option value={val.id}>
                              {val.nombre} ({val.precio}$)
                            </option>
                          );
                        })}
                      </optgroup>
                      <optgroup label="Adicional">
                        {adicional.map((val, key) => {
                          return (
                            <option value={val.id}>
                              {val.nombre} ({val.precio}$)
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                  </div>
                  <div className="m-2">
                    <label
                      for="cantidad"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                    >
                      Cant
                    </label>
                    <select
                      id="cantidad"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option selected value="1">
                        1
                      </option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <div className="flex flex-col place-content-end">
                    <button
                      type="button"
                      onClick={() => {
                        agregaralcarrito();
                      }}
                      class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Agregar
                    </button>
                  </div>
                </div>
                <hr className="mt-2" />
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead class="text-xs text-gray-700 uppercase ">
                    <tr>
                      <th scope="col" class="px-2 py-2 bg-gray-50 ">
                        Nombre
                      </th>
                      <th scope="col" class="px-2 py-2 text-center">
                        Precio ($)
                      </th>
                      <th scope="col" class="px-2 py-2 text-center">
                        Cant
                      </th>
                      <th scope="col" class="px-2 py-2 text-center">
                        Total ($)
                      </th>
                      <th
                        scope="col"
                        class="px-2 py-2 flex place-content-center"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((val, key) => {
                      return (
                        <tr key={val.id} class="border-b border-gray-200 ">
                          <th
                            scope="row"
                            class="px-2 py-2 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                          >
                            <div className="flex flex-row">
                              {" "}
                              {val.nombre} &nbsp;
                              {val.tipo == "adicional" ? (
                                <></>
                              ) : (
                                <Tooltip
                                  title="Quitar Ingredientes"
                                  color="#1ab6f3"
                                  key="#1ab6f3"
                                  className="hover:text-red-500 cursor-pointer"
                                  onClick={() => {
                                    setNombreproducto(
                                      obtenerproducto(val.id, "nombre")
                                    );
                                    setMenosingredientes(
                                      obtenercarrito(val.id, "sinque")
                                    );
                                    setQuitar([]);
                                    setingredientes(
                                      obtenerproducto(val.id, "ingredientes")
                                    );
                                    setIdproduct(val.id);

                                    setShowModal(true);
                                  }}
                                >
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
                                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </Tooltip>
                              )}
                            </div>
                          </th>
                          <td class="px-2 py-2 text-center">{val.precio}</td>
                          <td class="px-2 py-2 text-center">{val.cantidad}</td>
                          <td class="px-2 py-2 text-center">{val.total}</td>

                          <td className="px-2 py-2 flex flex-row place-content-center">
                            <Tooltip
                              title="Eliminar"
                              color="#1ab6f3"
                              key="#1ab6f3"
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                eliminarcarrito(key);
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

                    <tr class="border-b border-gray-200 ">
                      <td
                        colSpan="3"
                        class="px-2 py-2 text-right italic font-bold text-blue-900"
                      >
                        Total a Pagar
                      </td>
                      <td class="px-2 py-2 text-center font-bold">
                        {totalgeneral}
                      </td>

                      <td className="px-2 py-2 flex flex-row place-content-center"></td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-2 flex flex-row place-content-between">
                  <div className="flex flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setCarrito([]);
                        obtenernumeropedido();
                        setDireccion("");
                        setCliente("");
                        setCosto(0);
                      }}
                      class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                          d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="flex flex-col place-content-center">
                      <span className=" text-sm font-bold text-blue-800">
                        Pedido:
                      </span>{" "}
                      <span className="text-center font-bold text-red-700 mt-[-5px]">
                        #{pedido}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (carrito.length == 0) {
                        msjsave(
                          "Debes Seleccionar al menos un Producto",
                          "warning"
                        );
                      } else {
                        setShowModal2(true);
                      }
                    }}
                    class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                        d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Enviar Presupuesto
                  </button>
                </div>
              </div>
            </div>
          </div>
          {registro == 1 ? (
            <div className="m-2">
              <div className="flex shadow-2xl border-2 place-content-start rounded-t-md bg-gradient-to-tr from-[#1ab6f3] to-white">
                <img
                  className="relative h-40 w-full rounded-t-md"
                  src={imgdelivery}
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
                  <span className="mt-2 ml-2 mr-2 pl-2">
                    Quitar Ingredientes
                  </span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div>
                      <div className="m-2">
                        <label
                          for="cantidad"
                          class=" text-center text-xl block mb-2 font-semibold text-gray-900 "
                        >
                          {nombreproducto}
                        </label>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">
                            Ingredientes:
                          </span>
                          {ingredientes.map((val, key) => {
                            return (
                              <>
                                {quitar.includes(val) == true ? (
                                  <></>
                                ) : (
                                  <div className="pt-1">
                                    <span className="flex flex-row text-sm italic text-green-800">
                                      <svg
                                        class="w-[18px] h-[18px] text-gray-800 cursor-pointer"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        onClick={() => {
                                          poneryquitar(val, key);
                                        }}
                                      >
                                        <path
                                          fill-rule="evenodd"
                                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm5.757-1a1 1 0 1 0 0 2h8.486a1 1 0 1 0 0-2H7.757Z"
                                          clip-rule="evenodd"
                                        />
                                      </svg>{" "}
                                      {ingredientes[key]}
                                    </span>
                                  </div>
                                )}
                              </>
                            );
                          })}
                        </div>

                        <div className="flex flex-col">
                          <br></br>
                          <span className="font-bold text-sm">
                            Sin que contenga:
                          </span>
                          {quitar.map((val, key) => {
                            return (
                              <div className="pt-1">
                                <span className="flex flex-row text-sm italic text-red-800">
                                  - {quitar[key]}{" "}
                                  <svg
                                    class="w-[18px] h-[18px] text-gray-800 cursor-pointer"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    onClick={() => {
                                      quitaryponer(val, key);
                                    }}
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <br />
                        <div className="flex flex-row">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">Cant</span>
                            <select
                              id="canti"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option selected value="1">
                                1
                              </option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>
                          </div>
                          <div className="flex flex-col place-content-end ml-2 mt-[18px]">
                            {" "}
                            <button
                              type="button"
                              onClick={() => {
                                agregarquitado();
                              }}
                              class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2"
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
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              Agregar
                            </button>
                          </div>
                        </div>
                        <br />
                        <div>
                          <hr />
                          <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead class="text-xs text-gray-700 uppercase ">
                              <tr>
                                <th
                                  scope="col"
                                  class="px-2 py-2 flex place-content-center"
                                ></th>
                                <th scope="col" class="px-2 py-2 bg-gray-50 ">
                                  Cant
                                </th>
                                <th scope="col" class="px-2 py-2 text-center">
                                  Ingredientes Quitados
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {menosingredientes.map((val, key) => {
                                return (
                                  <tr class="border-b border-gray-200 ">
                                    <td className="px-2 py-2 flex flex-row place-content-center">
                                      <Tooltip
                                        title="Eliminar"
                                        color="#1ab6f3"
                                        key="#1ab6f3"
                                        onClick={() => {
                                          eliminarmenostabla(key);
                                        }}
                                        className="hover:text-red-600 cursor-pointer"
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
                                    <td class="px-2 py-2 text-center">
                                      {val.cantidad}
                                    </td>
                                    <td class="px-2 py-2 text-center">
                                      {val.ingredientes.map((val2, key2) => {
                                        return <div>- {val2}</div>;
                                      })}
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
                </div>
                <div className="h-12 bg-black rounded-b-lg place-content-end flex flex-grow text-cyan-300 text-2xl font-semibold font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      actualizarsinque();
                      setShowModal(false);
                    }}
                    data-modal-hide="popup-modal"
                    class="m-2 text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                  >
                    <svg
                      class="w-[18px] h-[18px] text-gray-800 dark:text-white"
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
                    Actualizar
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
                  <span className="mt-2 ml-2 mr-2 pl-2">
                    Informacion de Envio
                  </span>
                </div>
                <div className="relative p-1 flex-auto">
                  <div className="p-1 md:p-1">
                    <div>
                      <div className="pt-2">
                        &nbsp;&nbsp;&nbsp;
                        {envio == "Retiro" ? (
                          <input
                            id="option-retiro"
                            type="radio"
                            value="retiro"
                            name="list-envio"
                            onChange={() => {
                              actualizarenvio();
                            }}
                            onClick={() => {
                              actualizarenvio();
                            }}
                            checked
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                        ) : (
                          <input
                            id="option-retiro"
                            type="radio"
                            value="retiro"
                            name="list-envio"
                            onChange={() => {
                              actualizarenvio();
                            }}
                            onClick={() => {
                              actualizarenvio();
                            }}
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                        )}
                        <label
                          for="list-envio"
                          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                        >
                          Retiro
                        </label>
                        &nbsp;&nbsp;&nbsp;
                        {envio == "Delivery" ? (
                          <input
                            id="option-delivery"
                            type="radio"
                            value="delivery"
                            onChange={() => {
                              actualizarenvio();
                            }}
                            onClick={() => {
                              actualizarenvio();
                            }}
                            checked
                            name="list-envio"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                        ) : (
                          <input
                            id="option-delivery"
                            type="radio"
                            value="delivery"
                            onChange={() => {
                              actualizarenvio();
                            }}
                            onClick={() => {
                              actualizarenvio();
                            }}
                            name="list-envio"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                        )}
                        <label
                          for="list-envio"
                          class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                        >
                          Delivery
                        </label>
                        <hr className="p-2" />
                        {envio == "Delivery" ? (
                          <div id="formu-delivery" className="p-2">
                            <div className="flex flex-row">
                              <div className="flex flex-col">
                                <label
                                  for="cliente"
                                  class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                  Cliente
                                </label>
                                <input
                                  type="text"
                                  id="cliente"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100%] p-2.5"
                                  placeholder="Example: John"
                                  defaultValue={cliente}
                                  onChange={(e) => setCliente(e.target.value)}
                                  required
                                />
                              </div>

                              <div className="flex flex-col">
                                <label
                                  for="costo"
                                  class="block mb-2 text-sm font-medium ml-2 text-gray-900"
                                >
                                  Costo
                                </label>
                                <input
                                  type="number"
                                  id="costo"
                                  class="bg-gray-50 border ml-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100px] p-2.5"
                                  placeholder=""
                                  defaultValue={costo}
                                  onChange={(e) => setCosto(e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <label
                              for="direccion"
                              class="block mb-2 text-sm font-medium text-gray-900"
                            >
                              Direccion:
                            </label>
                            <textarea
                              id="direccion"
                              rows="4"
                              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder=""
                              onChange={(e) => setDireccion(e.target.value)}
                              defaultValue={direccion}
                            ></textarea>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col">
                              <label
                                for="cliente2"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Cliente
                              </label>
                              <input
                                type="text"
                                id="cliente2"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100%] p-2.5"
                                placeholder="Example: John"
                                defaultValue={cliente}
                                onChange={(e) => setCliente(e.target.value)}
                                required
                              />
                            </div>
                            <div id="formu-delivery" className="p-2 hidden">
                              <label
                                for="direccion"
                                class="block mb-2 text-sm font-medium text-gray-900"
                              >
                                Direccion de Delivery
                              </label>
                              <textarea
                                id="direccion"
                                rows="4"
                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                              ></textarea>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-12 bg-black rounded-b-lg place-content-end flex flex-grow text-white text-2xl font-semibold font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal2(false);
                    }}
                    data-modal-hide="popup-modal"
                    class="m-2 text-white bg-[#948724] hover:bg-[#c6b430]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center me-2 mb-2"
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
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      imprimircomanda();
                    }}
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
                  <button
                    type="button"
                    onClick={() => {
                      enviaryfacturar();
                    }}
                    data-modal-hide="popup-modal"
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
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill="currentColor"
                        d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"
                      />
                    </svg>
                    Enviar
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

import React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase/db";
import { collection } from "@firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

var totalgeneral = 0;
const Vendido = ({ fecha, reporte }) => {
  const query = collection(db, `${reporte}/${fecha}/vendido`);

  const [docs, loading, error] = useCollectionData(query);
  const [comentario, setComentario] = useState("");
  const [total, setTotal] = useState(0);

  console.log(docs);

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
        totalgeneral = parseFloat(totalgeneral) + parseFloat(val.precio);
      });
      return totalgeneral;
    }
  };

  if (reporte == "ventas") {
    return (
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead class="text-xs text-gray-700 uppercase ">
          <tr>
            <th scope="col" class="px-6 py-3 bg-gray-50 ">
              Tipo de Venta
            </th>
            <th scope="col" class="px-6 py-3">
              Servicio
            </th>
            <th scope="col" class="px-6 py-3 text-center">
              Precio
            </th>
          </tr>
        </thead>
        <tbody>
          {docs.map((val, key) => {
            totalgeneral = totalgeneral + parseFloat(val.precio);
            console.log(totalgeneral);
            return (
              <tr key={key} class="border-b border-gray-200 ">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                >
                  {val.tipodeventa}
                </th>
                <td class="px-6 py-4">{val.tipo}</td>
                <td class="px-6 py-4 text-center">{val.precio}</td>
              </tr>
            );
          })}
          <tr class="border-b border-gray-200 ">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
            ></th>
            <td class="px-6 py-4"></td>
            <td class="px-6 py-4 text-center">{calculartotal()}</td>
          </tr>
        </tbody>
      </table>
    );
  } else {
    return (
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead class="text-xs text-gray-700 uppercase ">
          <tr>
            <th scope="col" class="px-6 py-3 bg-gray-50 ">
              DNI
            </th>
            <th scope="col" class="px-6 py-3">
              Nombres
            </th>
            <th scope="col" class="px-6 py-3 text-center">
              Suscripcion
            </th>
          </tr>
        </thead>
        <tbody>
          {docs.map((val, key) => {
            return (
              <tr key={key} class="border-b border-gray-200 ">
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 "
                >
                  {val.dni}
                </th>
                <td class="px-6 py-4">{val.nombre}</td>
                <td class="px-6 py-4 text-center">{val.suscripcion}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
};

export default Vendido;

import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";

const GenerarQR = () => {
  const params = useParams();
  const param1 = params.param1;
  const [totalqr, setTotalqr] = useState([]);
  var array = [];
  const generar = () => {
    const min = 10000;
    const max = 100000;

    console.log(param1);

    for (let i = 1; i <= parseInt(param1); i++) {
      console.log(i);
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      array.push("CABI-" + randomNumber);
    }
    console.log(array);
    setTotalqr(array);
  };

  useEffect(() => {
    generar();
    window.print();
  }, []);

  useEffect(() => {
    console.log(totalqr);
  }, [totalqr]);

  return (
    <>
      <div className="flex flex-wrap place-content-center">
        {totalqr.map((val, index) => {
          return (
            <>
              <div className="flex flex-col place-content-center">
                <QRCode
                  className="m-2 mt-[-30px] w-[130px]"
                  value={totalqr[index]}
                  size={256}
                  level={"H"}
                />
                <span className="mt-[-70px] text-center">{totalqr[index]}</span>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default GenerarQR;

// import React, { useEffect } from "react";
// import { useState } from "react";
// import QRCode from "qrcode";
// import randomString from "randomstring";
// import { toast } from "react-toastify";

// function QrCode({ socket }) {
//   const [qrCode, setQrCode] = useState("");
//   const [randomKey, setRandomKey] = useState("");

//   useEffect(() => {});

//   // socket.on("stringRandom", (data) => {
//   //   console.log(data);
//   // });
//   const GenerateQrCode = () => {
//     const randomKey = randomString.generate(20);
//     QRCode.toDataURL(randomKey, (err, url) => {
//       if (err) return console.log(err);
//       setQrCode(url);
//     });
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//       }}
//     >
//       <h1>QrCode</h1>
//       <button className="generate" onClick={GenerateQrCode}>
//         generate
//       </button>
//       <img className="imgQrCode" src={qrCode} alt="" />
//     </div>
//   );
// }

// export default QrCode;

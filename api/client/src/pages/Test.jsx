// import React from "react";
// import { FaTelegramPlane, FaEnvelope, FaPhone } from "react-icons/fa";

// const Test = () => {

//   const orders = [
//     {
//       customer: 'قمبر گل',
//       weight: 10,
//       height: 25,
//       remainingPrice: 50,
//       totalPrice: 100,
//       date: '2024-12-01',
//     },
//    ]

//   return (
//     <div className="flex px-40 py-0  min-h-screen">
//       {/* left side */}
//       <div className="w-1/4">
//         <img src="../public/bill.jpeg" alt="" />
//       </div>

//       {/* rigth side  */}
//       <div className="w-full">
//         {/* Header */}
//         <div>
//           <div className="text-right flex py-4 pl-40 items-center">
//             <div className="flex items-center">
//               <h1 className="text-6xl font-bold text-green-800 border-r-4 border-green-700 pr-4">
//                 مطبعـه تمدن
//               </h1>
//               <h2 className="text-5xl font-semibold pl-4">
//                 Tamadon <br /> Printing Press
//               </h2>
//             </div>
//           </div>
//         </div>

//         <div className="">
//           <div className="flex justify-evenly">
//             <img
//               src="/Tamadon.png"
//               alt="Tamadon Logo"
//               className="w-16 h-16 object-contain"
//             />

//             <div>
//               <p className="italic text-sm text-gray-500">
//                 تلاقی کیفیت و نوآوری
//               </p>
//               <p className="italic text-sm text-gray-500">
//                 Intorsootin of Quality & innotuonal
//               </p>
//             </div>
//             <div className="">
//               <p className="text-green-700 px-3">
//                 بیش از{" "}
//                 <span className="text-3xl font-bold text-black">20 سال</span>
//                 سابقه کاری
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* contain */}

//         <div className="flex justify-center">
//           <div className="border border-gray-400 min-h-[400px] min-w-[800px] rounded-lg bg-white flex flex-col justify-start items-center overflow-y-auto p-4 shadow-md">
//             <h3 className="text-xl font-bold mb-3 text-gray-800">
//               جزئیات سفارش
//             </h3>
//             {orders.length > 0 ? (
//               orders.map((order, index) => (
//                 <div
//                   key={index}
//                   className="border-b py-3 w-full text-right px-2 last:border-b-0"
//                 >
//                   <p className="font-medium">
//                     مشتری: <span className="font-normal">{order.customer}</span>
//                   </p>
//                   <p>
//                     وزن:{" "}
//                     <span className="font-normal">{order.weight} کیلوگرم</span>
//                   </p>
//                   <p>
//                     ارتفاع:{" "}
//                     <span className="font-normal">{order.height} سانتیمتر</span>
//                   </p>
//                   <p>
//                     قیمت باقی‌مانده:{" "}
//                     <span className="font-normal">${order.remainingPrice}</span>
//                   </p>
//                   <p>
//                     قیمت کل:{" "}
//                     <span className="font-normal">${order.totalPrice}</span>
//                   </p>
//                   <p>
//                     تاریخ: <span className="font-normal">{order.date}</span>
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-400 italic">
//                 هیچ جزئیات سفارشی موجود نیست.
//               </p>
//             )}
//           </div>
//         </div>

//         {/*  */}
//         <div>
//           <footer className="py-4 font-bold flex justify-evenly items-center text-sm text-gray-600">
//             <div className="flex items-center space-x-2">
//               <FaTelegramPlane className="text-gray-700" size={24} />
//               <span>@tamadon_press</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FaEnvelope className="text-gray-700 " size={24} />
//               <span>tamadon.af@gmail.com</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FaPhone className="text-gray-700" size={24} />
//               <span>+93 77 20 29 545</span>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </div>
//   );
// };






// // export default Test;
// // client/src/components/TamadonCard.js
// // client/src/components/TamadonCard.js
// import React from 'react';
// import styled from 'styled-components';

// // Styled Components for the card design
// const CardContainer = styled.div`
//   width: 90%;
//   max-width: 650px; /* Adjusted for closer match */
//   height: 420px; /* Adjusted for closer match */
//   margin: 50px auto;
//   background-color: white;
//   border-radius: 5px;
//   position: relative;
//   overflow: hidden;
//   box-shadow: 0 4px 8px rgba(0,0,0,0.1);
// `;

// const LeftPanel = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 35%;
//   height: 100%;
//   overflow: hidden;
// `;

// const GreenBackground = styled.div`
//   background-color: #1e5d2b; /* Dark green from the image */
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
// `;

// const YellowCurve = styled.div`
//     background-color: #ffd700; /* Yellow from the image */
//     position: absolute;
//     top: 0;
//     bottom: 0;
//     left: 25%;
//     width: 25%;
//     border-radius: 100% 0 0 100%;
//     z-index: 1;
// `;

// const TextContent = styled.div`
//     position: relative;
//     padding: 10px 50px 0 40%;
//     z-index: 2;
//     color: #141414;
// `;

// const ArabicText = styled.h1`
//     font-size: 2.4em; /* Adjust as needed for the Arabic text */
//     font-weight: bold;
//     margin-bottom: 5px;
//     direction: rtl;
//     text-align: right;
//     color: #0d4220;
// `;

// const EnglishText = styled.h2`
//   font-size: 1.3em; /* Adjust as needed */
//   font-weight: bold;
//   margin-bottom: 8px;
//   color: #141414;
// `;

// const SubText = styled.p`
//   font-size: 0.9em; /* Adjust as needed */
//    margin-bottom: 15px;
//   font-style: italic;
//     color: #2b2b2b;
// `;

// const AbstractShape = styled.div`
//     position: absolute;
//     top: 30%;
//     left: 42%;
//     width: 25%;
//     height: 30%;
//     background-color: #f0f0f0;
//     border-radius: 50%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     &::before {
//         content: "";
//         position: absolute;
//         width: 100%;
//         height: 100%;
//         background-color: #f0f0f0;
//         opacity: 0.8;
//         border-radius: 50% 50%;
//         transform: scale(1.6) translate(30%, 0);
//     }
// `;
// const SmallAbstractShape = styled.div`
//     position: absolute;
//     bottom: 25%;
//     left: 55%;
//     width: 10%;
//     height: 15%;
//     border-radius: 50%;
//     background-color: #f0f0f0;
// `;

// const YearsText = styled.div`
//     position: absolute;
//     top: 20%;
//     right: 10%;
//     text-align: center;
//    font-size: 1.2em;
//    color: #1e5d2b;
//    font-weight: bold;
// `;
// const SocialLinks = styled.div`
//     position: absolute;
//      bottom: 15px; /* Adjusted for better positioning */
//      left: 35px; /* Adjusted for better positioning */
//    display: flex;
//    align-items: center;
//    gap: 15px;
// `;

// const SocialLink = styled.a`
//     color: #454545;
//      font-size: 0.8em;
//      display: flex;
//      align-items: center;
//      gap: 5px;
//    text-decoration: none;
//     &:hover {
//       text-decoration: underline;
//     }
// `;

// const Icon = styled.span`
//   font-size: 1.1em;
//     color: #26452b;
// `;

// const Test = () => {
//   return (
//     <CardContainer>
//       <LeftPanel>
//         <GreenBackground />
//         <YellowCurve />
//       </LeftPanel>
//       <TextContent>
//         <ArabicText>مطبعة تمدن</ArabicText>
//         <EnglishText>Tamadon Printing Press</EnglishText>
//         <SubText>
//           تلاقی کیفیت و نوآوری! <br />
//           Intersection of Quality & Innovation!
//         </SubText>
//       </TextContent>
//       <AbstractShape />
//       <SmallAbstractShape />
//       <YearsText>
//         بیش از <br />
//         20 سال
//         <br />
//         سابقه درخشان
//       </YearsText>
//       <SocialLinks>
//         <SocialLink href="https://instagram.com/tamadon_press">
//           <Icon>✔</Icon>
//           @tamadon_press
//         </SocialLink>
//         <SocialLink href="mailto:tamadon.af@gmail.com">
//           <Icon>☑</Icon>
//           tamadon.af@gmail.com
//         </SocialLink>
//         <SocialLink href="tel:+93772029545">
//           <Icon>+</Icon>
//           +93 77 20 29 545
//         </SocialLink>
//       </SocialLinks>
//     </CardContainer>
//   );
// };

// export default Test;


import React from "react";
// import { Phone, Mail, BrandTelegram } from "lucide-react";
import { FaTelegramPlane, FaEnvelope, FaPhone } from "react-icons/fa";

function Test() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="relative w-full min-h-[297mm] bg-white">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#006838] rounded-r-[100px]">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
          </div>
          <div className="absolute left-12 top-0 bottom-0 w-2 bg-[#FFD700]" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Year Badge */}
          <div className="absolute top-4 left-4 text-right">
            <div className="font-arabic text-xl">۲۰ سال</div>
            <div className="text-sm text-gray-600">سابقه درخشان!</div>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <div className="text-[#006838] text-3xl font-bold">
                <span className="font-arabic">مطبعة تمدن</span> | Tamadon
                Printing Press
              </div>
              <img
                src="/Tamadon.png"
                alt="Tamadon Logo"
                className="w-12 h-12"
              />
            </div>

            {/* Slogan */}
            <div className="text-center text-gray-600 italic mt-2">
              <div className="font-arabic text-lg">تلاقی کیفیت و نوآوری!</div>
              <div>Intersection of Quality & Innovation!</div>
            </div>

            {/* Main Content Area */}
            <div className="mt-8 mb-12 min-h-[800px] border border-gray-200 rounded-lg p-4">
              {/* Content goes here */}
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center gap-8 mt-4 text-gray-700">
              <a
                href="https://t.me/tamadon_press"
                className="flex items-center gap-2 hover:text-[#006838]"
              >
                <FaTelegramPlane className="w-5 h-5" />
                @tamadon_press
              </a>
              <a
                href="mailto:tamadon.af@gmail.com"
                className="flex items-center gap-2 hover:text-[#006838]"
              >
                <FaPhone className="w-5 h-5" />
                tamadon.af@gmail.com
              </a>
              <a
                href="tel:+93772029545"
                className="flex items-center gap-2 hover:text-[#006838]"
              >
                <FaEnvelope className="w-5 h-5" />
                +93 77 202 9545
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
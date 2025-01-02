import React from "react";
import { FaTelegramPlane, FaEnvelope, FaPhone } from "react-icons/fa";

const Test = () => {
  const orders = [
    {
      customer: "قمبر گل",
      type: "پوستر",
      weight: 10,
      height: 25,
      remainingPrice: 50,
      totalPrice: 100,
      date: "2024-12-01",
    },
  ];

  return (
    <div className="flex px-40 py-0 min-h-screen">
      {/* left side */}
      <div className="w-1/4">
        <img src="../public/f8f90c77-f44d-43d9-8b38-1411d4762188.jpeg" alt="" />
      </div>

      {/* right side */}
      <div className="w-full">
        {/* Header */}
        <div>
          <div className="text-right flex py-4 pl-40 items-center">
            <div className="flex items-center">
              <h1 className="text-6xl font-bold text-green-800 border-r-4 border-green-700 pr-4">
                مطبعـه تمدن
              </h1>
              <h2 className="text-5xl font-semibold pl-4">
                Tamadon <br /> Printing Press
              </h2>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-evenly">
            <img
              src="/Tamadon.png"
              alt="Tamadon Logo"
              className="w-16 h-16 object-contain"
            />

            <div>
              <p className="italic text-sm text-gray-500">
                تلاقی کیفیت و نوآوری
              </p>
              <p className="italic text-sm text-gray-500">
                Intorsootin of Quality & innotuonal
              </p>
            </div>
            <div>
              <p className="text-green-700 px-3">
                بیش از <br />
                <span className="text-3xl font-bold text-black">20 سال</span>
                <br />
                <p className="px-5">سابقه کاری</p>
              </p>
            </div>
          </div>
        </div>
        {/* contain */}

        <div className="flex justify-center">
          <div className="border border-gray-400 min-h-[400px] min-w-[800px] rounded-lg bg-white flex flex-col justify-start items-center overflow-y-auto p-4 shadow-md">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              جزئیات سفارش
            </h3>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={index}
                  className="border-b py-3 w-full text-right px-2 last:border-b-0"
                >
                  <p className="font-medium">
                    مشتری: <span className="font-normal">{order.customer}</span>
                  </p>
                  <p className="font-medium">
                    نوع سفارش: <span className="font-normal">{order.type}</span>
                  </p>
                  <p>
                    وزن:{" "}
                    <span className="font-normal">{order.weight} کیلوگرم</span>
                  </p>
                  <p>
                    ارتفاع:{" "}
                    <span className="font-normal">{order.height} سانتیمتر</span>
                  </p>
                  <p>
                    قیمت باقی‌مانده:{" "}
                    <span className="font-normal">
                      af{order.remainingPrice}
                    </span>
                  </p>
                  <p>
                    قیمت کل:{" "}
                    <span className="font-normal">af{order.totalPrice}</span>
                  </p>
                  <p>
                    تاریخ: <span className="font-normal">{order.date}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">
                هیچ جزئیات سفارشی موجود نیست.
              </p>
            )}
          </div>
        </div>

        {/*  */}
        <div>
          <footer className="py-4 font-bold flex justify-evenly items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaTelegramPlane className="text-gray-700" size={24} />
              <span>@tamadon_press</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-gray-700" size={24} />
              <span>tamadon.af@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-gray-700" size={24} />
              <span>+93 77 20 29 545</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Test;

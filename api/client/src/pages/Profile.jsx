import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <section dir="rtl" className="w-full overflow-hidden dark:bg-gray-900">
        <div className="flex flex-col">
          {/* Cover Image */}
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080"
            alt="User Cover"
            className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem]"
          />
          {/* Profile Image */}
          <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
            <img
              src={currentUser.profilePicture}
              alt="User Profile"
              className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
            />
            {/* FullName */}
            <h1 className="w-full text-right my-4 sm:mx-4 xs:pr-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
              <Link to="userprofile">
              {currentUser.username || currentUser.companyName}
              </Link>
            </h1>
          </div>

          <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
            {/* Description */}
            <p className="w-fit text-gray-700 dark:text-gray-400 text-md text-right">
              در طراحی کاتالوگ ها معمولا صفحه آغازین کاتالوگ را به معرفی شرکت و
              یا بیان تاریخچه شرکت اختصاص میدهند، تا مخاطب در اولین صفحات بتواند
              دیدگاه روشن و ملموسی نسبت به چهار چوب و قواعد کلی شرکت و همچنین
              فعالیت های آن پیدا کند. اما موضوعی که همواره سفارش دهندگان طراحی
              کاتالوگ را با چالش روبرو میکند این است که چگونه بنویسند و چطور
              شرکت خود را معرفی کنند. بنابراین نیاز دانستیم تا در این باره با
              شما گفتگو کنیم و در ادامه چند نمونه متن معرفی شرکت در کاتالوگ را
              برای درک بهتر قرار دهیم. ایجاد نمونه متن معرفی محصول در فروش محصول
              بسیار مهم و با اهمیت است بنابراین اگر برای نوشتن مشخصات مهم محصول
              در متن معرفی محصول وقت و زمان گذاشته شود این کار قطعا بی نتیجه
              نخواهد بود. توصیه ما به افراد و صاحبین کسب و کار این است که به
              هنگام سفارش کاتالوگ، نمونه متن معرفی شرکت در کاتالوگ ها حتما ذکر
              شود چراکه این بخش در کاتالوگ ها بسیار پر اهمیت است و قسمت مهمی از
              آن را شامل می شود.
            </p>

            {/* Detail */}
            <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
              <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    <div className="flex flex-col pb-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        نام
                      </dt>
                      <dd className="text-lg font-semibold">
                        {currentUser.firstName}
                      </dd>
                    </div>
                    <div className="flex flex-col py-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        نام خانوادگی
                      </dt>
                      <dd className="text-lg font-semibold">
                        {currentUser.lastName}
                      </dd>
                    </div>
                    <div className="flex flex-col py-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        جنسیت
                      </dt>
                      <dd className="text-lg font-semibold">مرد</dd>
                    </div>
                  </dl>
                </div>
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    <div className="flex flex-col pb-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        مکان
                      </dt>
                      <dd className="text-lg font-semibold">
                        {currentUser.location}
                      </dd>
                    </div>

                    <div className="flex flex-col pt-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        شماره تلفن
                      </dt>
                      <dd className="text-lg font-semibold">
                        {currentUser.phoneNumber}
                      </dd>
                    </div>
                    <div className="flex flex-col pt-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        ایمیل
                      </dt>
                      <dd className="text-lg font-semibold">
                        {currentUser.email}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="w-full my-10 md:h-[26rem] xs:w-full xs:h-[10rem]">
                {/* Location */}
                <h1 className="w-fit font-serif my-4 pb-1 pl-2 rounded-b-md border-b-4 border-blue-600 dark:border-b-4 dark:border-yellow-600 dark:text-white lg:text-4xl md:text-3xl xs:text-xl">
                  موقعیت روی نقشه
                </h1>

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02028974562!2d38.613328040215286!3d8.963479542403238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1710567234587!5m2!1sen!2set"
                  className="rounded-lg w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

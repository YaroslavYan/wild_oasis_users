import { Suspense } from "react";
import CabingList from "../_components/CabinsList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/FIlter";
import ReservationReminder from "../_components/ReservationReminder";

//Оновлення кешу сторінки з новими даними якщо вони оновились в безі даних
export const revalidate = 3600;
//revalidate потрібна тільки для статичних сторінок
//З фільрацюєю через searchParams ця сторінка стала динамічною
//revalidate більше не потрібен, дані оновлюються моментально

export const metadata = {
  title: "Cabins",
};

export default function Page({ searchParams }) {
  //searchParams бере параметри з url
  //http://localhost:3000/cabins?capacity=small

  const filter = searchParams?.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      {/* Suspense дасть змогу відобразити весь вище контент без затримки при отриманні даних  */}
      {/* Вище контент буде відображатись зразу без спінера  */}
      {/* Добаляємо key=filter щоб при зміні фільтрації показуввся спінер */}
      <Suspense fallback={<Spinner />} key={filter}>
        <CabingList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}

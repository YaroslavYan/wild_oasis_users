"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  //Це як рецеп якому варто слідувати

  // отримує поточний шлях (URL) сторінки.
  const searchParams = useSearchParams();
  // дозволяє навігацію без повного перезавантаження сторінки.
  const router = useRouter();
  // отримує параметри пошуку з URL (рядок після ?).
  const pathname = usePathname();

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeFilter = searchParams.get("capacity") ?? "all";

  return (
    <div className="border border-primary-800 flex">
      <Button
        filter={"all"}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        filter={"small"}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;3 guest
      </Button>
      <Button
        filter={"medium"}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        4&mdash;7 guest
      </Button>
      <Button
        filter={"large"}
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        7&mdash;12 guest
      </Button>
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;

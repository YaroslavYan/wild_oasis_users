import Link from "next/link";

function NotFound() {
  //Якщо такого посилання не існує
  //Також викликаємо додаткову функцію там де оримуємо дані notFound()

  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">
        This cabin could not be found :(
      </h1>
      <Link
        href="/cabins"
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
      >
        Go to all cabins
      </Link>
    </main>
  );
}

export default NotFound;

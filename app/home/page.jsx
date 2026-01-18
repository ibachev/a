"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <img
          src="https://media1.tenor.com/m/6nP_x3X-xrEAAAAd/angry-topsy-cat.gif"
          alt="fun animation"
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Јас сум Топсии ❤️
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Дали сакате да ви ги покажам моите рецепти? 🍛{" "}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={() => router.push("/favorites")}
            className="px-6 py-3
        rounded-xl
        bg-gradient-to-r from-indigo-500 to-purple-600
        text-white font-semibold
        shadow-lg
        transition-all duration-200
        hover:scale-105 hover:shadow-xl
        active:scale-95"
          >
            Погледни рецепти 🚀
          </button>
        </div>
      </main>
    </div>
  );
}

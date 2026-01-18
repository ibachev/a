import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 md:flex md:gap-8 items-center">
        {/* Лево: Слика */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-white/10 shadow-lg">
            {/* Стави слика во /public/angelina.jpg */}
            <Image
              src="/angelina.jpg"
              alt="Ангелина Милкова"
              fill
              sizes="(max-width: 768px) 144px, 192px"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="mt-4 text-center md:text-left">
            <p className="text-sm text-white/70">Здраво, јас сум</p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              Ангелина Милкова
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Сметководител · Моден Дизајнер · Dog lover 🐶
            </p>
          </div>
        </div>

        {/* Десно: Опис */}
        <div className="mt-6 md:mt-0 flex-1">
          <p className="text-white/85 leading-relaxed">
            Јас сум Ангелина – сметководител со око за детали и моден дизајнер
            со креативна душа. Верувам дека прецизноста и креативноста можат
            совршено да се надополнуваат, без разлика дали станува збор за
            бројки, дизајн или секојдневни предизвици.
          </p>

          <p className="text-white/85 leading-relaxed mt-3">
            Голем љубител сум на кучиња и инспирацијата често ја наоѓам во
            малите нешта, добрата енергија и убавиот стил.
          </p>

          {/* Копчиња */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="/home"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 shadow hover:scale-105 transform transition"
            >
              <span className="font-medium">Погледни повеќе</span>
              <span className="ml-3">✨</span>
            </Link>

            <Link
              href="https://www.facebook.com/angelina.milkova.75"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-white/10 bg-white/3 hover:bg-white/5 transition"
            >
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

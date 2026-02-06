import React, { useEffect, useState } from "react";

const SlidingStatCards = ({ stats, interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!stats || stats.length === 0) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % stats.length),
      interval
    );
    return () => clearInterval(timer);
  }, [stats, interval]);

  return (
    <div className="relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col">
      {/* SLIDER */}
      <div
        className="flex flex-1 transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="min-w-full p-5 flex items-center gap-4 h-full"
          >
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <stat.icon className="w-7 h-7" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-2xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.title}
              </div>
              {stat.sub && (
                <div className="text-xs text-gray-400 mt-1">
                  {stat.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {stats.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition ${
              i === index ? "bg-red-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};


export default SlidingStatCards;

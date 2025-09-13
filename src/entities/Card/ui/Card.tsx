// src/components/Card.tsx
import type { JSX } from "react";
import type { ICard } from "../lib";

interface CardProps {
  card: ICard;
}

export function Card({ card }: CardProps): JSX.Element {
  const lastOp = card.lastOperation;

  return (
    <div
      className="p-4 bg-gray-700 rounded-md border border-gray-600 text-white shadow-sm transition-all duration-200 hover:shadow-md"
      style={{ backgroundColor: `${card.color}20` }} // Полупрозрачный фон по цвету
    >
      {/* Название и баланс */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-white">{card.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
            card.balance >= 0 ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {card.balance >= 0 ? "+" : ""}
          {card.balance.toFixed(2)} ₽
        </span>
      </div>

      {/* Последняя операция */}
      <div className="mt-2 text-sm text-gray-300">
        {lastOp.description ? (
          <p className="mb-1">{lastOp.description}</p>
        ) : (
          <p className="mb-1">
            {lastOp.amount >= 0 ? "+" : ""}
            {lastOp.amount.toFixed(2)} ₽
          </p>
        )}
        <time className="block text-xs opacity-70">
          {new Date(lastOp.date).toLocaleString("ru-RU", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </div>
  );
}

import type { ICard } from "../../сard";

export async function updateCard(
  idCard: number,
  name: string,
  color: string,
  balance: number,
  order: number
): Promise<ICard> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не авторизован. Токен отсутствует.");
  }

  if (!name || name.trim() === "") {
    throw new Error("Название карточки обязательно");
  }
  if (!color || color.trim() === "") {
    throw new Error("Цвет карточки обязателен");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/cards/${idCard}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          color: color.trim(),
          balance: parseFloat(balance.toFixed(0)),
          order: order,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Не удалось обновить карточку");
    }

    const updatedCard: ICard = await response.json();
    return updatedCard;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ошибка сети. Проверьте подключение.");
  }
}

import type { ICard } from "../../сard";

export async function clearCardHistory(idCard: number): Promise<ICard> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Не авторизован. Токен отсутствует.");
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
          operations: [], // 👈 Очищаем всю историю
          lastOperation: {
            amount: 0,
            date: new Date().toISOString(),
            description: "История очищена",
          },
          balance: 0, // 👈 Сбрасываем баланс
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Не удалось очистить историю");
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

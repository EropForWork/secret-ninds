import { useState, type JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message: string;
}

export default function Login(): JSX.Element {
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setMessage("Логин и пароль обязательны");
      return;
    }

    setMessage("🔄 Авторизация...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data: LoginResponse = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Успешно! Перенаправляем...");

        navigate("/cards");
      } else {
        setMessage(`❌ ${data.message || "Неверный логин или пароль"}`);
      }
    } catch (error) {
      setMessage("❌ Не удалось подключиться к серверу. Проверьте интернет.");
      console.error("Ошибка сети:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cards");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Заголовок — как в MUI */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-blue-200">
            🔑 Вход в систему
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Введите свои данные для доступа
          </p>
        </div>

        {/* Сообщения — как в MUI */}
        {message && (
          <p
            className={`text-center text-xs font-medium ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Форма — как в MUI */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Логин */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Логин
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="Введите логин"
            />
          </div>

          {/* Пароль */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              placeholder="Введите пароль"
            />
          </div>

          {/* Кнопка */}
          <div>
            <button
              type="submit"
              className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              Войти
            </button>
          </div>
        </form>

        {/* Тень под формой */}
        <div className="h-1 bg-gray-800"></div>
      </div>
    </div>
  );
}

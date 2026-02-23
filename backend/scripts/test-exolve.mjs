#!/usr/bin/env node
/**
 * Тест Exolve API — проверка ключа вне Strapi.
 * Запуск: node scripts/test-exolve.mjs
 * Требует EXOLVE_API_KEY и EXOLVE_SENDER в backend/.env
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

let apiKey = process.env.EXOLVE_API_KEY;
let sender = process.env.EXOLVE_SENDER;

if (!apiKey || !sender) {
  try {
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^EXOLVE_API_KEY=(.+)$/);
      if (m) apiKey = m[1].trim().replace(/^["']|["']$/g, "");
      const m2 = line.match(/^EXOLVE_SENDER=(.+)$/);
      if (m2) sender = m2[1].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    console.error("Файл .env не найден или недоступен");
  }
}

if (!apiKey || !sender) {
  console.error("Укажите EXOLVE_API_KEY и EXOLVE_SENDER в backend/.env");
  process.exit(1);
}

// Убираем лишние символы, которые могли попасть при копировании
apiKey = apiKey.trim();
sender = sender.trim();

console.log("Тест Exolve SendSMS");
console.log("  sender:", sender);
console.log("  key length:", apiKey.length, "(первые 4 символа:", apiKey.slice(0, 4) + "...)");
console.log("");

const url = "https://api.exolve.ru/messaging/v1/SendSMS";
const body = {
  number: sender,
  destination: "79991234567", // тестовый получатель
  text: "Тестовое SMS от скрипта",
};

const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const data = await res.json().catch(() => ({}));
console.log("HTTP", res.status);
console.log("Response:", JSON.stringify(data, null, 2));

if (res.status === 401) {
  console.log("\n--- Чек-лист ---");
  console.log("1. Ключ из личного кабинета: Приложения → ваше приложение → API-ключи");
  console.log("2. Ключ — именно приложения, к которому привязан номер", sender);
  console.log("3. В .env нет кавычек вокруг значения: EXOLVE_API_KEY=ваш_ключ");
  console.log("4. Нет пробелов/переносов в начале/конце ключа");
  console.log("5. Сгенерируйте новый API-ключ в Exolve и замените в .env");
}

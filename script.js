// --- Завдання 2: обчислення площі кола ---

document.addEventListener("DOMContentLoaded", () => {
  function calcCircleArea(radius) {
    const area = Math.PI * radius * radius;
    const block3 = document.querySelector(".b3");
    if (block3) {
      block3.innerHTML += `<p><b>Площа кола з радіусом ${radius} дорівнює:</b> ${area.toFixed(2)}</p>`;
    }
  }
  calcCircleArea(5);
});


// --- Завдання 3: обробка масиву чисел, cookies і діалогові вікна ---

document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("array-section");
  const input = document.getElementById("numbersInput");
  const btn = document.getElementById("processBtn");
  const result = document.getElementById("result");
  const cookieInfo = document.getElementById("cookieInfo");

  if (!formSection || !btn || !input || !result || !cookieInfo) return;

  // --- Допоміжні функції ---
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
      const [key, val] = c.split("=");
      if (key === name) return decodeURIComponent(val);
    }
    return "";
  }

  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // --- Якщо cookie вже є ---
  const savedMax = getCookie("maxNum");
  const savedCount = getCookie("countMax");

  // якщо є збережені значення
  if (savedMax && savedCount) {
    setTimeout(() => {
      const answer = confirm(
        `Збережені дані: максимальне число ${savedMax}, кількість таких чисел ${savedCount}.\nВидалити cookies?`
      );

      if (answer) {
        deleteCookie("maxNum");
        deleteCookie("countMax");
        alert("Cookies видалені. Сторінка перезавантажиться.");
        location.reload();
      } else {
        alert("Cookies залишені. Щоб побачити форму — перезавантажте сторінку після видалення cookies.");
        formSection.style.display = "none";
      }
    }, 500); // невелика затримка, щоб cookies гарантовано зчитались
    return;
  }

  // --- Якщо cookies немає, показуємо форму ---
  btn.addEventListener("click", () => {
    const inputValue = input.value.trim();
    if (!inputValue) {
      result.textContent = "Введіть 10 чисел";
      return;
    }

    const numbers = inputValue.split(/[\s,]+/).map(Number);

    if (numbers.some(isNaN)) {
      result.textContent = "Некоректні дані. Вводьте лише числа";
      return;
    }

    if (numbers.length !== 10) {
      result.textContent = "Потрібно ввести рівно 10 чисел";
      return;
    }

    const maxNum = Math.max(...numbers);
    const countMax = numbers.filter((n) => n === maxNum).length;

    result.textContent = `Максимальне число: ${maxNum}, кількість таких чисел: ${countMax}`;
    cookieInfo.textContent = "(Збережено у cookies)";

    setCookie("maxNum", maxNum, 7);
    setCookie("countMax", countMax, 7);

    alert(`Результат збережено у cookies: макс ${maxNum}, кількість ${countMax}`);
  });
});


// --- Завдання 4: зміна кольору фону блоку 2 і збереження у localStorage ---

document.addEventListener("DOMContentLoaded", () => {
  const colorInput = document.getElementById("colorPicker");
  const block2 = document.querySelector(".b2");

  if (!colorInput || !block2) return;

  // Якщо у localStorage вже є збережений колір — застосовуємо його
  const savedColor = localStorage.getItem("block2Color");
  if (savedColor) {
    block2.style.backgroundColor = savedColor;
    colorInput.value = savedColor;
  }

  // При втраті фокусу (blur) — зберігаємо вибраний колір
  colorInput.addEventListener("blur", () => {
    const chosenColor = colorInput.value;
    block2.style.backgroundColor = chosenColor;
    localStorage.setItem("block2Color", chosenColor);
  });
});


// --- Завдання 5: редагування вмісту блоків 1..6 ---

document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".block");

  blocks.forEach((block, index) => {
    const editLink = block.querySelector(".edit-link");
    const blockId = `blockContent_${index + 1}`;

    // Якщо у localStorage вже є збережений текст — показуємо його
    const savedHTML = localStorage.getItem(blockId);
    if (savedHTML) {
      block.innerHTML = savedHTML + `<button class="restore-btn">Відновити початковий текст</button>`;
      addRestoreHandler(block, blockId);
    }

    // Якщо є посилання "Редагувати"
    if (editLink) {
      editLink.addEventListener("dblclick", (e) => {
        e.preventDefault();

        // Отримуємо поточний HTML
        const currentHTML = block.innerHTML;
        block.innerHTML = `
          <textarea style="width:100%;height:150px;">${currentHTML}</textarea>
          <button class="save-btn">Зберегти зміни</button>
        `;

        const saveBtn = block.querySelector(".save-btn");
        const textarea = block.querySelector("textarea");

        // Обробник натискання на "Зберегти"
        saveBtn.addEventListener("click", () => {
          const newContent = textarea.value;

          // Зберігаємо у localStorage
          localStorage.setItem(blockId, newContent);

          // Міняємо фон на випадковий колір
          const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
          block.style.backgroundColor = randomColor;

          // Виводимо оновлений контент + кнопку відновлення
          block.innerHTML = newContent + `<button class="restore-btn">Відновити початковий текст</button>`;
          addRestoreHandler(block, blockId);
        });
      });
    }
  });

  // --- Функція для кнопки "Відновити початковий текст" ---
  function addRestoreHandler(block, blockId) {
    const restoreBtn = block.querySelector(".restore-btn");
    if (restoreBtn) {
      restoreBtn.addEventListener("click", () => {
        localStorage.removeItem(blockId);
        location.reload();
      });
    }
  }
});


// --- Завдання 1: обмін верхнього і нижнього блоків ---
// Виконуємо в кінці, після рендеру всіх блоків (щоб не ламало "Редагувати")
setTimeout(() => {
  const x = document.querySelector(".logo-box");
  const y = document.querySelector(".y-box");
  if (!x || !y) return;

  // Функція: дістає з елемента тільки текст (усі текстові вузли, об'єднані)
  function getOnlyText(el) {
    return Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent)
      .join("")
      .trim();
  }

  // Функція: замінити або додати текстовий вузол на початку (без чіпання інших елементів)
  function setOnlyText(el, text) {
    // Видаляємо всі текстові вузли всередині елемента
    Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .forEach(n => n.remove());

    // Створюємо новий текстовий вузол і вставляємо на початок
    const tn = document.createTextNode(text);
    el.insertBefore(tn, el.firstChild || null);
  }

  const textX = getOnlyText(x);
  const textY = getOnlyText(y);

  // міняємо тільки текст (зберігаємо інші внутрішні елементи, наприклад кнопки)
  setOnlyText(x, textY);
  setOnlyText(y, textX);

  // опційно — виставляємо фон (як у тебе було)
  x.style.backgroundColor = "#f3e1fc";
  y.style.backgroundColor = "#f3e1fc";
}, 1000);

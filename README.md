# هل تعرف أحمد؟ 🤔

تطبيق تريفيا تفاعلي بتصميم Dark Mode + Glassmorphism + Neon (بنفسجي وسماوي)، مبني بـ HTML/CSS/JS عادي (vanilla) بدون أي framework، وجاهز للتغليف في تطبيق Desktop باستخدام Electron.

## 📁 هيكل المشروع

```
ahmed-trivia-app/
├── index.html              # الصفحة الرئيسية (3 شاشات: بداية / كويز / نتيجة)
├── css/
│   └── style.css           # كل التصميم: ألوان، خطوط، أنيميشن
├── js/
│   ├── data.js             # الأسئلة + معايير التقييم — عدّل هنا فقط لإضافة أسئلة
│   ├── audio.js            # أصوات الإجابة الصحيحة/الخطأ (مولدة بالكود، بدون ملفات mp3)
│   ├── confetti.js         # تأثير الكونفيتي في شاشة النتيجة
│   └── script.js           # منطق اللعبة (state machine + رندر + events)
├── electron/
│   └── main.js             # نقطة دخول Electron لتشغيل التطبيق كـ Desktop App
└── package.json            # سكريبتات وتبعيات Electron
```

كل قسم منفصل عن التاني عمدًا، علشان تقدر:
- تضيف/تعدّل الأسئلة من `js/data.js` فقط، من غير ما تلمس باقي الكود.
- تستبدل الأصوات المولدة بملفات mp3 حقيقية (الخطوات مكتوبة كـ comment فوق `js/audio.js`).
- تغيّر الألوان كلها من مكان واحد (`:root` في أول `css/style.css`).

---

## ▶️ التشغيل السريع في المتصفح (للتجربة والتطوير)

الملفات بتستخدم ES Modules (`import`/`export`)، فلازم تفتحها من خلال سيرفر محلي صغير، مش بفتح الملف مباشرة (لأن المتصفح بيرفض `import` على بروتوكول `file://`).

أسهل طريقة (لو عندك Node.js مُنصّب):

```bash
cd ahmed-trivia-app
npx serve .
```

هيطلعلك رابط زي `http://localhost:3000` افتحه في المتصفح.

أو لو بتستخدم VS Code، ثبّت إكستنشن **Live Server** واضغط "Go Live" على `index.html`.

---

## 🖥️ تغليف التطبيق كـ Desktop App (Electron)

الخطوات دي بتشغّل التطبيق كنافذة Desktop حقيقية على ويندوز/ماك/لينكس:

```bash
cd ahmed-trivia-app

# 1) تثبيت Electron (مرة واحدة فقط)
npm install

# 2) تشغيل التطبيق كـ Desktop App
npm start
```

هتفتح نافذة بعنوان "هل تعرف أحمد؟" بحجم 480×800 (مناسب لشكل موبايل/تطبيق صغير)، تقدر تغيّر المقاس من `electron/main.js`.

### بناء ملف تنفيذي (exe / dmg / AppImage) لمشاركته مع حد تاني

```bash
npm run dist
```

هيستخدم `electron-builder` (متضاف في `package.json`) عشان يطلعلك ملف تنصيب جاهز في فولدر `dist/`.

---

## ✏️ إزاي تضيف سؤال جديد؟

افتح `js/data.js` وزوّد عنصر جديد في array الأسئلة:

```js
{
  question: "السؤال هنا؟",
  options: ["اختيار 1", "اختيار 2", "اختيار 3", "اختيار 4"],
  answer: "اختيار 2", // لازم يكون نفس النص حرفيًا
}
```

التطبيق هيتعامل معاه تلقائيًا في الـ progress bar والـ scoring، مش محتاج تلمس `script.js` أبدًا.

---

## 🎛️ إزاي تغيّر مدة العداد؟

في `js/data.js`:

```js
export const SECONDS_PER_QUESTION = 10; // غيّرها لأي رقم تاني
```

---

## 🔊 إزاي تستخدم ملفات صوت حقيقية بدل الأصوات المولدة؟

افتح `js/audio.js` — فيه شرح بالتفصيل فوق الكود مباشرة. باختصار: حط ملفاتك في `assets/sounds/` واستبدل دالة `playCorrect`/`playWrong` بـ:

```js
const sfx = new Audio("assets/sounds/correct.mp3");
export function playCorrect() {
  sfx.currentTime = 0;
  sfx.play();
}
```

---

## 🎨 إزاي تغيّر الألوان؟

كل الألوان متعرّفة كـ CSS variables في أول `css/style.css` تحت `:root`. غيّر `--purple` و `--cyan` وهيتغيروا في كل التطبيق تلقائيًا (الأزرار، التايمر، الكروت، الكل).

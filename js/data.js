/**
 * ====================================================================
 * QUESTIONS DATA
 * ====================================================================
 * Add, remove, or edit questions here — script.js never needs to change.
 *
 * Shape of each question object:
 * {
 *   question: string,        // the question text (Arabic)
 *   options:  string[4],     // exactly 4 answer choices
 *   answer:   string         // must match one of the strings in `options` EXACTLY
 * }
 *
 * Tip: keep `answer` as a copy-paste of the correct option string to
 * avoid typos that would make a question unanswerable.
 * ====================================================================
 */

export const questions = [
  {
    question: "ايه الجامعة بتاعتي؟",
    options: ["جامعة القاهرة", "جامعة حورس (العلوم الصحية)", "جامعة المنصورة", "جامعة عين شمس"],
    answer: "جامعة حورس (العلوم الصحية)",
  },
  {
    question: "ايه اسم شركتي ؟",
    options: ["TechHub", "CodeWave", "WebMaster", "DevRoots"],
    answer: "CodeWave",
  },
  {
    question: "ايه اكتر لعبة بلعبها ؟",
    options: ["FIFA 23", "PES 2016 / GTA", "Call of Duty", "Valorant"],
    answer: "PES 2016 / GTA",
  },
  {
    question: "ما هو مجالي الأساسي في البرمجة؟",
    options: ["Full Stack Web Dev", "Game Development", "Cyber Security", "Data Science"],
    answer: "Full Stack Web Dev",
  },
  {
    question: "ما هو لوني المفضل؟",
    options: ["الأسود", "الأزرق", "الأحمر", "الأخضر"],
    answer: "الأسود", // 👈 غيّر الإجابة هنا لو لونك المفضل مختلف
  },
  {
    question: "فين بنزل محتوى الفتره دي؟",
    options: ["يوتيوب", "انستجرام", "تيك توك", "تويتر"],
    answer: "تيك توك",
  },
  {
    question: "ايه هيا الحاجه اللي بفهم فيها كويس اوي جمب البرمجة ؟",
    options: ["الشبكات (Networking)", "تصميم الألعاب", "الهندسة الصوتية", "تحليل البيانات"],
    answer: "الشبكات (Networking)",
  },
  {
    question: "هل ليا في السياسة ؟",
    options: ["مبفهمش اي حاجه ومبحبش اتكلم فيها", "دنا محلل سياسي", "نص نص"],
    answer: "دنا محلل سياسي",
  },
  {
    question: "غير ألعاب الكورة و GTA، إيه اللعبة اللي بلعبها؟",
    options: ["The Witcher 3", "Mount & Blade: Warband", "Red Dead Redemption 2", "Assassin's Creed"],
    answer: "Mount & Blade: Warband",
  },
];

/**
 * ====================================================================
 * EVALUATION TIERS
 * ====================================================================
 * `min`/`max` are inclusive bounds on the final score.
 * Edit text/emoji freely — script.js just picks the first matching tier.
 * ====================================================================
 */
export const evaluationTiers = [
  {
    min: 7,
    max: 9,
    emoji: "🎉",
    message: "إنت صاحب حقيقي 😂",
    confetti: true,
  },
  {
    min: 4,
    max: 6,
    emoji: "😉",
    message: "نص نص.. محتاجين نخرج مع بعض أكتر 😉",
    confetti: false,
  },
  {
    min: 0,
    max: 3,
    emoji: "😅",
    message: "واضح إنك أول مرة تشوفني 😅",
    confetti: false,
  },
];

// How many seconds the player gets per question. Change this one number
// to make the whole game faster/slower.
export const SECONDS_PER_QUESTION = 7;

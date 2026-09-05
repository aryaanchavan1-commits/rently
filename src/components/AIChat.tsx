"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";

interface Message {
  role: "user" | "assistant";
  content: string;
  properties?: SearchResult[];
}

interface SearchResult {
  id: string; title: string; price: number; type: string; area: string; city: string;
  bedrooms: number; bathrooms: number; furnishing: string; images: string[];
  amenities: string[]; isVerified: boolean; maintenance?: number; parking?: number;
}

interface CommuteResult {
  id: string; title: string; price: number; type: string; area: string; city: string;
  bedrooms: number; images: string[];
  commute: { duration: number; distance: number; mode: string; destination: string };
}

interface SearchState {
  step: string;
  city: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  furnishing: string;
  area: string;
  purpose: string;
  commuteDest: string;
  commuteMaxMin: number;
}

const DESTINATIONS: Record<string, string> = {
  "university": "pune university", "college": "pune university",
  "विद्यापीठ": "pune university", "महाविद्यालय": "pune university", "विश्वविद्यालय": "pune university", "कॉलेज": "pune university",
  "office": "hinjewadi", "ऑफिस": "hinjewadi", "कार्यालय": "hinjewadi", "काम": "hinjewadi",
  "metro": "thane station", "मेट्रो": "thane station", "station": "thane station", "स्टेशन": "thane station",
  "hinjewadi": "hinjewadi", "हिंजवडी": "hinjewadi", "baner": "baner", "बानेर": "baner",
  "kothrud": "kothrud", "कोठरुड": "kothrud", "deccan": "deccan", "दक्कन": "deccan",
  "thane": "thane station", "ठाणे": "thane station",
  "powai": "powai", "पोवई": "powai", "andheri": "andheri", "अंधेरी": "andheri",
  "bandra": "bandra", "बांद्रा": "bandra", "vashi": "vashi", "वाशी": "vashi",
  "pune university": "pune university", "पुणे विद्यापीठ": "pune university",
  "savitribai": "pune university", "शिवाजी युनिव्हर्सिटी": "shivaji university",
  "iit": "iit bombay", "आयआयटी": "iit bombay",
  "coep": "coep", "सीओईपी": "coep", "vit": "vit pune", "व्हीआयटी": "vit pune",
  "nagpur": "nagpur", "नागपूर": "nagpur", "nashik": "nashik", "नाशिक": "nashik",
  "kolhapur": "shivaji university", "कोल्हापूर": "shivaji university",
  "aurangabad": "aurangabad", "औरंगाबाद": "aurangabad",
};

function detectIntent(input: string): { intent: string; city?: string; budget?: number; bedrooms?: number; commuteDest?: string; commuteMin?: number; type?: string; area?: string } | null {
  const lower = input.toLowerCase();

  const commuteKeywords = ["commute", "प्रवास", "reach", "पोहोच", "minutes", "मिनिट", "min", "minute", "within", "आत", "मध्ये", "travel", "distance", "दूरी"];
  if (commuteKeywords.some((k) => lower.includes(k))) {
    let dest = "";
    let maxMin = 30;
    for (const [key, val] of Object.entries(DESTINATIONS)) {
      if (lower.includes(key)) { dest = val; break; }
    }
    const minMatch = lower.match(/(\d+)\s*(min|minute|मिनिट|मिनिटे)/);
    if (minMatch) maxMin = parseInt(minMatch[1]);
    if (!dest) {
      const words = lower.split(/\s+/);
      for (const w of words) { if (DESTINATIONS[w]) { dest = DESTINATIONS[w]; break; } }
    }
    return { intent: "commute", commuteDest: dest || "pune university", commuteMin: maxMin };
  }

  let bedrooms = 0;
  const bhkMatch = lower.match(/(\d+)\s*(?:bhk|बीएचकी|बीएचके|bedroom|बेडरूम)/i);
  if (bhkMatch) bedrooms = parseInt(bhkMatch[1]);

  const devanagariMap: Record<string, string> = { "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9" };
  let normalized = lower;
  for (const [d, n] of Object.entries(devanagariMap)) { normalized = normalized.replaceAll(d, n); }
  let budget = 0;
  const budgetPatterns = [
    /(\d[\d,]*)\s*(?:हजार|hazaar|k|च्या\s*आत|मध्ये|under|below|ते|पर्यंत|budget)/i,
    /(?:budget|बजेट|किंमत|price)\s*[:=]?\s*(\d[\d,]*)/i,
    /(\d[\d,]*)\s*(?:rs|₹|inr)/i,
  ];
  for (const p of budgetPatterns) {
    const m = normalized.match(p);
    if (m) {
      let val = parseInt(m[1].replace(/,/g, ""));
      if (lower.includes("हजार") || lower.includes("hazaar")) val *= 1000;
      if (val < 1000 && val > 5) val *= 1000;
      budget = val;
      break;
    }
  }

  let city = "";
  const cityKeywords = ["मुंबई", "बॉम्बे", "mumbai", "पुणे", "pune", "पुण्यात", "पुण्याच्या", "ठाणे", "thane", "नवी मुंबई", "navi mumbai", "नवीमुंबई", "नागपूर", "nagpur", "नाशिक", "nashik", "कोल्हापूर", "kolhapur", "औरंगाबाद", "aurangabad", "सोलापूर", "solapur", "सातारा", "satara", "नांदेड", "nanded", "अमरावती", "amravati", "रत्नागिरी", "ratnagiri"];
  const cityMap: Record<string, string> = {
    "मुंबई": "Mumbai", "बॉम्बे": "Mumbai", "mumbai": "Mumbai",
    "पुणे": "Pune", "pune": "Pune", "पुण्यात": "Pune", "पुण्याच्या": "Pune",
    "ठाणे": "Thane", "thane": "Thane",
    "नवी मुंबई": "Navi Mumbai", "navi mumbai": "Navi Mumbai", "नवीमुंबई": "Navi Mumbai",
    "नागपूर": "Nagpur", "nagpur": "Nagpur",
    "नाशिक": "Nashik", "nashik": "Nashik",
    "कोल्हापूर": "Kolhapur", "kolhapur": "Kolhapur",
    "औरंगाबाद": "Aurangabad", "aurangabad": "Aurangabad",
    "सोलापूर": "Solapur", "solapur": "Solapur",
    "सातारा": "Satara", "satara": "Satara",
    "नांदेड": "Nanded", "nanded": "Nanded",
    "अमरावती": "Amravati", "amravati": "Amravati",
    "रत्नागिरी": "Ratnagiri", "ratnagiri": "Ratnagiri",
  };
  for (const [alias, c] of Object.entries(cityMap)) {
    if (normalized.includes(alias)) { city = c; break; }
  }

  let type = "";
  if (lower.includes("pg") || lower.includes("hostel") || lower.includes("छात्रावास")) type = "pg";
  else if (lower.includes("room") || lower.includes("खोली") || lower.includes("कमरा")) type = "room";
  else if (lower.includes("office") || lower.includes("ऑफिस") || lower.includes("कार्यालय")) type = "office";
  else if (lower.includes("flat") || lower.includes("apartment") || lower.includes("फ्लॅट") || lower.includes("फ्लैट")) type = "apartment";
  else if (lower.includes("house") || lower.includes("घर") || lower.includes("निवास")) type = "house";

  let area = "";
  const areaKeywords = ["near", "जवळ", "पासोे", "कडे", "मध्ये", "in", "at"];
  for (const kw of areaKeywords) {
    const idx = normalized.indexOf(kw);
    if (idx !== -1) {
      const after = normalized.slice(idx + kw.length).trim();
      const words = after.split(/\s+/).filter((w) => w.length > 2).slice(0, 2);
      if (words.length > 0) area = words.join(" ");
      break;
    }
  }

  if (bedrooms > 0 || budget > 0 || city || type || area) {
    return { intent: "property_search", city, budget, bedrooms, type, area };
  }

  return null;
}

export default function AIChat() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({
    step: "welcome", city: "", type: "", minPrice: 500, maxPrice: 100000,
    bedrooms: 0, furnishing: "", area: "", purpose: "",
    commuteDest: "", commuteMaxMin: 30,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const name = user?.name?.split(" ")[0] || "there";
      const greet = lang === "mr" ? `नमस्कार, ${name}! 👋` : lang === "hi" ? `नमस्ते, ${name}! 👋` : `Hey ${name}! 👋`;
      const intro = lang === "mr"
        ? `मी Ria आहे, तुमची AI rental assistant. मी तुम्हाला योग्य मालमत्ता शोधण्यास मदत करीन. 🏠\n\nतुम्ही मला मराठी किंवा हिंदीमध्ये सहज बात करू शकता!\n\nतुम्हाला काय हवे आहे?`
        : lang === "hi"
        ? `मैं Ria हूँ, आपकी AI rental assistant। मैं आपको सही प्रॉपर्टी खोजने में मदद करूँगी। 🏠\n\nआप मुझसे हिंदी या मराठी में बात कर सकते हैं!\n\nआपको क्या चाहिए?`
        : `I'm Ria, your AI rental assistant. I'll help you find the perfect property across Maharashtra. 🏠\n\nYou can talk to me in English, Marathi, or Hindi!\n\nWhat are you looking for?`;
      setMessages([{ role: "assistant", content: greet + "\n\n" + intro + "\n\n" + t("Choose an option or type naturally:", "पर्याय निवडा किंवा थेट सांगा:", "विकल्प चुनें या सीधे बताएं:") }]);
      setSearchState((s) => ({ ...s, step: "purpose" }));
    }
  }, [isOpen, messages.length, user, lang]);

  function t(en: string, mr: string, hi: string) {
    if (lang === "mr") return mr;
    if (lang === "hi") return hi;
    return en;
  }

  async function fetchSearch(filters: Record<string, unknown>): Promise<SearchResult[]> {
    try {
      const res = await fetch("/api/properties/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      return data.success ? data.results : [];
    } catch { return []; }
  }

  async function fetchCommute(dest: string, maxMin: number): Promise<CommuteResult[]> {
    try {
      const res = await fetch("/api/commute", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: dest, maxMinutes: maxMin }),
      });
      const data = await res.json();
      return data.success ? data.results : [];
    } catch { return []; }
  }

  async function processInput(userInput: string) {
    const userMsg: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 600));

    const lower = userInput.toLowerCase();
    let reply = "";
    let results: SearchResult[] = [];
    let commuteResults: CommuteResult[] = [];
    const newState = { ...searchState };

    if (searchState.step === "results") {
      if (lower.includes("search") || lower.includes("new") || lower.includes("शोध") || lower.includes("नवीन") || lower.includes("खोजें") || lower.includes("नई") || lower.includes("सुरू")) {
        reply = t("Let's start fresh! What are you looking for?", "नवीन सुरुवत! तुम्हाला काय हवे आहे?", "फिर से शुरू करते हैं! आपको क्या चाहिए?");
        newState.step = "purpose";
        setSearchState(newState);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setIsTyping(false);
        return;
      }
    }

    const detected = detectIntent(userInput);

    if (detected && detected.intent === "commute") {
      const dest = detected.commuteDest || "pune university";
      const maxMin = detected.commuteMin || 30;
      reply = t(
        `🚗 Searching properties within ${maxMin} min commute to ${dest}…`,
        `🚗 ${dest} च्या ${maxMin} मिनिटांच्या प्रवासात मालमत्ता शोधत आहे…`,
        `🚗 ${dest} तक ${maxMin} मिनट की यात्रा में प्रॉपर्टी खोज रहे हैं…`
      );
      commuteResults = await fetchCommute(dest, maxMin);
      newState.step = "results";
      newState.commuteDest = dest;
      newState.commuteMaxMin = maxMin;
      setSearchState(newState);

      if (commuteResults.length > 0) {
        const summary = t(
          `Found ${commuteResults.length} properties within ${maxMin} min:`,
          `${commuteResults.length} मालमत्ता ${maxMin} मिनिटांमध्ये सापडल्या:`,
          `${commuteResults.length} प्रॉपर्टी ${maxMin} मिनट में मिलीं:`
        );
        reply += "\n\n" + summary;
        setMessages((prev) => [...prev, {
          role: "assistant", content: reply,
          properties: commuteResults.map((r) => ({
            id: r.id, title: r.title, price: r.price, type: r.type, area: r.area, city: r.city,
            bedrooms: r.bedrooms, bathrooms: 0, furnishing: "", images: r.images,
            amenities: [], isVerified: false,
          })),
        }]);
        setIsTyping(false);
        return;
      } else {
        reply += "\n\n" + t(
          "No properties found in that commute range. Try increasing the time.",
          "त्या प्रवास वेळेत मालमत्ता सापडली नाही. वेळ वाढवून पहा.",
          "उस यात्रा सीमा में कोई प्रॉपर्टी नहीं मिली। समय बढ़ाकर देखें।"
        );
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setIsTyping(false);
        return;
      }
    }

    if (detected && detected.intent === "property_search") {
      if (detected.city) newState.city = detected.city;
      if (detected.budget) newState.maxPrice = detected.budget;
      if (detected.bedrooms) newState.bedrooms = detected.bedrooms;
      if (detected.type) newState.type = detected.type;
      if (detected.area) newState.area = detected.area;

      const filters: Record<string, unknown> = { minPrice: 500, maxPrice: newState.maxPrice };
      if (newState.city) filters.city = newState.city;
      if (newState.type) filters.type = newState.type;
      if (newState.bedrooms > 0) filters.bedrooms = newState.bedrooms;
      if (newState.area) filters.area = newState.area;

      const parts = [];
      if (newState.bedrooms > 0) parts.push(`${newState.bedrooms}BHK`);
      if (newState.city) parts.push(newState.city);
      if (newState.maxPrice < 100000) parts.push(`under ₹${newState.maxPrice.toLocaleString("en-IN")}`);
      if (newState.type) parts.push(newState.type);

      reply = t(
        `🔍 Searching for ${parts.join(" in ")}…`,
        `🔍 ${parts.join(" ")} शोधत आहे…`,
        `🔍 ${parts.join(" ")} खोज रहे हैं…`
      );
      results = await fetchSearch(filters);
      newState.step = "results";
      setSearchState(newState);

      if (results.length === 0) {
        reply += "\n\n" + t(
          "No exact matches. Let me broaden the search…",
          "जुळणी सापडली नाही. शोध विस्तारत आहे…",
          "कोई मैच नहीं मिला। खोज विस्तारित हो रही है…"
        );
        results = await fetchSearch({ minPrice: 500, maxPrice: newState.maxPrice });
      }

      if (results.length > 0) {
        const summary = t(
          `Found ${results.length} properties:`,
          `${results.length} मालमत्ता सापडल्या:`,
          `${results.length} प्रॉपर्टी मिलीं:`
        );
        reply += "\n\n" + summary + "\n\n" + t("Type 'search' to start over.", "पुन्हा सुरू करण्यासाठी 'search' टाइप करा.", "फिर से शुरू करने के लिए 'search' टाइप करें।");
        setMessages((prev) => [...prev, { role: "assistant", content: reply, properties: results }]);
        setIsTyping(false);
        return;
      }
    }

    switch (searchState.step) {
      case "purpose": {
        if (lower.includes("family") || lower.includes("कुटुंब") || lower.includes("परिवार") || lower.includes("🏠")) {
          newState.purpose = "family"; newState.type = "";
          reply = t("Great choice! 🏠\n\nWhere in Maharashtra? Type any city name.", "छान निवड! 🏠\n\nमहाराष्ट्रात कुठे? कोणतेही शहर टाइप करा.", "बहुत अच्छा! 🏠\n\nमहाराष्ट्र में कहाँ? कोई भी शहर टाइप करें।");
          newState.step = "city";
        } else if (lower.includes("work") || lower.includes("office") || lower.includes("काम") || lower.includes("💼") || lower.includes("ऑफिस")) {
          newState.purpose = "work"; newState.type = "office";
          reply = t("Office space, got it! 💼\n\nWhere in Maharashtra? Type any city name.", "ऑफिस स्पेस, समजले! 💼\n\nमहाराष्ट्रात कुठे?", "ऑफिस स्पेस, समझ गए! 💼\n\nमहाराष्ट्र में कहाँ?");
          newState.step = "city";
        } else if (lower.includes("student") || lower.includes("hostel") || lower.includes("pg") || lower.includes("🎓") || lower.includes("विद्यार्थी") || lower.includes("छात्र") || lower.includes("छात्रावास")) {
          newState.purpose = "student"; newState.type = "pg";
          reply = t("Student-friendly options! 🎓\n\nWhere in Maharashtra? Type any city name.", "विद्यार्थी अनुकूल! 🎓\n\nमहाराष्ट्रात कुठे?", "छात्रों के लिए! 🎓\n\nमहाराष्ट्र में कहाँ?");
          newState.step = "city";
        } else if (lower.includes("commute") || lower.includes("प्रवास") || lower.includes("reach") || lower.includes("🚗") || lower.includes("travel") || lower.includes("minutes") || lower.includes("मिनिट")) {
          newState.purpose = "commute";
          reply = t(
            "🚗 Commute search!\n\nWhere do you need to go? Type any location.",
            "🚗 प्रवास शोध!\n\nतुम्हाला कुठे जावे लागते? कोणतेही ठिकाण टाइप करा.",
            "🚗 यात्रा खोज!\n\nआपको कहाँ जाना है? कोई भी स्थान टाइप करें।"
          );
          newState.step = "commute_dest";
        } else {
          reply = t(
            "I can help in many ways! Choose or type naturally:\n\n🏠 Family Stay\n💼 Work/Office\n🎓 Student/Hostel\n🚗 Commute Search\n\nOr just say: 'I need 2BHK in Pune under ₹15000'",
            "मी अनेक मार्गांनी मदत करू शकतो! निवडा किंवा थेट सांगा:\n\n🏠 कुटुंबासाठी\n💼 कामासाठी\n🎓 विद्यार्थ्यांसाठी\n🚗 प्रवास शोध\n\nकिंवा थेट सांगा: 'मला पुण्यात १५ हजाराच्या आत २ BHK पाहिजे'",
            "मैं कई तरह से मदद कर सकता हूँ! चुनें या सीधे बताएं:\n\n🏠 परिवार के लिए\n💼 काम/ऑफिस\n🎓 छात्रावास\n🚗 यात्रा खोज\n\nया सीधे कहें: 'मुझे पुणे में 15 हजार के अंदर 2BHK चाहिए'"
          );
        }
        break;
      }

      case "city": {
        let matchedCity = "";
        const allCityAliases: Record<string, string> = {
          "मुंबई": "Mumbai", "बॉम्बे": "Mumbai", "mumbai": "Mumbai",
          "पुणे": "Pune", "pune": "Pune", "पुण्यात": "Pune", "पुण्याच्या": "Pune",
          "ठाणे": "Thane", "thane": "Thane",
          "नवी मुंबई": "Navi Mumbai", "navi mumbai": "Navi Mumbai", "नवीमुंबई": "Navi Mumbai",
          "नागपूर": "Nagpur", "nagpur": "Nagpur",
          "नाशिक": "Nashik", "nashik": "Nashik",
          "कोल्हापूर": "Kolhapur", "kolhapur": "Kolhapur",
          "औरंगाबाद": "Aurangabad", "aurangabad": "Aurangabad",
          "सोलापूर": "Solapur", "solapur": "Solapur",
          "सातारा": "Satara", "satara": "Satara",
          "नांदेड": "Nanded", "nanded": "Nanded",
          "अमरावती": "Amravati", "amravati": "Amravati",
          "रत्नागिरी": "Ratnagiri", "ratnagiri": "Ratnagiri",
        };
        for (const [alias, c] of Object.entries(allCityAliases)) {
          if (lower.includes(alias)) { matchedCity = c; break; }
        }
        if (!matchedCity && userInput.trim().length > 1) {
          matchedCity = userInput.trim();
        }
        if (matchedCity) {
          newState.city = matchedCity;
          if (newState.purpose === "student" || newState.purpose === "commute") {
            reply = t(`${matchedCity}! 🎓\n\nYour monthly budget? (min ₹500)`, `${matchedCity}! 🎓\n\nमासिक बजेट? (किमान ₹500)`, `${matchedCity}! 🎓\n\nमासिक बजट? (न्यूनतम ₹500)`);
            newState.step = "budget";
          } else {
            reply = t(`${matchedCity} — great! 🏙️\n\nApartment, house, or both?`, `${matchedCity} — छान! 🏙️\n\nफ्लॅट, घर, किंवा दोन्ही?`, `${matchedCity} — बहुत अच्छा! 🏙️\n\nफ्लैट, घर, या दोनों?`);
            reply += "\n\n" + t("apartment · house · both", "फ्लॅट · घर · दोन्ही", "फ्लैट · घर · दोनों");
            newState.step = "type";
          }
        } else {
          reply = t("Type the name of any city in Maharashtra:", "महाराष्ट्रातील कोणत्याही शहराचे नाव टाइप करा:", "महाराष्ट्र के किसी भी शहर का नाम टाइप करें:");
        }
        break;
      }

      case "commute_dest": {
        let dest = "";
        for (const [key, val] of Object.entries(DESTINATIONS)) {
          if (lower.includes(key)) { dest = val; break; }
        }
        if (!dest) {
          const words = lower.split(/\s+/);
          for (const w of words) { if (DESTINATIONS[w]) { dest = DESTINATIONS[w]; break; } }
        }
        if (!dest) dest = userInput;
        newState.commuteDest = dest;
        reply = t(
          `How many minutes max? (e.g. 20, 30, 45)`,
          `जास्तीत जास्त किती मिनिट? (उदा. 20, 30, 45)`,
          `अधिकतम कितने मिनट? (जैसे 20, 30, 45)`
        );
        newState.step = "commute_time";
        break;
      }

      case "commute_time": {
        const minMatch = lower.match(/(\d+)/);
        if (minMatch) {
          const maxMin = parseInt(minMatch[1]);
          newState.commuteMaxMin = maxMin;
          reply = t(
            `🚗 Searching properties within ${maxMin} min of ${newState.commuteDest}…`,
            `🚗 ${newState.commuteDest} च्या ${maxMin} मिनिटांमध्ये शोधत आहे…`,
            `🚗 ${newState.commuteDest} तक ${maxMin} मिनट में खोज रहे हैं…`
          );
          commuteResults = await fetchCommute(newState.commuteDest, maxMin);
          newState.step = "results";
          if (commuteResults.length > 0) {
            reply += "\n\n" + t(
              `Found ${commuteResults.length} properties!`,
              `${commuteResults.length} मालमत्ता सापडल्या!`,
              `${commuteResults.length} प्रॉपर्टी मिलीं!`
            );
            setMessages((prev) => [...prev, {
              role: "assistant", content: reply,
              properties: commuteResults.map((r) => ({
                id: r.id, title: r.title, price: r.price, type: r.type, area: r.area, city: r.city,
                bedrooms: r.bedrooms, bathrooms: 0, furnishing: "", images: r.images,
                amenities: [], isVerified: false,
              })),
            }]);
            setIsTyping(false);
            return;
          } else {
            reply += "\n\n" + t("No properties in range. Try more time.", "वेळेत मालमत्ता नाही. अधिक वेळ वापरा.", "रेंज में प्रॉपर्टी नहीं। अधिक समय आज़माएं।");
          }
        } else {
          reply = t("Enter minutes, e.g. 30", "मिनिट प्रविष्ट करा, उदा. 30", "मिनट दर्ज करें, जैसे 30");
        }
        break;
      }

      case "type": {
        if (lower.includes("apartment") || lower.includes("flat") || lower.includes("फ्लॅट") || lower.includes("फ्लैट")) newState.type = "apartment";
        else if (lower.includes("house") || lower.includes("घर")) newState.type = "house";
        else if (lower.includes("both") || lower.includes("दोन्ही") || lower.includes("दोनों") || lower.includes("any")) newState.type = "";
        else { reply = t("Choose: apartment, house, or both", "निवडा: फ्लॅट, घर, किंवा दोन्ही", "चुनें: फ्लैट, घर, या दोनों"); break; }
        reply = t("Monthly budget? 💰 (min ₹500)", "मासिक बजेट? 💰 (किमान ₹500)", "मासिक बजट? 💰 (न्यूनतम ₹500)");
        newState.step = "budget";
        break;
      }

      case "budget": {
        const devanagariMap: Record<string, string> = { "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9" };
        let normalized = userInput.toLowerCase();
        for (const [d, n] of Object.entries(devanagariMap)) { normalized = normalized.replaceAll(d, n); }
        const priceMatch = normalized.match(/(\d[\d,]*)/);
        if (priceMatch) {
          let price = parseInt(priceMatch[1].replace(/,/g, ""));
          if (lower.includes("हजार") || lower.includes("hazaar")) price *= 1000;
          if (price >= 500) {
            newState.maxPrice = price;
            reply = t("How many bedrooms? 🛏️", "किती बेडरूम? 🛏️", "कितने बेडरूम? 🛏️");
            newState.step = "bedrooms";
          } else {
            reply = t("Min ₹500.", "किमान ₹500.", "न्यूनतम ₹500।");
          }
        } else {
          reply = t("Enter amount, e.g. 15000", "रक्कम प्रविष्ट करा, उदा. 15000", "राशि दर्ज करें, जैसे 15000");
        }
        break;
      }

      case "bedrooms": {
        const numMatch = lower.match(/(\d+)/);
        if (numMatch) {
          newState.bedrooms = parseInt(numMatch[1]);
          reply = t("Preferred furnishing? 🪑\n(unfurnished · semi · furnished · any)", "फर्निशिंग? 🪑\n(unfurnished · semi · furnished · any)", "फर्निशिंग? 🪑\n(अनफर्निश्ड · सेमी · फर्निश्ड · कोई भी)");
          newState.step = "furnishing";
        } else {
          reply = t("Enter 1, 2, 3…", "1, 2, 3… प्रविष्ट करा", "1, 2, 3… दर्ज करें");
        }
        break;
      }

      case "furnishing": {
        if (lower.includes("semi") || lower.includes("सेमी")) newState.furnishing = "semi";
        else if (lower.includes("full") || lower.includes("furnished") || lower.includes("फर्निश्ड")) newState.furnishing = "furnished";
        else if (lower.includes("un") || lower.includes("अनफर्निश्ड")) newState.furnishing = "unfurnished";

        reply = t("🔍 Searching…", "🔍 शोधत आहे…", "🔍 खोज रहे हैं…");
        newState.step = "results";
        const filters: Record<string, unknown> = { minPrice: 500, maxPrice: newState.maxPrice };
        if (newState.city) filters.city = newState.city;
        if (newState.type) filters.type = newState.type;
        if (newState.bedrooms > 0) filters.bedrooms = newState.bedrooms;
        if (newState.furnishing) filters.furnishing = newState.furnishing;
        results = await fetchSearch(filters);
        if (results.length === 0) {
          results = await fetchSearch({ minPrice: 500, maxPrice: newState.maxPrice, city: newState.city });
        }
        break;
      }

      default:
        reply = t("How can I help? You can:\n\n🏠 Search properties\n🚗 Find by commute time\n💬 Or just type naturally!", "मी कशी मदत करू? तुम्ही करू शकता:\n\n🏠 मालमत्ता शोधा\n🚗 प्रवासानुसार शोधा\n💬 किंवा थेट सांगा!", "मैं कैसे मदद करूँ? आप कर सकते हैं:\n\n🏠 प्रॉपर्टी खोजें\n🚗 यात्रा के अनुसार खोजें\n💬 या सीधे बताएं!");
    }

    setSearchState(newState);

    if (results.length > 0 && newState.step === "results") {
      const summary = results.length === 1
        ? t(`Found 1 property:`, `1 मालमत्ता सापडली:`, `1 प्रॉपर्टी मिली:`)
        : t(`Found ${results.length} properties:`, `${results.length} मालमत्ता सापडल्या:`, `${results.length} प्रॉपर्टी मिलीं:`);
      reply += "\n\n" + summary + "\n\n" + t("Type 'search' to start over.", "पुन्हा सुरू करण्यासाठी 'search' टाइप करा.", "फिर से शुरू करने के लिए 'search' टाइप करें।");
      setMessages((prev) => [...prev, { role: "assistant", content: reply, properties: results }]);
    } else if (!commuteResults.length) {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }
    setIsTyping(false);
  }

  function handleSend() {
    if (!input.trim() || isTyping) return;
    processInput(input.trim());
  }

  function resetChat() {
    setMessages([]);
    setSearchState({ step: "welcome", city: "", type: "", minPrice: 500, maxPrice: 100000, bedrooms: 0, furnishing: "", area: "", purpose: "", commuteDest: "", commuteMaxMin: 30 });
  }

  const purposeButtons = [
    { key: "family", icon: "🏠", en: "Family Stay", mr: "कुटुंबासाठी", hi: "परिवार के लिए" },
    { key: "work", icon: "💼", en: "Work/Office", mr: "कामासाठी", hi: "काम/ऑफिस के लिए" },
    { key: "student", icon: "🎓", en: "Student/PG", mr: "विद्यार्थ्यांसाठी", hi: "छात्र/PG के लिए" },
    { key: "commute", icon: "🚗", en: "Commute Search", mr: "प्रवास शोध", hi: "यात्रा खोज" },
  ];

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="ai-fab" style={{
        position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%",
        background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", border: "none",
        cursor: "pointer", boxShadow: "0 4px 16px rgba(13,110,253,0.4)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
      }}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="ai-chat-window" style={{
          position: "fixed", bottom: 92, right: 24, width: 380, maxWidth: "calc(100vw - 32px)",
          height: 520, maxHeight: "calc(100vh - 140px)", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)", zIndex: 9998, display: "flex", flexDirection: "column",
          border: "1px solid #e3e7ef", background: "white",
        }}>
          <div style={{ padding: "16px 20px", background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Ria</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>{t("AI Rental Assistant · EN/MR/HI", "AI भाडे सहाय्यक", "AI किराया सहायक")}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={resetChat} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "4px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer" }}>
                {t("Reset", "रीसेट", "रीसेट")}
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "grid", gap: 12, background: "#f7f8fc" }}>
            {messages.map((m, i) => (
              <div key={i}>
                <div style={{
                  maxWidth: "88%", padding: "10px 14px", fontSize: 14, lineHeight: 1.6,
                  whiteSpace: "pre-line", wordBreak: "break-word",
                  background: m.role === "user" ? "linear-gradient(135deg,#0d6efd,#0a58ca)" : "white",
                  color: m.role === "user" ? "white" : "#0b1437",
                  border: m.role === "assistant" ? "1px solid #e3e7ef" : "none",
                  justifySelf: m.role === "user" ? "end" : "start",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                }}>
                  {m.content}
                </div>
                {searchState.step === "purpose" && i === messages.length - 1 && m.role === "assistant" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, maxWidth: "95%" }}>
                    {purposeButtons.map((b) => (
                      <button key={b.key} onClick={() => processInput(b.key)} style={{
                        padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
                        border: "1px solid #e3e7ef", background: "white", color: "#0b1437",
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#0d6efd"; (e.target as HTMLElement).style.background = "rgba(13,110,253,0.06)"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#e3e7ef"; (e.target as HTMLElement).style.background = "white"; }}
                      >
                        {b.icon} {t(b.en, b.mr, b.hi)}
                      </button>
                    ))}
                  </div>
                )}
                {m.properties && m.properties.length > 0 && (
                  <div style={{ display: "grid", gap: 8, marginTop: 8, maxWidth: "95%" }}>
                    {m.properties.slice(0, 3).map((p) => (
                      <div key={p.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e3e7ef", overflow: "hidden", display: "flex", gap: 10, padding: 10 }}>
                        <img src={p.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200"} alt="" style={{ width: 70, height: 70, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1437", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                          <div style={{ fontSize: 11, color: "#4b5675" }}>{p.area}, {p.city}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#ff6a3d" }}>₹{p.price.toLocaleString("en-IN")}</span>
                            <a href={`/properties/${p.id}`} style={{ fontSize: 11, color: "#0d6efd", fontWeight: 700, textDecoration: "none" }}>View →</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", gap: 4, padding: "12px 16px", background: "white", borderRadius: 14, border: "1px solid #e3e7ef", width: "fit-content" }}>
                <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", animation: "typingBounce 1.4s infinite ease-in-out" }} />
                <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", animation: "typingBounce 1.4s infinite ease-in-out 0.2s" }} />
                <div className="typing-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", animation: "typingBounce 1.4s infinite ease-in-out 0.4s" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "12px 16px", borderTop: "1px solid #e3e7ef", display: "flex", gap: 8, background: "white" }}>
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("Try: 2BHK in Pune under 15000…", "उदा: पुण्यात १५ हजारात २ BHK…", "उदा: पुणे में 15 हजार में 2BHK…")}
              className="input"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #e3e7ef", fontSize: 14, outline: "none" }}
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping} style={{
              width: 40, height: 40, borderRadius: 10, border: "none",
              background: input.trim() ? "linear-gradient(135deg,#0d6efd,#0a58ca)" : "#e3e7ef",
              color: input.trim() ? "white" : "#9ca3af", cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 480px) {
          .ai-chat-window { width: calc(100vw - 16px) !important; right: 8px !important; bottom: 80px !important; height: calc(100vh - 120px) !important; }
          .ai-fab { bottom: 16px !important; right: 16px !important; }
        }
      `}</style>
    </>
  );
}

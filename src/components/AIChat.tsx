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
  amenities: string[]; isVerified: boolean;
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
}

const CITIES = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Nagpur", "Nashik"];
const TYPES = ["apartment", "house", "room", "pg", "office"];
const PURPOSES: Record<string, string[]> = {
  "🏠 Family Stay": ["apartment", "house"],
  "💼 Work/Office": ["office", "apartment"],
  "🎓 Student/Hostel": ["pg", "room"],
  "👨‍💻 Individual Room": ["room", "pg"],
};

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
        ? `मी Ria आहे, तुमची AI rental assistant. मी तुम्हाला योग्य मालमत्ता शोधण्यास मदत करीन. 🏠\n\nतुम्हाला काय हवे आहे? खालील पर्याय निवडा:`
        : lang === "hi"
        ? `मैं Ria हूँ, आपकी AI rental assistant। मैं आपको सही प्रॉपर्टी खोजने में मदद करूँगी। 🏠\n\nआपको क्या चाहिए? नीचे विकल्प चुनें:`
        : `I'm Ria, your AI rental assistant. I'll help you find the perfect property. 🏠\n\nWhat are you looking for? Choose an option:`;
      const purposeMsg = lang === "mr"
        ? "🏠 Family Stay — कुटुंबासाठी\n💼 Work/Office — कामासाठी\n🎓 Student/Hostel — विद्यार्थ्यांसाठी\n👨‍💻 Individual Room — एकट्यासाठी"
        : lang === "hi"
        ? "🏠 Family Stay — परिवार के लिए\n💼 Work/Office — काम/ऑफिस के लिए\n🎓 Student/Hostel — छात्रावास के लिए\n👨‍💻 Individual Room — अकेले कमरे के लिए"
        : "🏠 Family Stay\n💼 Work/Office\n🎓 Student/Hostel\n👨‍💻 Individual Room";
      setMessages([{ role: "assistant", content: greet + "\n\n" + intro + "\n\n" + purposeMsg }]);
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
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

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    const lower = userInput.toLowerCase();
    let reply = "";
    let results: SearchResult[] = [];
    const newState = { ...searchState };

    switch (searchState.step) {
      case "purpose": {
        if (lower.includes("family") || lower.includes("कुटुंब") || lower.includes("परिवार") || lower.includes("🏠 family")) {
          newState.purpose = "family";
          newState.type = "";
          reply = t(
            "Great choice! 🏠\n\nNow, which city in Maharashtra?",
            "छान निवड! 🏠\n\nआता, महाराष्ट्रातील कोणत्या शहरात?",
            "बहुत अच्छा! 🏠\n\nअब, महाराष्ट्र के किस शहर में?"
          );
          reply += "\n\n" + CITIES.join(" · ");
          newState.step = "city";
        } else if (lower.includes("work") || lower.includes("office") || lower.includes("काम") || lower.includes("💼")) {
          newState.purpose = "work";
          newState.type = "office";
          reply = t(
            "Office space, got it! 💼\n\nWhich city?",
            "ऑफिस स्पेस, समजले! 💼\n\nकोणत्या शहरात?",
            "ऑफिस स्पेस, समझ गए! 💼\n\nकिस शहर में?"
          );
          reply += "\n\n" + CITIES.join(" · ");
          newState.step = "city";
        } else if (lower.includes("student") || lower.includes("hostel") || lower.includes("pg") || lower.includes("🎓") || lower.includes("विद्यार्थी") || lower.includes("छात्र")) {
          newState.purpose = "student";
          newState.type = "pg";
          reply = t(
            "Student-friendly options! 🎓\n\nWhich city?",
            "विद्यार्थी अनुकूल पर्याय! 🎓\n\nकोणत्या शहरात?",
            "छात्रों के लिए! 🎓\n\nकिस शहर में?"
          );
          reply += "\n\n" + CITIES.join(" · ");
          newState.step = "city";
        } else if (lower.includes("room") || lower.includes("individual") || lower.includes("एकल") || lower.includes("👨‍💻") || lower.includes("कमरा")) {
          newState.purpose = "individual";
          newState.type = "room";
          reply = t(
            "Single room got it! 👨‍💻\n\nWhich city?",
            "एकल खोली, समजले! 👨‍💻\n\nकोणत्या शहरात?",
            "सिंगल रूम, समझ गए! 👨‍💻\n\nकिस शहर में?"
          );
          reply += "\n\n" + CITIES.join(" · ");
          newState.step = "city";
        } else {
          reply = t(
            "Please choose one of the options:\n\n🏠 Family Stay\n💼 Work/Office\n🎓 Student/Hostel\n👨‍💻 Individual Room",
            "कृपया एखादा पर्याय निवडा:\n\n🏠 कुटुंबासाठी\n💼 कामासाठी\n🎓 विद्यार्थ्यांसाठी\n👨‍💻 एकट्यासाठी",
            "कृपया एक विकल्प चुनें:\n\n🏠 परिवार के लिए\n💼 काम/ऑफिस के लिए\n🎓 छात्रावास के लिए\n👨‍💻 अकेले कमरे के लिए"
          );
        }
        break;
      }

      case "city": {
        const matchedCity = CITIES.find((c) => lower.includes(c.toLowerCase()));
        if (matchedCity) {
          newState.city = matchedCity;
          if (newState.purpose === "student") {
            reply = t(
              `Perfect, ${matchedCity}! 🎓\n\nWhat's your monthly budget? (min ₹500)`,
              `परफेक्ट, ${matchedCity}! 🎓\n\nतुमचा मासिक बजेट काय आहे? (किमान ₹500)`,
              `बहुत अच्छा, ${matchedCity}! 🎓\n\nमासिक बजट क्या है? (न्यूनतम ₹500)`
            );
            newState.step = "budget";
          } else if (newState.purpose === "individual") {
            reply = t(
              `${matchedCity} it is! 👨‍💻\n\nYour budget range? (min ₹500)`,
              `${matchedCity} ठीक आहे! 👨\u200D💻\n\nतुमचा बजेट श्रेणी? (किमान ₹500)`,
              `${matchedCity} ठीक है! 👨\u200D💻\n\nबजट रेंज? (न्यूनतम ₹500)`
            );
            newState.step = "budget";
          } else {
            reply = t(
              `${matchedCity} — great choice! 🏙️\n\nLooking for an apartment, house, or both?`,
              `${matchedCity} — छान निवड! 🏙️\n\nफ्लॅट, घर, किंवा दोन्ही?`,
              `${matchedCity} — बहुत अच्छा! 🏙️\n\nफ्लैट, घर, या दोनों?`
            );
            reply += "\n\n" + t("apartment · house · both", "फ्लॅट · घर · दोन्ही", "फ्लैट · घर · दोनों");
            newState.step = "type";
          }
        } else {
          reply = t(
            "I didn't catch that. Please choose a city:\n\n" + CITIES.join(" · "),
            "समजले नाही. कृपया शहर निवडा:\n\n" + CITIES.join(" · "),
            "समझ नहीं आया। कृपया शहर चुनें:\n\n" + CITIES.join(" · ")
          );
        }
        break;
      }

      case "type": {
        if (lower.includes("apartment") || lower.includes("flat") || lower.includes("फ्लॅट") || lower.includes("फ्लैट")) {
          newState.type = "apartment";
        } else if (lower.includes("house") || lower.includes("घर")) {
          newState.type = "house";
        } else if (lower.includes("both") || lower.includes("दोन्ही") || lower.includes("दोनों") || lower.includes("any")) {
          newState.type = "";
        } else {
          reply = t(
            "Please choose: apartment, house, or both",
            "कृपया निवडा: फ्लॅट, घर, किंवा दोन्ही",
            "कृपया चुनें: फ्लैट, घर, या दोनों"
          );
          break;
        }
        reply = t(
          "What's your monthly budget? 💰\n(Min ₹500, e.g. ₹15000)",
          "तुमचा मासिक बजेट काय आहे? 💰\n(किमान ₹500, उदा. ₹15000)",
          "मासिक बजट क्या है? 💰\n(न्यूनतम ₹500, जैसे ₹15000)"
        );
        newState.step = "budget";
        break;
      }

      case "budget": {
        const priceMatch = lower.match(/(\d[\d,]*)/);
        if (priceMatch) {
          const price = parseInt(priceMatch[1].replace(/,/g, ""));
          if (price >= 500) {
            newState.maxPrice = price;
            if (newState.minPrice < 500) newState.minPrice = 500;
            if (newState.purpose === "student" || newState.purpose === "individual") {
              reply = t(
                "How many people / rooms needed? 🛏️\n(1, 2, 3, or more)",
                "किती लोक / खोल्या लागतात? 🛏️\n(1, 2, 3, किंवा अधिक)",
                "कितने लोग / कमरे चाहिए? 🛏️\n(1, 2, 3, या अधिक)"
              );
              newState.step = "bedrooms";
            } else {
              reply = t(
                "How many bedrooms? 🛏️\n(1BHK, 2BHK, 3BHK…)",
                "किती बेडरूम? 🛏️\n(1BHK, 2BHK, 3BHK…)",
                "कितने बेडरूम? 🛏️\n(1BHK, 2BHK, 3BHK…)"
              );
              newState.step = "bedrooms";
            }
          } else {
            reply = t(
              "Minimum budget is ₹500. Please enter a higher amount.",
              "किमान बजेट ₹500 आहे. कृपया अधिक रक्कम प्रविष्ट करा.",
              "न्यूनतम बजट ₹500 है। कृपया अधिक राशि दर्ज करें।"
            );
          }
        } else {
          reply = t(
            "Please enter a number, e.g. ₹15000",
            "कृपया संख्या प्रविष्ट करा, उदा. ₹15000",
            "कृपया संख्या दर्ज करें, जैसे ₹15000"
          );
        }
        break;
      }

      case "bedrooms": {
        const numMatch = lower.match(/(\d+)/);
        if (numMatch) {
          const num = parseInt(numMatch[1]);
          newState.bedrooms = num;
          if (newState.purpose === "student" || newState.purpose === "individual") {
            reply = t(
              "Any specific area or locality? 📍\n(Or type 'any' to search all)",
              "कोणता विशिष्ट भाग किंवा ठिकाण? 📍\n(किंवा सर्व शोधण्यासाठी 'any' टाइप करा)",
              "कोई विशेष इलाका? 📍\n(या सभी खोजने के लिए 'any' टाइप करें)"
            );
            newState.step = "area";
          } else {
            reply = t(
              "Preferred furnishing? 🪑\n(unfurnished · semi · furnished · any)",
              "पसंदीदा फर्निशिंग? 🪑\n(unfurnished · semi · furnished · any)",
              "पसंदीदा फर्निशिंग? 🪑\n(अनफर्निश्ड · सेमी · फर्निश्ड · कोई भी)"
            );
            newState.step = "furnishing";
          }
        } else {
          reply = t("Enter a number (1, 2, 3…)", "संख्या प्रविष्ट करा (1, 2, 3…)", "संख्या दर्ज करें (1, 2, 3…)");
        }
        break;
      }

      case "area": {
        if (!lower.includes("any") && !lower.includes("सर्व") && !lower.includes("सभी")) {
          newState.area = userInput;
        }
        reply = t(
          "Preferred furnishing? 🪑\n(unfurnished · semi · furnished · any)",
          "पसंदीदा फर्निशिंग? 🪑\n(unfurnished · semi · furnished · any)",
          "पसंदीदा फर्निशिंग? 🪑\n(अनफर्निश्ड · सेमी · फर्निश्ड · कोई भी)"
        );
        newState.step = "furnishing";
        break;
      }

      case "furnishing": {
        if (lower.includes("semi") || lower.includes("सेमी")) newState.furnishing = "semi";
        else if (lower.includes("full") || lower.includes("furnished") || lower.includes("फर्निश्ड")) newState.furnishing = "furnished";
        else if (lower.includes("un") || lower.includes("अनफर्निश्ड")) newState.furnishing = "unfurnished";

        reply = t("🔍 Searching for your perfect match…", "🔍 तुमचा परिपूर्ण शोधत आहे…", "🔍 आपका सही मैच खोज रहे हैं…");
        newState.step = "results";

        const filters: Record<string, unknown> = { minPrice: 500, maxPrice: newState.maxPrice };
        if (newState.city) filters.city = newState.city;
        if (newState.type) filters.type = newState.type;
        if (newState.bedrooms > 0) filters.bedrooms = newState.bedrooms;
        if (newState.area) filters.area = newState.area;
        if (newState.furnishing) filters.furnishing = newState.furnishing;

        results = await fetchSearch(filters);

        if (results.length === 0) {
          reply = t(
            `No exact matches found in ${newState.city || "Maharashtra"}. Let me broaden the search…`,
            `${newState.city || "महाराष्ट्र"} मध्ये जुळणी सापडली नाही. शोध विस्तारत आहे…`,
            `${newState.city || "महाराष्ट्र"} में कोई मैच नहीं मिला। खोज विस्तारित हो रही है…`
          );
          const broadFilters: Record<string, unknown> = { minPrice: 500, maxPrice: newState.maxPrice };
          if (newState.city) broadFilters.city = newState.city;
          results = await fetchSearch(broadFilters);

          if (results.length === 0 && newState.city) {
            results = await fetchSearch({ minPrice: 500, maxPrice: newState.maxPrice });
          }
        }
        break;
      }

      case "results": {
        const lowerInput = lower;
        if (lowerInput.includes("cheap") || lowerInput.includes("low") || lowerInput.includes("कमी") || lowerInput.includes("सस्ते")) {
          newState.maxPrice = Math.max(500, Math.floor(newState.maxPrice * 0.6));
          reply = t("Showing more budget-friendly options…", "अधिक बजेट-अनुकूल पर्याय दर्शवत आहे…", "अधिक बजट-अनुकूल विकल्प दिखा रहे हैं…");
          results = await fetchSearch({ city: newState.city, maxPrice: newState.maxPrice, minPrice: 500, type: newState.type || undefined, bedrooms: newState.bedrooms || undefined });
        } else if (lowerInput.includes("premium") || lowerInput.includes("luxury") || lowerInput.includes("प्रीमियम") || lowerInput.includes("luxurious")) {
          newState.minPrice = newState.maxPrice;
          newState.maxPrice = 100000;
          reply = t("Showing premium properties…", "प्रीमियम मालमत्ता दर्शवत आहे…", "प्रीमियम प्रॉपर्टी दिखा रहे हैं…");
          results = await fetchSearch({ city: newState.city, minPrice: newState.minPrice, maxPrice: 100000, type: newState.type || undefined });
        } else if (lowerInput.includes("search") || lowerInput.includes("new") || lowerInput.includes("शोध") || lowerInput.includes("नवीन") || lowerInput.includes("खोजें") || lowerInput.includes("नई")) {
          reply = t("Let's start fresh! What are you looking for?", "नवीन सुरुवत! तुम्हाला काय हवे आहे?", "फिर से शुरू करते हैं! आपको क्या चाहिए?");
          reply += "\n\n🏠 " + t("Family Stay", "कुटुंबासाठी", "परिवार के लिए") + "\n💼 " + t("Work/Office", "कामासाठी", "काम/ऑफिस") + "\n🎓 " + t("Student/Hostel", "विद्यार्थ्यांसाठी", "छात्रावास") + "\n👨‍💻 " + t("Individual Room", "एकल खोली", "अकेला कमरा");
          newState.step = "purpose";
        } else {
          results = await fetchSearch({ city: newState.city, maxPrice: newState.maxPrice, minPrice: 500, type: newState.type || undefined, bedrooms: newState.bedrooms || undefined });
        }
        break;
      }

      default:
        reply = t("How can I help you? Type your question.", "मी कशी मदत करू? तुमचा प्रश्न टाइप करा.", "मैं कैसे मदद कर सकता हूँ? अपना सवाल टाइप करें।");
    }

    setSearchState(newState);

    if (results.length > 0 && newState.step === "results") {
      const summary = results.length === 1
        ? t(`Found 1 property:`, `1 मालमत्ता सापडली:`, `1 प्रॉपर्टी मिली:`)
        : t(`Found ${results.length} properties:`, `${results.length} मालमत्ता सापडल्या:`, `${results.length} प्रॉपर्टी मिलीं:`);
      reply += "\n\n" + summary + "\n\n" + t("Click 'View Details' to see more. Type 'search' to start over.", "अधिक पहा 'View Details'. पुन्हा सुरू करण्यासाठी 'search' टाइप करा.", "अधिक देखने के लिए 'View Details' क्लिक करें। फिर से शुरू करने के लिए 'search' टाइप करें।");
      setMessages((prev) => [...prev, { role: "assistant", content: reply, properties: results }]);
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }
    setIsTyping(false);
  }

  function handleSend() {
    if (!input.trim() || isTyping) return;
    processInput(input.trim());
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-fab"
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white", border: "none",
          cursor: "pointer", boxShadow: "0 4px 16px rgba(13,110,253,0.4)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          transition: "transform 0.2s",
        }}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="ai-chat-window"
          style={{
            position: "fixed", bottom: 92, right: 24, width: 380, maxWidth: "calc(100vw - 32px)",
            height: 520, maxHeight: "calc(100vh - 140px)", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)", zIndex: 9998, display: "flex", flexDirection: "column",
            border: "1px solid #e3e7ef", background: "white",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "16px 20px", background: "linear-gradient(135deg,#0d6efd,#0a58ca)", color: "white",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Ria</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>{t("AI Rental Assistant", "AI भाडे सहाय्यक", "AI किराया सहायक")}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={() => { setMessages([]); setSearchState({ step: "welcome", city: "", type: "", minPrice: 500, maxPrice: 100000, bedrooms: 0, furnishing: "", area: "", purpose: "" }); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "4px 10px", borderRadius: 8, fontSize: 11, cursor: "pointer" }}>
                {t("Reset", "रीसेट", "रीसेट")}
              </button>
            </div>
          </div>

          {/* Messages */}
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
                {m.properties && m.properties.length > 0 && (
                  <div style={{ display: "grid", gap: 8, marginTop: 8, maxWidth: "95%" }}>
                    {m.properties.slice(0, 3).map((p) => (
                      <div key={p.id} style={{
                        background: "white", borderRadius: 12, border: "1px solid #e3e7ef",
                        overflow: "hidden", display: "flex", gap: 10, padding: 10,
                      }}>
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

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #e3e7ef", display: "flex", gap: 8, background: "white" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("Type a message…", "संदेश टाइप करा…", "संदेश टाइप करें…")}
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

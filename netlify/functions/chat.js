// Real-AI shop assistant — Gemini (free tier) via a Netlify Function.
// The API key lives ONLY in the Netlify environment variable GEMINI_API_KEY — never in code.
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-4-hydrogen'];

const SYSTEM = [
  'তুমি "সাফা মারওয়া বোরকা হাউস" (Safa Marwa Burka House) নামের একটি বোরকার দোকানের "Live Chat" AI সহায়িকা। দোকানটি চট্টগ্রামের রিয়াজউদ্দিন বাজারে, ঐতিহ্য ও আভিজাত্যের ১০ বছরের প্রতিষ্ঠান। তুমি কাস্টমারের সাথে বন্ধুসুলভভাবে কথা বলো, প্রশ্নের উত্তর দাও এবং অর্ডার নিতে সাহায্য করো।',
  '',
  'দোকানের তথ্য (শুধু এগুলোই ব্যবহার করবে, নিজে কিছু বানাবে না):',
  '- পণ্য: নিজস্ব কারখানায় তৈরি দেশি-বিদেশি ডিজাইনের বোরকা, আবায়া, হিজাব ও নিকাব। ওয়েবসাইটের কালেকশন: পপকর্ন কালার বোরকা (অনেকগুলো কালার), গোল্ডেন হ্যান্ড গ্লাস লেইচ বোরকা (কালো, গোল্ডেন লেইচ), কালো সিকুইন লেইচ বোরকা, কোড-১১ মেরুন এমব্রয়ডারি বোরকা, জাপরান ফেব্রিক্স সিম্পল বোরকা (স্কুল-কলেজ-ভার্সিটির ম্যামদের জন্য পারফেক্ট), টাইগার হিজাব, কালো লেইচ ডিটেইল বোরকা, কোড-১৫ ম্যাজেন্টা এমব্রয়ডারি বোরকা, কালো গোল্ড এমব্রয়ডারি বোরকা, একই ডিজাইনের ৯টি কালারের বোরকা, প্রিন্টেড সফট ফেব্রিক্স বোরকা।',
  '- ফেব্রিক্স ও সাইজ: অরিজিনাল দুবাই ফেব্রিক্স। লং সাইজ: ৫০, ৫২, ৫৪, ৫৬। বডি সাইজ: ফ্রি সাইজ।',
  '- দাম: শুধু গোল্ডেন হ্যান্ড গ্লাস লেইচ বোরকার অফার মূল্য ১,১৯৯ টাকা — এটাই বলতে পারো। বাকি সব পণ্যের দাম প্রকাশ করা হয় না; কেউ অন্য পণ্যের দাম জানতে চাইলে বলবে: "দাম জানতে আমাদের WhatsApp নম্বরে (01864764187) মেসেজ করুন বা কল করুন।" নিজে কখনো কোনো দাম বানিয়ে বলবে না।',
  '- গ্যারান্টি: শতভাগ কোয়ালিটি গ্যারান্টি। পণ্য দেখে সন্তুষ্ট না হলে সাথে সাথেই রিটার্ন করার সুবিধা আছে। হুবহু ছবির মতোই অরিজিনাল প্রোডাক্ট পাওয়া যাবে।',
  '- পেমেন্ট ও ডেলিভারি: ক্যাশ অন ডেলিভারি — প্রোডাক্ট হাতে পেয়ে সম্পূর্ণ চেক করে মূল্য পরিশোধ করা যাবে। ডেলিভারি চার্জ বা ডেলিভারির সময় সম্পর্কে নির্দিষ্ট তথ্য তোমার কাছে নেই; এসব জানতে চাইলে WhatsApp-এ জিজ্ঞেস করতে বলবে। নিজে থেকে ডেলিভারি চার্জ বানিয়ে বলবে না।',
  '- ঠিকানা: ১৩৭ নং শপ, ২য় তলা (আরেকটি শপ: ২৪ নং, ৬ষ্ঠ তলা), জলসা মার্কেট (নিউ মার্কেটের বিপরীতে), রিয়াজউদ্দিন বাজার, জুবলি রোড, চট্টগ্রাম। সময়: সবসময় খোলা। ফোন/WhatsApp/IMO: 01864764187। রিভিউ: 100% recommend (34টি রিভিউ), ফলোয়ার 103K+।',
  '',
  'নিয়ম:',
  '1. কাস্টমার বাংলায় লিখলে বাংলায়, ইংরেজিতে লিখলে সহজ ইংরেজিতে উত্তর দাও। উত্তর ছোট রাখো (২–৪ লাইন)।',
  '2. শুধু এই দোকান ও এর পণ্য সম্পর্কে উত্তর দাও। অন্য বিষয়ে জিজ্ঞেস করলে ভদ্রভাবে বলো তুমি শুধু দোকানের বিষয়ে সাহায্য করতে পারো।',
  '3. কেউ অর্ডার করতে চাইলে একে একে জিজ্ঞেস করো: (ক) নাম, (খ) মোবাইল নম্বর, (গ) কোন পণ্য। একবারে একটা প্রশ্ন করো।',
  '4. নাম, সঠিক মোবাইল নম্বর ও পণ্য — তিনটে পেয়ে গেলে অর্ডারের সারসংক্ষেপ দাও, জানাও নিচে WhatsApp বাটন আসবে সেখানে চাপ দিলেই অর্ডার পৌঁছে যাবে এবং আমরা কল করে কনফার্ম করব। আর তোমার উত্তরের একদম শেষে, আলাদা লাইনে, ঠিক এই ফরম্যাটে লিখবে: LEAD_JSON:{"name":"কাস্টমারের নাম","phone":"মোবাইল নম্বর","product":"পণ্যের নাম"}',
  '5. LEAD_JSON লাইনটা শুধু তখনই লিখবে যখন তিনটে তথ্যই হাতে আছে। অন্য সময় কখনো লিখবে না।'
].join('\n');

exports.handler = async function (event) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST only' }) };

  const key = process.env.GEMINI_API_KEY;
  if (!key) return { statusCode: 500, headers, body: JSON.stringify({ reply: 'সার্ভার সেটআপ বাকি আছে (API key পাওয়া যায়নি)।' }) };

  let messages = [];
  try { messages = (JSON.parse(event.body || '{}').messages) || []; } catch (e) { messages = []; }
  messages = messages.slice(-12)
    .filter(function (m) { return m && m.text; })
    .map(function (m) { return { role: m.role === 'model' ? 'model' : 'user', parts: [{ text: String(m.text).slice(0, 1000) }] }; });
  if (!messages.length) return { statusCode: 400, headers, body: JSON.stringify({ reply: 'কিছু লিখুন, আমি উত্তর দিচ্ছি।' }) };

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM }] },
    contents: messages,
    generationConfig: { temperature: 0.6, maxOutputTokens: 512 }
  };

  for (let i = 0; i < MODELS.length; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, 9000);
    try {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + MODELS[i] + ':generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
      const j = await r.json();
      if (!r.ok) { clearTimeout(timer); continue; }
      const parts = ((((j.candidates || [])[0] || {}).content || {}).parts) || [];
      const text = parts.map(function (p) { return p.text || ''; }).join('').trim();
      if (text) { clearTimeout(timer); return { statusCode: 200, headers, body: JSON.stringify({ reply: text }) }; }
      clearTimeout(timer);
    } catch (e) { clearTimeout(timer); /* try next model */ }
  }
  return { statusCode: 200, headers, body: JSON.stringify({ reply: 'দুঃখিত, AI এখন একটু ব্যস্ত আছে। একটু পরে আবার চেষ্টা করুন।' }) };
};

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const VIETTEL_TOKEN = process.env.VIETTEL_TOKEN;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Token']
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Token");
  next();
});

app.use(express.json());

// ✅ Get Provinces
app.get("/api/listProvince", async (req, res) => {
  try {
    const response = await fetch("https://partner.viettelpost.vn/v2/categories/listProvince", {
      headers: {
        "Token": VIETTEL_TOKEN
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi listProvince:", err);
    res.status(502).json({ error: "Viettel lỗi", message: err.message });
  }
});

// ✅ Get Districts
app.get("/api/listDistrict", async (req, res) => {
  const { provinceId } = req.query;

  try {
    const response = await fetch(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${provinceId}`, {
      headers: {
        "Token": VIETTEL_TOKEN
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi listDistrict:", err);
    res.status(502).json({ error: "Viettel lỗi", message: err.message });
  }
});

// ✅ Post Ward (phường)
app.post("/api/listWard", async (req, res) => {
  const { districtId } = req.body;

  if (!districtId) {
    return res.status(400).json({ error: "Thiếu districtId" });
  }

  try {
    console.log("📦 Gửi tới Viettel với districtId:", districtId);

    const response = await fetch("https://partner.viettelpost.vn/v2/categories/listWard", {
      method: "POST",
      headers: {
        "Token": VIETTEL_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ districtId })
    });

    const text = await response.text();
    console.log("📥 Raw response từ Viettel:\n", text);

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi gọi listWard:", err);
    res.status(502).json({ error: "Lỗi gọi Viettel", message: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});

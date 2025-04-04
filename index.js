const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const VIETTEL_TOKEN = process.env.VIETTEL_TOKEN; // nhớ cấu hình token trong Render Dashboard

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

// ✅ GET Tỉnh
app.get("/api/listProvince", async (req, res) => {
  const response = await fetch("https://partner.viettelpost.vn/v2/categories/listProvince", {
    headers: {
      "Token": VIETTEL_TOKEN
    }
  });
  const data = await response.json();
  res.json(data);
});

// ✅ GET Quận
app.get("/api/listDistrict", async (req, res) => {
  const { provinceId } = req.query;
  const response = await fetch(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${provinceId}`, {
    headers: {
      "Token": VIETTEL_TOKEN
    }
  });
  const data = await response.json();
  res.json(data);
});

// ✅ POST Phường
app.post("/api/listWard", async (req, res) => {
  const { districtId } = req.body;

  if (!districtId) {
    return res.status(400).json({ error: "Thiếu districtId" });
  }

  try {
    const response = await fetch("https://partner.viettelpost.vn/v2/categories/listWard", {
      method: "POST",
      headers: {
        "Token": VIETTEL_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ districtId })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi gọi Viettel:", err);
    res.status(502).json({ error: "Viettel Post không phản hồi đúng", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

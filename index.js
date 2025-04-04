const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const VIETTEL_TOKEN = process.env.VIETTEL_TOKEN;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Token"]
}));

app.use(express.json());

app.get("/api/listProvince", async (req, res) => {
  const response = await fetch("https://partner.viettelpost.vn/v2/categories/listProvince", {
    headers: {
      "Token": VIETTEL_TOKEN,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  res.json(data);
});

app.get("/api/listDistrict", async (req, res) => {
  const { provinceId } = req.query;
  const response = await fetch(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${provinceId}`, {
    headers: {
      "Token": VIETTEL_TOKEN,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  res.json(data);
});

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
    console.error("Lỗi khi gọi listWard:", err);
    res.status(502).json({ error: "Viettel không phản hồi đúng", message: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

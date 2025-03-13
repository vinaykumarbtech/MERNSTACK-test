const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const translationRoutes = require("./routes/translationRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/translate", translationRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;

const TranslationSchema = new mongoose.Schema({
  text: String,
  translatedText: String,
  sourceLang: String,
  targetLang: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Translation", TranslationSchema);

const { translateText, getHistory } = require("../controllers/translationController");
const router = express.Router();

router.post("/", translateText);
router.get("/history", getHistory);

module.exports = router;

const axios = require("axios");
const Translation = require("../models/Translation");

const translateText = async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      null,
      {
        params: {
          q: text,
          target: targetLang,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;

    const newTranslation = new Translation({
      text,
      translatedText,
      sourceLang: "auto",
      targetLang,
    });

    await newTranslation.save();
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  const history = await Translation.find().sort({ date: -1 });
  res.json(history);
};

module.exports = { translateText, getHistory };

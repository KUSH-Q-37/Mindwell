const Mood = require("../models/Mood");
const User = require("../models/User");

exports.createMood = async (req, res) => {
  try {
    const { mood, activities, notes, factors, energy, anxiety, sleepHours, physicalActivity, socialInteraction } = req.body;

    const newMood = new Mood({
      user: req.user.id,
      mood,
      activities,
      notes,
      factors,
      energy,
      anxiety,
      sleepHours,
      physicalActivity,
      socialInteraction
    });

    const savedMood = await newMood.save();

    // -- Gamification Logic --
    const user = await User.findById(req.user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isNewDay = true;
    let isConsecutiveDay = false;

    if (user.lastMoodDate) {
      const lastDate = new Date(user.lastMoodDate);
      lastDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        isNewDay = false;
      } else if (diffDays === 1) {
        isConsecutiveDay = true;
      }
    }

    if (isNewDay) {
      if (isConsecutiveDay) {
        user.currentStreak = (user.currentStreak || 0) + 1;
      } else {
        user.currentStreak = 1;
      }
      user.lastMoodDate = new Date();
      
      if ((user.currentStreak || 0) > (user.longestStreak || 0)) {
        user.longestStreak = user.currentStreak;
      }

      const newBadges = [];
      const safeBadges = user.badges || [];
      if (user.currentStreak >= 3 && !safeBadges.includes('🌟 3-Day Streak')) newBadges.push('🌟 3-Day Streak');
      if (user.currentStreak >= 7 && !safeBadges.includes('🧘 Zen Master')) newBadges.push('🧘 Zen Master');

      if (newBadges.length > 0) {
        if (!user.badges) user.badges = [];
        user.badges.push(...newBadges);
      }
      
      await user.save();
    }

    res.json(savedMood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ msg: "Mood entry not found" });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(mood);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Mood entry not found" });
    }
    res.status(500).send("Server error");
  }
};

exports.updateMood = async (req, res) => {
  try {
    let mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ msg: "Mood entry not found" });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    mood = await Mood.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(mood);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ msg: "Mood entry not found" });
    }

    if (mood.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await mood.deleteOne();
    res.json({ msg: "Mood entry removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Mood entry not found" });
    }
    res.status(500).send("Server error");
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 }).limit(1);
    const last = moods[0];

    const payload = {
      sleep_hours: last?.sleepHours || 7,
      stress_level: last?.anxiety || 5,
      exercise_minutes: last?.physicalActivity || 30,
      social_interaction_level: last?.socialInteraction || 5,
      screen_time_hours: 4,
      journal_sentiment_score: 0,
      prev_mood: last?.mood || 5
    };

    const ML_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5006';
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const response = await fetch(`${ML_URL}/predict-mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'ML Service Error');
      }
      
      res.json(await response.json());
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        throw new Error('ML Service request timed out');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('Mood Prediction failed:', err.message);
    res.status(503).json({ 
      msg: "Service unavailable", 
      error: err.message,
      tip: "If this is the first use, the AI service might be waking up. Please try again in 30 seconds."
    });
  }
};

exports.getFuturePrediction = async (req, res) => {
  try {
    const rawMoods = await Mood.find({ user: req.user.id }).sort({ date: -1 }).limit(7);
    
    // Reverse and map to feature format
    let history = rawMoods.reverse().map(m => ({
      sleep_hours: m.sleepHours || 7,
      stress_level: m.anxiety || 5,
      exercise_minutes: m.physicalActivity || 30,
      social_interaction_level: m.socialInteraction || 5,
      screen_time_hours: 4,
      journal_sentiment_score: 0,
      mood_score: m.mood || 5
    }));
    
    // Ensure we have exactly 7 entries
    while (history.length < 7) {
      history.unshift({
        sleep_hours: 7,
        stress_level: 5,
        exercise_minutes: 30,
        social_interaction_level: 5,
        screen_time_hours: 4,
        journal_sentiment_score: 0,
        mood_score: 5
      });
    }

    const ML_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5006';
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const response = await fetch(`${ML_URL}/predict_future`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Forecast failed');
      }

      res.json(await response.json());
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        throw new Error('Forecasting request timed out');
      }
      throw fetchErr;
    }
  } catch (err) {
    console.error('Future Prediction failed:', err.message);
    res.status(503).json({ 
      msg: "Forecasting unavailable",
      error: err.message,
      tip: "The AI service is currently spinning up. Please wait 30 seconds and refresh."
    });
  }
};

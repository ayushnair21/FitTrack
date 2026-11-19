require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { OAuth2Client } = require("google-auth-library"); // <-- NEW GOOGLE IMPORT

const app = express();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // <-- NEW GOOGLE CLIENT
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
    req.user = decodedUser;
    next();
  });
};

// --- API ROUTES ---

// 1. Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ message: "Fitness Platform API is connected!" });
});

// 2. Fetch Users Route
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 3. Register New User Route
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password_hash,
        profile: {
          create: {},
        },
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "User registered", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 4. Login Route
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// 5. Google Authentication Route
app.post("/api/users/google", async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Fetch user profile from Google using the frontend Access Token
    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!googleRes.ok) {
      return res
        .status(401)
        .json({ error: "Failed to verify Google access token" });
    }

    const payload = await googleRes.json();
    const { email, given_name, family_name } = payload;

    // 2. Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    // 3. If new user, create account automatically
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || "Athlete",
          lastName: family_name || "",
          password_hash: "GOOGLE_OAUTH_NO_PASSWORD",
          profile: {
            create: {},
          },
        },
      });
    }

    // 4. Generate custom JWT
    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Google login successful",
      token: authToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// 6. Get User Profile
app.get("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { profile: true },
    });

    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      profile: user.profile,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 7. Update User Profile
app.put("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    // 1. Extract the names along with the physical stats
    const { firstName, lastName, age, height, weight, goal, avatarUrl } =
      req.body;

    // 2. Update the base User model (handles the custom name change)
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
      },
    });

    // 3. Update the Profile model (handles the avatar and stats)
    const updatedProfile = await prisma.userProfile.update({
      where: { userId: req.user.userId },
      data: {
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        goal,
        avatarUrl,
      },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// 8. Log a New Workout (Protected)
app.post("/api/workouts", authenticateToken, async (req, res) => {
  try {
    const { name, exercises } = req.body;

    const newWorkout = await prisma.workout.create({
      data: {
        userId: req.user.userId,
        name,
        exercises: {
          create: exercises,
        },
      },
      include: { exercises: true },
    });

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log workout" });
  }
});

// 9. Get All User Workouts (Protected)
app.get("/api/workouts", authenticateToken, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.user.userId },
      include: { exercises: true },
      orderBy: { date: "desc" },
    });
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// 10. Update an Exercise (Protected)
app.put("/api/exercises/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { sets, reps, weight } = req.body;

    const updatedExercise = await prisma.exerciseEntry.update({
      where: { id },
      data: {
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
      },
    });

    res.json(updatedExercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update exercise" });
  }
});

// 11. Delete a Single Exercise (Protected)
app.delete("/api/exercises/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.exerciseEntry.delete({ where: { id } });
    res.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
});

// 12. Add a Single Exercise to an Existing Workout
app.post(
  "/api/workouts/:workoutId/exercises",
  authenticateToken,
  async (req, res) => {
    try {
      const { workoutId } = req.params;
      const { name, sets, reps, weight } = req.body;

      const newExercise = await prisma.exerciseEntry.create({
        data: {
          name,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(weight),
          workoutId: workoutId,
        },
      });

      res.status(201).json(newExercise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add exercise to workout" });
    }
  },
);

// 13. Delete an Entire Workout (Protected)
app.delete("/api/workouts/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.workout.delete({ where: { id } });
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

// --- INITIALIZE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

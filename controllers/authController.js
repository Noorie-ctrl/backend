import { registerUserService, loginUser, getUserDetails } from "../services/authServices.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await registerUserService(name, email, password);

    // Return user and token
    res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Login existing user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await loginUser({ email, password });

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};

// Get logged-in user details (requires JWT middleware)
export const getUserDetailsController = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const result = await getUserDetails(req.user.id);

    if (!result || result.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(400).json({ message: error.message });
  }
};

import { registerUserService, loginUser, getUserDetails} from "../services/authServices.js";


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // const { user, token } = await registerUserService(name, email, password);
    const result = await registerUserService(name, email, password);
    res.status(201).json({
      message: "User registered successfully",
      tokenL: result.token, 
      user: result.user,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await loginUser({ email, password });
    res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
export const getUserDetailsController= async (req, res) => {
  try{
    const result = await getUserDetails();
    res.status(200).json({ message: "User details fetched", ...result });
  } catch (error){
    res.status(400).json({ message: error.message });
  }
}
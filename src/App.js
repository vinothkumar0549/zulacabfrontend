import { useState } from "react";
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from "./apislice";
import CustomerDashboard from "./CustomerDashboard";
import CabDashboard from "./CabDashboard"
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("CUSTOMER");
  const [gender, setGender] = useState("MALE");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    age: "",
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [logout] = useLogoutMutation();

  const toggleForm = () => setIsLogin(!isLogin);

  const validateInput = (name, value) => {
    let errorMessage = "";

    if (!value.trim()) {
      errorMessage = `${name} is required!`;
    } else {
      switch (name) {
        case "name":
          if (!/^[A-Za-z]+$/.test(value)) errorMessage = "Only alphabets (A-Z, a-z) are allowed!";
          break;
        case "username":
          if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) errorMessage = "Gmail address end with @gmail.com";
          break;
        case "password":
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value)) {
            errorMessage = "Password must be 8-15 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)!";
          }
          break;
        case "age":
          const parsedAge = parseInt(value, 10);
          if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
            errorMessage = "Age must be a number between 18 and 100";
          }
          break;  
        default:
          break;
      }
    }
    return errorMessage;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setValidationErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if(name === "password"){
      setValidationErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const newErrors = {};
    let hasError = false;
  
    // Validate fields based on form mode
    if (isLogin) {
      // Validate only username and password
      ["username", "password"].forEach((field) => {
        const error = validateInput(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          hasError = true;
        }
      });
    } else {
      // Validate all fields for registration
      Object.keys(formData).forEach((field) => {
        const error = validateInput(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          hasError = true;
        }
      });
    }
  
    setValidationErrors(newErrors);
  
    if (hasError) return;
  
    try {
      if (isLogin) {
        const response = await login({
          username: formData.username,
          password: formData.password,
        }).unwrap();
        setUser(response);
      } else {
        const response = await register({
          user: {
            name: formData.name,
            username: formData.username,
            password: formData.password,
            age: parseInt(formData.age, 10),
            role,
            gender,
          },
        }).unwrap();
        alert("Successfully Registered...");
        setIsLogin(true);
        // Clear fields after registration
        setFormData({ name: "", username: "", password: "", age: "" });
        setValidationErrors({});
      }
    } catch (error) {
      setError(error.data?.error || "An error occurred");
    }
  };  

  const handleLogout = async () => {
    try {
      //await logout({ userid: String(user.userid), password: user.password }).unwrap();
      setUser(null);
      setFormData({ name: "", username: "", password: "", age: "" }); // Reset form data
      setValidationErrors({}); // Optional: Clear any validation messages
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (user) {
    switch (user.role) {
      case "CUSTOMER":
        return <CustomerDashboard user={user} onLogout = {handleLogout} />
      case "ADMIN":
        return <AdminDashboard user={user} onLogout = {handleLogout} />;
      case "CAB":
        return <CabDashboard user = {user} onLogout = {handleLogout} />;
      default:
        return <h2>Unknown role</h2>;
    }
  }

  return (
    <div className="container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <span className="error">{validationErrors.username}</span>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="error">{validationErrors.password}</span>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <span className="error">{validationErrors.name}</span>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              <span className="error">{validationErrors.username}</span>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="error">{validationErrors.password}</span>
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="text"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                required
              />
              <span className="error">{validationErrors.age}</span>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

          </>
        )}
        <button type="submit" disabled={loginLoading || registerLoading}>
          {isLogin ? (loginLoading ? "Logging in..." : "Login") : registerLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={toggleForm}>{isLogin ? "Register" : "Login"}</button>
      </p>
      <style>
        {`
          .error {
            color: red;
            font-size: 14px;
          }
        `}
      </style>
    </div>
  );
}

export default App;
import { useState } from "react";
import { useRegisterMutation } from "./apislice";
import "./App.css";

function CabRegister({user}) {
  const [gender, setGender] = useState("MALE");
  const [cabtype, setCabtype] = useState("SUV");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    age: "",
    cablocation: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [register, { isLoading }] = useRegisterMutation();

  const validateInput = (name, value) => {
    let errorMessage = "";
    if (!value.trim()) {
      errorMessage = `${name} is required!`;
    } else {
      switch (name) {
        case "name":
          if (!/^[A-Za-z]+$/.test(value)) errorMessage = "Only alphabets allowed";
          break;
        case "username":
          if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) errorMessage = "Must be a valid @gmail.com address";
          break;
        case "password":
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,15}$/.test(value)) {
            errorMessage = "Password must be 8-15 chars with uppercase, lowercase, number, and special char";
          }
          break;
        case "age":
          const parsedAge = parseInt(value, 10);
          if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
            errorMessage = "Age must be a number between 18 and 100";
          }
          break;
        case "cabLocation":
          if (!/^[A-Za-z\s]{1,30}$/.test(value)) {
            errorMessage = "Cab location must be letters only (max 30 characters)";
          }
          break;
        default:
          break;
      }
    }
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setValidationErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setValidationErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const newErrors = {};
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      const errorMsg = validateInput(key, formData[key]);
      newErrors[key] = errorMsg;
      if (errorMsg) hasError = true;
    });

    setValidationErrors(newErrors);
    if (hasError) return;

    try {
      const response = await register({
        user: {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          age: parseInt(formData.age, 10),
          role: "CAB",
          gender,
        },
        adminusername: user.username,
        adminpassword: user.password,
        cablocation: formData.cablocation,
        cabtype
      }).unwrap();
      alert("Successfully Registered!");
      setFormData({ name: "", username: "", password: "", age: "", cablocation: "", });
    } catch (err) {
      setError(err?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <label>Cab Location</label>
        <input
            type="text"
            name="cablocation"
            placeholder="Enter cab location"
            value={formData.cablocation}
            onChange={handleChange}
            onBlur={handleBlur}
            required
        />
        <span className="error">{validationErrors.cablocation}</span>
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
              <label>Cab Type</label>
              <select value={cabtype} onChange={(e) => setCabtype(e.target.value)}
              >
                <option value="SUV">SUV</option>
                <option value="SEDAN">SEDAN</option>
                <option value="MINI">MINI</option>
              </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <style>{`
        .error {
          color: red;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default CabRegister;

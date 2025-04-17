import React, { useState } from "react";
import { useAddlocationMutation } from "./apislice"; // update path accordingly

const AddLocation = ({user}) => {
  const [formData, setFormData] = useState({ location: "", distance: "" });
  const [addlocation, { data, isLoading, error }] = useAddlocationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await addlocation({
        locationname: formData.location,
        distance: Number(formData.distance),
        adminusername: user.username,
        adminpassword: user.password,
      }).unwrap()
      alert("New Location Added Successfully \n Location Id : " + response.locationid)
    } catch (err) { 
        alert(err?.data?.error || "Failed to Add Location");
    }
  };

  return (
    <div className="nearby-cab-form">
      <h2>Add Location Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="location"
          placeholder="Enter Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="distance"
          placeholder="Distance in KM"
          value={formData.distance}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Location</button>
      </form>

    </div>
  );
};

export default AddLocation;

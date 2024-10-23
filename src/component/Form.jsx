import React, { useEffect, useState } from "react";

const Form = () => {
  const url="https://task28-umber.vercel.app"
  // const url = "http://localhost:9000";

  const [showData, setShowData] = useState([]);
  const [data, setData] = useState({ name: "" });



  // Fetch data from db
  const getData = async () => {
    const response = await fetch(`${url}`);
    const json = await response.json();
    setShowData(json.data);
  };

  useEffect(() => {
    getData();
  }, []);



  // Add data (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await response.json();
    setData({ name: "" });
    getData();
  };



  // Delete data (DELETE)
  const handleDelete = async (id) => {
    const response = await fetch(`${url}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
    getData();
  };



  //update data
  const handleInputChange = (e, id) => {
    const updatedData = showData.map((item) =>
      item._id === id ? { ...item, name: e.target.value } : item
    );
    setShowData(updatedData);
  };

  

  
  const toggleEdit = async (id) => {
    const updatedData = showData.map((item) =>
      item._id === id ? { ...item, isEditing: !item.isEditing } : item
    );
    setShowData(updatedData);

    const updatedItem = updatedData.find((item) => item._id === id);
    console.log(updatedItem.isEditing)

  

    if (!updatedItem.isEditing) {
      const response = await fetch(`${url}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedItem.name }),
      });
      await response.json();
      getData();
    }
  };

  return (
    <div className="formDiv">
      <h2>TodoList</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter here"
          value={data.name}
          onChange={(e) => setData({ name: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>

      {showData.map((value) => (
        <div key={value._id} className="divItems">
          {value.isEditing ? (
            <input
              style={{
                borderRadius: "5px",
                border: "0.5px solid black",
                padding: "5px",
                outline: "none",
                fontSize: "15px",
              }}
              placeholder="Enter here"
              value={value.name}
              onChange={(e) => handleInputChange(e, value._id)}
            />
          ) : (
            <p>{value.name}</p>
          )}

          <div className="btnDiv">
            <button onClick={() => toggleEdit(value._id)}>Edit</button>
            <button onClick={() => handleDelete(value._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Form;

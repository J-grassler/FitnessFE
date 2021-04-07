import React, { useState } from "react";
import { fetchAPI, BASE_URL } from "../api";

const AddActivity = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { activityList, setActivityList } = props;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sendData = {
      name,
      description,
    };

    try {
      const result = await fetchAPI(`${BASE_URL}/activities`, "POST", sendData);

      if (result.error) {
        console.log("result.error = ", result.error);
        setErrorMessage(result.error);
        setName("");
        setDescription("");
        return;
      } else {
        console.log("activity list:", activityList);
        console.log("send-data:", result);
        setActivityList([...activityList, result]);
        setName("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="newActivity">
        <form onSubmit={handleSubmit} className="newActivityForm">
          <h3>Create Activity</h3>
          {errorMessage ? <h5 className="errorMessage">{errorMessage}</h5> : ""}
          <input
            type="text"
            value={name}
            placeholder="Activity Name"
            onChange={(e) => setName(e.target.value)}
          ></input>
          <textarea
            type="text"
            value={description}
            placeholder="Description of Activity"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <button className="Submit" type="submit" value="Submit">
            Add Activity
          </button>
        </form>
      </div>
    </>
  );
};

export default AddActivity;
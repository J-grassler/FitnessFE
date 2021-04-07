import React, { useState, useEffect } from "react";
import { fetchAPI, BASE_URL } from "../api";

const MyRoutines = (props) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [count, setCount] = useState("");
  const [duration, setDuration] = useState("");
  const [placeHolderActivities, setPlaceHolderActivities] = useState([]);
  const [modal, setModal] = useState(null);
  const [currentActivity, setCurrentActivity] = useState("");

  useEffect(() => {
    setName(routine.name || "");
    setGoal(routine.goal || "");
  }, []);

  const {
    addNewRoutine,
    routineList,
    user,
    routine,
    setRoutine,
    activityList,
    setRoutineList,
    isLoggedIn,
  } = props;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sendData = {
      name,
      goal,
      isPublic: true,
    };

    if (routine.id) {
      try {
        await fetchAPI(`${BASE_URL}/routines/${routine.id}`, "PATCH", sendData);
        let index = routineList.indexOf(routine);
        let updatedRoutineList = [...routineList];
        updatedRoutineList[index].name = name;
        updatedRoutineList[index].description = goal;
        setRoutineList(updatedRoutineList);
        setName("");
        setGoal("");
        setRoutine("");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const newRoutine = await fetchAPI(
          `${BASE_URL}/routines`,
          "POST",
          sendData
        );
        newRoutine.creatorName = user.username;
        console.log("the newRoutine response is:", newRoutine);
        addNewRoutine(newRoutine);
        setName("");
        setGoal("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="newRoutine">
          <form onSubmit={handleSubmit} className="newRoutineForm">
            {routine && name !== "" ? (
              <h3>Edit Routine</h3>
            ) : (
              <h3>Create Routine</h3>
            )}
            <input
              type="text"
              value={name}
              placeholder="Routine Name"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <textarea
              type="text"
              value={goal}
              placeholder="Description of Routine"
              onChange={(e) => setGoal(e.target.value)}
            ></textarea>

            <button className="Submit" type="submit" value="Submit">
              Submit
            </button>
            {routine.id && name !== "" ? (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setRoutine("");
                  setName("");
                  setGoal("");
                }}
              >
                Cancel
              </button>
            ) : null}
          </form>
        </div>
      ) : null}

      <div className="myRoutines" className="routines">
        {routineList.map((routine) => {
          return user.id === routine.creatorId ? (
            <div className="routine" key={routine.id}>
              <h2>{routine.name}</h2>
              <p>Goal: {routine.goal}</p>
              <br />
              {console.log(routine.activities)}
              {routine.activities &&
                routine.activities.map((activity, index) => {
                  return user.id === routine.creatorId ? (
                    <>
                      <div className="activity" key={index}>
                        <h2>{activity.name}</h2>
                        <p>{activity.description}</p>
                        {currentActivity.id === activity.id ? (
                          <span>
                            <input
                              type="text"
                              placeholder="Enter Rep Count"
                              onChange={(event) => setCount(event.target.value)}
                            ></input>
                            <input
                              type="text"
                              placeholder="Enter Duration"
                              onChange={(event) =>
                                setDuration(event.target.value)
                              }
                            ></input>
                            <button
                              onClick={async (event) => {
                                event.preventDefault();

                                let sendData = {
                                  activityId: activity.id,
                                  count: count,
                                  duration: duration,
                                };

                                try {
                                  await fetchAPI(
                                    `${BASE_URL}/routine_activities/${activity.routineActivityId}`,
                                    "PATCH",
                                    sendData
                                  );

                                  if (index > -1) {
                                    let newList = [...routineList];
                                    let routineIndex = newList.indexOf(routine);

                                    newList[routineIndex].activities[
                                      index
                                    ].count = count;
                                    newList[routineIndex].activities[
                                      index
                                    ].duration = duration;
                                    setRoutineList(newList);
                                  }

                                  setCurrentActivity("");
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              Submit Changes
                            </button>
                            <button
                              onClick={(event) => {
                                event.preventDefault();
                                setCurrentActivity("");
                              }}
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <>
                            {" "}
                            <span>
                              <p>
                                Do this: {activity.count}{" "}
                                {activity.count > 1 ? "times" : "time"}
                              </p>
                              <p>Duration: {activity.duration}</p>{" "}
                            </span>
                            <button
                              className="routine-activity-button"
                              onClick={(event) => {
                                event.preventDefault();
                                setRoutine(routine);
                                console.log(
                                  "activities in the routine are",
                                  routine.activities
                                );
                                setCurrentActivity(activity);
                              }}
                            >
                              Edit Activity
                            </button>
                            <button
                              className="routine-activity-button"
                              onClick={async (event) => {
                                event.preventDefault();

                                try {
                                  let url = `${BASE_URL}/routine_activities/${activity.routineActivityId}`;

                                  await fetchAPI(url, "DELETE");

                                  const newList = [...routineList];

                                  let index = newList.indexOf(routine);
                                  let activityIndex = newList[
                                    index
                                  ].activities.indexOf(activity);

                                  newList[index].activities.splice(
                                    activityIndex,
                                    1
                                  );
                                  setRoutineList(newList);
                                  setCurrentActivity("");
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              Delete Activity
                            </button>
                          </>
                        )}
                      </div>{" "}
                    </>
                  ) : null;
                })}
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setRoutine(routine);
                  console.log("the current routine is", routine.id);
                  setName(routine.name);
                  setGoal(routine.goal);
                }}
              >
                Edit Routine
              </button>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setRoutine(routine);
                  console.log("the routine is:", routine);
                  setModal(routine.id);
                  if (routine.activities) {
                    return;
                  } else {
                    let newRoutineList = [...routineList];
                    let newActivitiesList = (routine.activities = []);
                    let index = routineList.indexOf(routine);
                    routineList[index].activities = newActivitiesList;
                    newRoutineList.splice(index, 1, routine);
                    setRoutineList(newRoutineList);
                  }
                }}
              >
                Add Activities
              </button>
              <button
                onClick={async (event) => {
                  event.preventDefault();
                  setRoutine(routine);

                  try {
                    let url = `${BASE_URL}/routines/${routine.id}`;
                    const newList = [...routineList];
                    await fetchAPI(url, "DELETE");

                    let routineIndex = newList.indexOf(routine);
                    newList.splice(routineIndex, 1);
                    setRoutineList(newList);
                    setRoutine("");
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Delete Routine
              </button>
              {modal === routine.id ? (
                <div className="routine-modal">
                  <div>
                    <select id="routineActivityList" className="modal-content">
                      {activityList.map((activity, index) => {
                        return (
                          <>
                            <option
                              key={activity.id}
                              value={activity.id}
                              key={index}
                            >
                              {activity.name}
                            </option>
                          </>
                        );
                      })}
                    </select>
                    <button
                      onClick={(event) => {
                        let e = document.getElementById("routineActivityList");
                        let result = {
                          id: e.options[e.selectedIndex].value,
                          name: e.options[e.selectedIndex].innerText,
                        };

                        console.log("result is: ", result);
                        event.preventDefault();
                        let newArray = [...placeHolderActivities, result];
                        setPlaceHolderActivities(newArray);
                      }}
                    >
                      {console.log(
                        "the placeholders list is now:",
                        placeHolderActivities
                      )}
                      Select Activity
                    </button>
                    {placeHolderActivities.map((activity) => {
                      return (
                        <div
                          className="activity"
                          key={activity.id}
                          value={activity.id}
                        >
                          <p>{activity.name}</p>

                          <span>
                            <input
                              type="text"
                              placeholder="Enter Rep Count"
                              onChange={(event) => setCount(event.target.value)}
                            ></input>
                            <input
                              type="text"
                              placeholder="Enter Duration"
                              onChange={(event) =>
                                setDuration(event.target.value)
                              }
                            ></input>
                            <button
                              onClick={async (event) => {
                                event.preventDefault();

                                let sendData = {
                                  activityId: activity.id,
                                  count: count,
                                  duration: duration,
                                };

                                try {
                                  await fetchAPI(
                                    `${BASE_URL}/routines/${routine.id}/activities`,
                                    "POST",
                                    sendData
                                  );
                                  let list = [...placeHolderActivities];
                                  let index = list.indexOf(activity);
                                  list.splice(index, 1);
                                  setPlaceHolderActivities(list);

                                  let newActivity = {
                                    id: activity.id,
                                    name: activity.name,
                                    description: activity.description,
                                    duration: duration,
                                    count: count,
                                    routineActivityId:
                                      activity.routineActivityId,
                                  };

                                  const newList = [...routineList];
                                  let idx = newList.indexOf(routine);
                                  console.log("the index of the push is", idx);
                                  console.log(
                                    "the newList[index] is",
                                    newList[idx]
                                  );
                                  newList[idx].activities.push(newActivity);
                                  setRoutineList(newList);

                                  if (placeHolderActivities.length < 0) {
                                    setModal([]);
                                  }
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              Add to Routine
                            </button>
                            <button
                              onClick={(event) => {
                                event.preventDefault();
                                let list = [...placeHolderActivities];
                                let index = list.indexOf(activity);
                                list.splice(index, 1);
                                setPlaceHolderActivities(list);
                                console.log("the current routine is:", routine);
                              }}
                            >
                              Delete Activity
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            ""
          );
        })}
      </div>
    </>
  );
};

export default MyRoutines;
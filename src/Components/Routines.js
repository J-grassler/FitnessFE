import React from "react";

const Routines = (props) => {
  const { routineList, filterTerm, setFilterTerm } = props;

  return (
    <div className="routines">
      {routineList
        .filter(function (routine) {
          return (
            routine.creatorName
              .toLowerCase()
              .includes(filterTerm.toLowerCase()) ||
            routine.name.toLowerCase().includes(filterTerm.toLowerCase())
          );
        })
        .map((routine, index) => {
          return (
            <div className="routine" key={index}>
              <h2>{routine.name}</h2>
              <p>Goal: {routine.goal}</p>
              <p>
                Created by:{""}
                <span>
                  <a
                    className="tag"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setFilterTerm(routine.creatorName);
                    }}
                  >
                    {""}
                    {routine.creatorName}
                  </a>
                </span>
              </p>
              {routine.activities && routine.activities.length > 0 ? (
                <h3>Activities in this Routine:</h3>
              ) : null}
              {routine.activities &&
                routine.activities.map((activity, index) => {
                  return (
                    <div className="activity" key={index}>
                      <h3>{activity.name}</h3>
                      <p>{activity.description}</p>
                      <p>
                        Do this: {activity.count}{" "}
                        {activity.count > 1 ? "times" : "time"}
                      </p>
                      <p>Duration: {activity.duration}</p>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

export default Routines;
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { fetchAPI, BASE_URL } from "./api";
import { Activities, MyRoutines, Routines, Auth, Search } from "./Components";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import { clearToken } from "./api";
import Photo from "./kettles.jpg";

const App = () => {
  const [routineList, setRoutineList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [myRoutines, setmyRoutines] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [user, setUser] = useState({});
  const [routine, setRoutine] = useState("");

  useEffect(() => {
    fetchAPI(BASE_URL + `/routines`)
      .then((data) => {
        setRoutineList(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAPI(BASE_URL + `/activities`)
      .then((data) => {
        setActivityList(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const resp = await fetchAPI(BASE_URL + `/users/me`);
      const user = resp;
      setUser(user);
    }
    fetchData();
  }, [isLoggedIn]);

  const addNewRoutine = (newRoutine) => {
    return setRoutineList([newRoutine, ...routineList]);
  };

  console.log("the routine list is:", routineList);

  let history = useHistory();

  return (
    <div className="App">
      <header>
        <h1>Welcome to FitnessTrackr</h1>
        <nav>
          <Link to="/">Home </Link>
          <Link to="/Activities"> Activities </Link>
          <Link to="/Routines"> Routines </Link>
          {isLoggedIn ? (
            <>
              {" "}
              <Link to="/MyRoutines"> My Routines</Link>
            </>
          ) : (
            ""
          )}
        </nav>

        {isLoggedIn ? (
          <>
            <div className="authenticated-nav">
              <h1 className="loginMessage">{message}</h1>

              <button
                className="logout-button"
                onClick={() => {
                  clearToken();
                  setIsLoggedIn(false);
                  setMessage("");
                  history.push("/");
                  setRoutine("");
                }}
              >
                LOG OUT
              </button>
            </div>
          </>
        ) : (
          <Auth
            setIsLoggedIn={setIsLoggedIn}
            isLoggedIn={isLoggedIn}
            message={message}
            setMessage={setMessage}
          />
        )}
      </header>
      <main>
        <Route exact path="/">
          <img className="homePhoto" src={Photo} alt="Photo of kettlebells" />
        </Route>
        <Route exact path="/Activities">
          <Search filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
          <Activities
            activityList={activityList}
            isLoggedIn={isLoggedIn}
            setActivityList={setActivityList}
            filterTerm={filterTerm}
            setFilterTerm={setFilterTerm}
          />
        </Route>
        <Route exact path="/Routines">
          <Search filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
          <Routines
            routineList={routineList}
            setRoutineList={setRoutineList}
            filterTerm={filterTerm}
            setFilterTerm={setFilterTerm}
            isLoggedIn={isLoggedIn}
          />
        </Route>
        <Route exact path="/MyRoutines">
          <MyRoutines
            routineList={routineList}
            setRoutineList={setRoutineList}
            myRoutines={myRoutines}
            setmyRoutines={setmyRoutines}
            addNewRoutine={addNewRoutine}
            user={user}
            routine={routine}
            setRoutine={setRoutine}
            activityList={activityList}
            isLoggedIn={isLoggedIn}
          />
        </Route>
      </main>
    </div>
  );
};

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("app")
);
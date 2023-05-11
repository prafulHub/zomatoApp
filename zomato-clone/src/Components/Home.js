
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Header from "./Header";
import '../Styles/HomePage.css'
import { BASE_URL } from './API_Config/ApiBrowse';




let Home = () => {

  const navigate = useNavigate();
  let [locationList, setlocationList] = useState([]);
  let [mealTypeList, setMealTypeList] = useState([]);
  let getlocationList = async () => {
    let url = `${BASE_URL}get-location-list`;
    let { data } = await axios.get(url);
    if (data.status === true) {
      setlocationList([...data.result]);
    } else {
      setlocationList([]);
    }
  };

  let getMealTypeList = async () => {
    let url = `${BASE_URL}get-meal-type-list`;
    let { data } = await axios.get(url);
    if (data.status === true) {
      setMealTypeList([...data.result]);
    } else {
      setMealTypeList([]);
    }

  }
  useEffect(() => {
    getlocationList();
    getMealTypeList();
  }, []);

  return (
    <div>
      <section className="row main-section  ">
      <header className="col-12 pt-3 d-flex justify-content-center">
          {/* <div className="container d-lg-flex justify-content-end d-none">
            <button className="btn text-white me-3">Login</button>
            <button className="btn text-white border border-white">
              Create an account
            </button>
          </div> */}
           <Header />
        </header>
        <section className="col-12 d-flex flex-column align-items-center justify-content-center">
          <p className="brand-name fw-bold my-lg-2 mb-0" onClick={() => { navigate("/") }}>e!</p>
          <p className="h1 text-white my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
          <div className="search w-50 d-flex mt-3  ">
            <select className="locationDropdown form-control py-2 rounded-0 mb-3 mb-lg-0 w-50 me-lg-3  px-3">
              <option>- Please type a location -</option>
              {
                locationList.map((location, index) => {
                  return <option key={index} value={location.location_id}>{location.name}, {location.city}</option>
                })
              }
            </select>
            <div className="w-75 input-group  ">
              <span className="input-group-text bg-white rounded-0 pointer">
                <i className="fa fa-search text-primary rounded-0" />
              </span>
              <input type="text" className="form-control py-2 px-3 rounded-0" placeholder="Search for restaurants" />

            </div>
          </div>
        </section>
      </section>
      <section>
        <div className="container ">
          <div className="Quick-section mt-3 mx-5">
            <h3>Quick Searches</h3>
            <span>Discover restaurants by type of meal</span>
          </div>
          <div className="row d-flex justify-content-center flex-wrap">
            {
              mealTypeList.map((mealType, index) => {

                return (
                  <div key={index} className=" col-lg-3 col-9 col-sm-7 col-md-5 shadow border-0 mx-3 my-3 d-flex" onClick={() => {
                    navigate("/search/" + mealType.meal_type + "/" + mealType.name);
                  }}>
                    <div className="food-image">
                      <img src={"/images/" + mealType.image} alt="" height={140} width={140} />
                    </div>
                    <div className="food-datails mt-3">
                      <strong>{mealType.name}</strong>
                      <p>{mealType.content}</p>
                    </div>
                  </div>
                );
              })
            }

          </div>
        </div>
      </section>
    </div>
  )

}

export default Home

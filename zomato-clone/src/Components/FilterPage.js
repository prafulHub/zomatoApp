import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../Components/API_Config/ApiBrowse";
import axios from "axios";
import Header from "./Header";
import '../Styles/Filter.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const { id,type } = useParams(); // {id:1}
  let [filter, setFilter] = useState({
    meal_type: id,
    page: 1,
  });

  let [restList, setRestList] = useState([]);
  let[,_filter]=useState([]);
  let [locationList, setLocationList] = useState([]);
  let[city,setCity] = useState("Near By");
  let [pageCount, setPageCount] = useState(0);
  let [page, setPage] = useState(1);


  let getLocationList = async () => {
    let url = `${BASE_URL}get-location-list`;
    let { data } = await axios.get(url);
    if (data.status === true) {
      setLocationList([...data.result]);
    } else {
      setLocationList([]);
    }
  };
  let getFilterData = async () => {
    let url = `${BASE_URL}filter`;
    let { data } = await axios.post(url, filter);
    console.log(data);
    if (data.status === true) {
      setRestList([...data.result]);
      setPageCount(data.pageCount);
      setPage(data.page - 1);
    } else {
      setRestList([]);
      setPageCount(0);
      setPage(0);
    }
  };



  
  let setFilterLogic = (event, option,page = 0) => {
    let { value } = event.target;
    console.log(value);
    switch (option) {
      case "location":
        _filter["location"] = value;
        break;
        case "page":
        _filter["page"] = page;
        break;
      case "sort":
        _filter["sort"] = value;
        break;
      case "cuisine":
        let cuisine = [2];
        _filter["cuisine"] = cuisine;
        break;
      case "cost":
        let cost = value.split("-");
        _filter["lcost"] = cost[0];
        _filter["hcost"] = cost[1];
        break;
    }
    setFilter({ ...filter, ..._filter });
  };


  useEffect(() => {
    getLocationList();
  }, []);
  useEffect(() => {    
    getFilterData();
    if (filter.location) {
        let location = locationList.find((value) => {
            return Number(filter.location) === Number(value.location_id);
        });
        if (location) {
            setCity(location.name + "," + location.city);
        } else {
            setCity("Near By");
        }
    }


  }, [filter]);
  
  return (
    <>
     <header>
                <nav>
                    <div className="container-fluid">
                        <div className="row bg-danger justify-content-center">
                            <Header />
                        </div>
                        </div>
                </nav>
            </header>
      <div className="container-fluid">
    
        {/* <!-- section --> */}
        <div className="row">
          <div className="col-12 px-5 pt-4">
            <p className="h3">{type} Places In {city}</p>
          </div>
          {/* <!-- food item --> */}
          <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
            <div className="food-shadow col-12 col-lg-3 col-md-4 me-5 p-3 mb-4">
              <div className="d-flex justify-content-between">
                <p className="fw-bold m-0">Filter</p>
                <button
                  className="d-lg-none d-md-none btn"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFilter"
                  aria-controls="collapseFilter"
                >
                  <span className="fa fa-eye"></span>
                </button>
              </div>
              {/* <!-- Collapse start  --> */}
              <div className="collapse show" id="collapseFilter">
                <div>
                  <label htmlFor="" className="form-label">
                    Select Location
                  </label>
                  <select
                    className="form-select form-select-sm"
                    name="location"
                    onChange={(event) => setFilterLogic(event, "location")}
                  >
                    <option value="">Select Location</option>
                    {locationList.map((location, index) => {
                      return (
                        <option key={index} value={location.location_id}>
                          {location.name}, {location.city}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <p className="mt-4 mb-2 fw-bold">Cuisine</p>
                <div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" 
                    
                     value='1'
                     name="cuisine"
                     onChange={(event) => setFilterLogic(event, "cuisine")}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      North Indian
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" 
                     value='2'
                     name="cuisine"
                     onChange={(event) => setFilterLogic(event, "cuisine")}/>
                    <label htmlFor="" className="form-check-label ms-1">
                      South Indian
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" />
                    <label htmlFor="" className="form-check-label ms-1">
                    Chinese
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" />
                    <label htmlFor="" className="form-check-label ms-1">
                    Fast Food
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" />
                    <label htmlFor="" className="form-check-label ms-1">
                      Panjabi Food
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" />
                    <label htmlFor="" className="form-check-label ms-1">
                    Street Food
                    </label>
                  </div>
                </div>
                <p className="mt-4 mb-2 fw-bold">Cost For Two</p>
                <div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input"
                      value='0-500'
                      onChange={(event) => setFilterLogic(event, "cost")} 
                      name="cost" />
                    <label htmlFor="" className="form-check-label ms-1">
                      less then 500
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input" 
                     value='500-1000'
                     onChange={(event) => setFilterLogic(event, "cost")} 
                     name="cost"/>
                    <label htmlFor="" className="form-check-label ms-1">
                      500 to 1000
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input"
                     value=' 1000-1500'
                     onChange={(event) => setFilterLogic(event, "cost")} 
                     name="cost" />
                    <label htmlFor="" className="form-check-label ms-1">
                      1000 to 1500
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input" 
                    value='  1500-2000'
                    onChange={(event) => setFilterLogic(event, "cost")} 
                    name="cost" />
                    <label htmlFor="" className="form-check-label ms-1">
                      1500 to 2000
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input" 
                    
                    value='2000'
                    onChange={(event) => setFilterLogic(event, "cost")} 
                    name="cost"/>
                    <label htmlFor="" className="form-check-label ms-1">
                      2000+
                    </label>
                  </div>
                </div>
                <p className="mt-4 mb-2 fw-bold">Sort</p>
                <div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="sort"
                      value="1"
                      onChange={(event) => setFilterLogic(event, "sort")}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      Price low to high
                    </label>
                  </div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="sort"
                      value="-1"
                      onChange={(event) => setFilterLogic(event, "sort")}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      Price high to low
                    </label>
                  </div>
                </div>
              </div>
              {/* <!-- Collapse end --> */}
            </div>
            {/* <!-- search result --> */}
            <div className="col-12 col-lg-8 col-md-7">
              {restList.map((restaurant, index) => {
                return (
                  <div
                  onClick={() => { navigate("/reastaurant/" + restaurant._id) }}
                    key={index}
                    className="col-12 food-shadow p-4 mb-4"
                  >
                    <div className="d-flex align-items-center">
                      <img src={"/images/" + restaurant.image} className="food-item" alt="" />
                      <div className="ms-5">
                        <p className="h4 fw-bold">
                          {restaurant.name} ({restaurant.aggregate_rating})
                        </p>
                        <span className="fw-bold text-muted">
                          {restaurant.locality}
                        </span>
                        <p className="m-0 text-muted">
                          <i
                            className="fa fa-map-marker fa-2x text-danger"
                            aria-hidden="true"
                          ></i>
                          {restaurant.locality}, {restaurant.city}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex">
                      <div>
                        <p className="m-0">CUISINES:</p>
                        <p className="m-0">COST FOR TWO:</p>
                      </div>
                      <div className="ms-5">
                        <p className="m-0 fw-bold">
                          {restaurant.cuisine
                            .map((cuisine_name) => cuisine_name.name)
                            .join(", ")}
                        </p>
                        <p className="m-0 fw-bold">
                          <i className="fa fa-inr" aria-hidden="true"></i>
                          {restaurant.min_price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="col-12 pagination d-flex justify-content-center">
                <ul className="pages">
                {Array.from(Array(pageCount).keys()).map((value, index) => {
                    return (
                      <li
                        key={index}
                        className={page === index ? "active" : ""}
                        onClick={() =>
                          setFilterLogic(
                            { target: { value: 0 } },
                            "page",
                            index + 1
                          )
                        }
                      >
                        {value + 1}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
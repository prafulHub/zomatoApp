import '../Styles/HomePage.css'
import '../Styles/Restaurant.css'
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL,checkLogin } from './API_Config/ApiBrowse';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Header from "./Header";




const Restaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  let [toggle, setToggle] = useState(true);
  let [isLogin, setIsLogin] = useState(checkLogin());

  let [totalPrice, setTotalPrice] = useState(0);
  let [orderUser,setOrderUser]= useState({
    username: "",
    email: "",
    address: "amravat",
    mobile: "",

  })
  useEffect(() => {
    if (isLogin) {
      setOrderUser({
        username: isLogin.name,
        email: isLogin.email,
        mobile: "",
        address: "",
      });
    }
  }, [isLogin]);

  let initRestuarant = {

    _id: 0,
    name: "",
    city: "",
    location_id: 0,
    city_id: 0,
    locality: "",
    thumb: [],
    aggregate_rating: 0,
    rating_text: "",
    min_price: 0,
    contact_number: "",
    cuisine_id: [],
    cuisine: [],
    image: "",
    mealtype_id: 0

  }
  let [restaurantDetails, setRestaurantDetails] = useState({
    ...initRestuarant,
  });
  let [restaurantMenu, setRestaurantMenu] = useState([]);

  let getRestaurantDetails = async () => {
    // get data of single restaurant
    let url = `${BASE_URL}get-restaurant-details-by-id/${id}`;
    let { data } = await axios.get(url);

    if (data.status === true) {
      setRestaurantDetails({ ...data.result });
    } else {
      setRestaurantDetails({ ...initRestuarant });
    }
  };

  let manageIncQty = (index) => {
    let _restaurantMenu = [...restaurantMenu];
    _restaurantMenu[index].qty += 1;
    let newTotal = totalPrice + _restaurantMenu[index].price;
    setTotalPrice(newTotal);
    setRestaurantMenu(_restaurantMenu);
  };

  let manageDecQty = (index) => {
    let _restaurantMenu = [...restaurantMenu];
    _restaurantMenu[index].qty -= 1;
    let newTotal = totalPrice - _restaurantMenu[index].price;
    setTotalPrice(newTotal);
    setRestaurantMenu(_restaurantMenu);
  };

  let getMenuItemsList = async () => {

    let url = `${BASE_URL}get-menu-items-by-restaurant-id/${id}`;
    let { data } = await axios.get(url);
    console.log(data);
    if (data.status === true) {
      setRestaurantMenu([...data.result]);
    } else {
      setRestaurantMenu([]);
    }
  }

  useEffect(() => {
    getMenuItemsList();
    getRestaurantDetails();

  }, []);
  
  let makePayment = async () => {
    //  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    // await loadScript();
    try {
      let { data } = await axios.post(BASE_URL + "create-order", {
        amount: totalPrice,
      });
      let { order } = data;

      var options = {
        key: "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in paise
        currency: order.currency,
        name: "Zomato Clone",
        description: "Online Payment",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async (response) => {
          let { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          // alert(response.razorpay_payment_id); // payment_id
          // alert(response.razorpay_order_id); // order_id
          // alert(response.razorpay_signature); // signature === Alg(payment_id + order_id + sec_key)

          let userOrders = restaurantMenu.filter((menu) => {
            return menu.qty > 0;
          });
          let sendData = {
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            signature: razorpay_signature,
            order_list: userOrders,
            total: totalPrice,
            user_email: orderUser.email,
            mobile: orderUser.mobile,
            username: orderUser.username,
            address: orderUser.address,
          };
          let { data } = await axios.post(
            BASE_URL + "verify-payment",
            sendData
          );
          console.log(data);
          if (data.status === true) {
            alert("Payment done successfully");
            window.location.assign("/");
          } else {
            alert("Payment Fail, Try Again");
          }
        },
        prefill: {
          name: orderUser.username,
          email: orderUser.email,
          contact: orderUser.mobile,
        },
      };
      try {
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      } catch (error) {
        alert("Unable to load try again");
      }
    } catch (error) {
      alert("Server error");
      console.log(error);
    }
  };

  let inputChange = (event) => {
    console.log(event);
    let { value, name } = event.target; // value => user input
    orderUser[name] = value;
    setOrderUser({ ...orderUser });
  };


  return (
    <div>

      <div
        className="modal fade d-felx justify-content-center mt-5 align-itme-center"
        id="carouselMenuModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  px-5 p-3  bg-black  modal-lg">
          <div className="modal-content px-5  bg-black">
            <div className="modal-body px-5  bg-black">
              <Carousel
                infiniteLoop={true}
                showThumbs={false}
                interval={2000}
                autoPlay={true}
              >
                {restaurantDetails.thumb.map((value, index) => {
                  return (
                    <div key={index}>
                      <img
                        src={"/images/" + value}
                        className="d-block w-100"
                        alt="..."
                      />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalAccountId" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Order Details.</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">User Name.</label>
                  <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"
                  value={orderUser.username} onChange={()=>{}}disabled />


                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Enter Email address</label>
                  <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                  value={orderUser.email} onChange={()=>{}}  />
                
                </div>
                <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Mobile</label>
                   <input type="number"className="form-control" aria-describedby="emailHelp" value={orderUser.mobile}
                  name="mobile"
                  onChange={inputChange}
                />
                   </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label"> Enter Order Place Address</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
                  value={orderUser.address} onChange={()=>{}} />
                </div>


              </form>

            </div>
            <div className="p-3 d-flex justify-content-between">
              <button className="btn btn-primary" data-bs-target="#resMenuModal" data-bs-toggle="modal">Back to Menu</button>
              <button className="btn btn-success"  onClick={makePayment}>Pay Now</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="resMenuModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{restaurantDetails.name}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">

              {
                restaurantMenu.map((menuItem, index) => {
                  return (
                    <div key={index} className="row p-2" >
                      <div className="col-8">
                        <p className="mb-1 h6">{menuItem.name}</p>
                        <p className="mb-1"> ₹.{menuItem.price} only.</p>
                        <p className="small text-muted">{menuItem.description}</p>
                      </div>
                      <div className="col-4 d-flex justify-content-end">
                        <div className="menu-food-item">
                          <img src={"/images/" + menuItem.image} alt="" />
                          {menuItem.qty <= 0 ? (
                            < button onClick={() => manageIncQty(index)}
                              className="btn btn-primary btn-sm add"> Add </button>
                          ) : (
                            <div className="order-item-count section  ">
                              <span className="hand rounded-2  border-1 fw-bolder  p-2" onClick={() => manageDecQty(index)}> - </span>
                              <span className=" rounded-2  border-1 fw-bolder   p-2">{menuItem.qty}</span>
                              <span className="hand rounded-2  border-1 fw-bolder   p-2" onClick={() => manageIncQty(index)}> + </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <hr className=" p-0 my-2" />
                    </div>
                  );
                })}
            </div>
            <div className="modal-footer d-flex justify-content-between p-3 pt-0">
              <h3>Total: {totalPrice}</h3>
              {totalPrice > 0 ? (
                <button
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#modalAccountId">
                  Process
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <header>
                <nav>
                    <div className="container-fluid">
                        <div className="row bg-danger justify-content-center">
                            <Header />
                        </div>
                        </div>
                </nav>
            </header>
      <section>
        <div className="container  p-5">
          <div className="row shadow p-5">
            <div className="col breakfat position-relative">
              <img src={"/images/" + restaurantDetails.image} alt="" height={400} width={1000} />
              <button className="gallery-btn position-absolute " data-bs-toggle="modal" data-bs-target="#carouselMenuModal">Click To Get Image Gallery </button>
            </div>
            <div className="food-conents mt-3">
              <h3>{restaurantDetails.name}</h3>
              <div className="order-btn text-end">

{isLogin ? (
                <button data-bs-toggle="modal"  data-bs-target="#resMenuModal" type="button" className="bg-success"
                >Place Online Order</button>
):(
  <button
  className="btn btn-danger align-self-start"
  role="button"
>
  Please Login First
</button>
)

}




              </div>
              <div className="Restro-details">
                <div className="order p-2 d-flex">

                  <div className="overview">
                    <p onClick={() => setToggle(true)} className={toggle ? "border-bottom border-3 border-danger " : null}><strong>Overview</strong></p>
                  </div>

                  <div className="contact contact-detalis">
                    <p onClick={() => setToggle(false)} className={!toggle ? "border-bottom border-3 border-danger " : null}> <strong>Contact</strong></p>
                  </div>

                </div>
                <hr />
                <div className="food-about mt-2">

                  {
                    toggle ? (
                      <div className="overview">
                        <h4>About this place</h4>
                        <div className="fast-food">
                          <p><strong>Cuisine</strong> </p>
                          <p>{restaurantDetails.cuisine.map((cuisine_name) => cuisine_name.name).join(",")}</p>
                        </div>
                        <div className="cost">
                          <p><strong>Average Cost</strong> </p>
                          <p>₹ {restaurantDetails.min_price} only. for two peoples(approx.)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="contact-details mt-4">
                        <h4>About this place</h4>
                        <div className="fast-food">
                          <p><strong> Phone Number</strong> </p>
                          <p>+{restaurantDetails.contact_number}</p>
                        </div>
                        <div className="cost">
                          <p><strong>Adress</strong> </p>
                          <p>{restaurantDetails.locality},  {restaurantDetails.city}</p>
                        </div>
                      </div>
                    )
                  }




                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )

}

export default Restaurant

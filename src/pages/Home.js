import React,{ useEffect,useState }from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { hideLoading,showLoading } from '../redux/alertsSlice';
import { useDispatch } from 'react-redux';
import { message, Row,Col} from 'antd';
import Bus from '../components/Bus';
import axios from 'axios'
function Home() {
  const dispatch = useDispatch();
   const [buses, setBuses] = useState([]);
   const [filters, setFilters] = useState({ from: "", to: "", journeyDate: "" });
  const  user  = useSelector((state) => state.user);
  const getBuses = async ()=>{
    const tempFilters = { }
    Object.keys(filters).forEach((key)=>{
     if(filters[key]){
      tempFilters[key] = filters[key];
     }
    });
    try{
    dispatch(showLoading());
    const response = await axios.post(
      "https://busbackend-y1x0.onrender.com/api/buses/get-all-buses",
      tempFilters,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    dispatch(hideLoading());
    if(response.data.success){
      setBuses(response.data.data);
    }
    else{
      message.error(response.data.message);
    }
    }catch(error){
      dispatch(hideLoading());
      message.error(error.message);
    }
  } 
  const changeFilter = (e) => {
    setFilters({
      ...filters,
      to: e.target.value,
    });
  };
  
  useEffect(()=>{
      getBuses();
    },[filters])
    
  return (
    <div>
      <div className="my-3 py-1">
        <Row gutter={10} align="center">
          <Col lg={6} sm={24}>
            <input type="text" 
            placeholder="From"
            value={filters.from}
            onChange={(e)=>setFilters({
            ...filters,
            from : e.target.value
            })}
            />
          </Col>
          <Col lg={6} sm={24}>
            <input type="text" 
            placeholder="To"
            value={filters.to}
            onChange={changeFilter}
            />
          </Col>
          <Col lg={6} sm={24}>
            <input type="date" 
            placeholder="Date"
            value={filters.journeyDate}
            onChange={(e)=>setFilters({
            ...filters,
            journeyDate: e.target.value,
            })}
            />
          </Col>
          <Col lg={6} sm={24}>
          <div className="d-flex" style={{ gap: '10px' }}>
          <button
          className="primary-btn"
          onClick={() => getBuses()}
          >
          Filter
         </button>
         <button
       className="outlined px-3"
        onClick={() =>
         setFilters({
        from: "",
        to: "",
        journeyDate: "",
         })
       }
       >
       Clear
       </button>
         </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[15,15]}>
          {buses
          .filter((bus)=>bus.status === "yet to start")
          .map((bus)=>(
           <Col lg={12} xs={24} sm={24}>
            <Bus bus={bus}/>
           </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;

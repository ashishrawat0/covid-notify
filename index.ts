import axios from "axios";
import e from "express";
import moment from "moment";

const getAvailabilty = () => {
  const url =
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin";
  const pincode = 160019;
  setInterval(async () => {
    console.log("started");
    const currentDate = new Date();
    const todayDate = currentDate.toISOString().slice(0, 10);
    let newDate = todayDate.split("-");
    var today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();

    const date = dd + "-" + mm + "-" + yyyy;
    try {
      const resp = await axios.get(url, {
        params: {
          pincode,
          date,
        },
        headers:{
          'User-Agent': "PostmanRuntime/7.26.8",
        }
      });
      console.log(resp.data);
      debugger
      var available_places:any ={}
      if(resp.data){
        var details:any = []
        var centerDetails:any = {}
        resp.data.centers.forEach((center:any) => {
          details = []
            center.sessions.forEach((e:any) => {
              if(e.available_capacity>=0 && e.min_age_limit==45){
                console.log('vaccine Available')
                details.push({'date':e.date,'total_vaccine': e.available_capacity,"minimum_age":e.min_age_limit,"time":e.slots})
              }
            });
            centerDetails[center.name]=details;
        });
        available_places['centerDetails'] = centerDetails;
      }
      else{
        console.log('Modi ji ne vaccine nahi bheji')
      }

    } catch (err) {
      console.log(err);
    }
  }, 9000);
};

getAvailabilty();

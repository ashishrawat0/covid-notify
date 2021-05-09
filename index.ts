import axios from "axios";
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const getAvailabilty = async () => {
  const url =
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin";
  const pincode = 160019;
  setInterval(async () => {
    console.log("started");
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
        headers: {
          "User-Agent": "PostmanRuntime/7.26.8",
        },
      });
      console.log(resp.data);
      debugger;
      var available_places: any = {};
      if (resp.data) {
        let isAvailable = false;
        var details: any = [];
        var centerDetails: any = {};
        resp.data.centers.forEach((center: any) => {
          details = [];
          center.sessions.forEach(async (e: any) => {
            if (e.available_capacity >= 0 && e.min_age_limit == 18) {
              console.log("vaccine Available");
              details.push({
                date: e.date,
                total_vaccine: e.available_capacity,
                minimum_age: e.min_age_limit,
                time: e.slots,
              });
              isAvailable = true;
            }
          });
          centerDetails[center.name] = details;
        });
        available_places["centerDetails"] = centerDetails;
        if (isAvailable) {
          sgMail.setApiKey(process.env.key);
          const msg = {
            to: process.env.emailReceive, 
            from: process.env.emailSender,
            subject: "Vaccine aagyi salle",
            text: JSON.stringify(available_places),
          };
          sgMail
            .send(msg)
            .then(() => {
              console.log("Email sent");
            })
            .catch((error:any) => {
              console.error(error);
            });
        }
      } else {
        console.log("Modi ji ne vaccine nahi bheji");
      }
    } catch (err) {
      console.log(err);
    }
  }, 190000);
};

getAvailabilty();

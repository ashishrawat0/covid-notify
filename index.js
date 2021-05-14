"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
require("dotenv").config();
var sgMail = require("@sendgrid/mail");
var getAvailabilty = function () {
    debugger;
    var url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict";
    var district_id = 108;
    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var today, dd, mm, yyyy, date, resp, available_places, isAvailable_1, details, centerDetails, msg, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("started");
                    today = new Date();
                    dd = String(today.getDate()).padStart(2, "0");
                    mm = String(today.getMonth() + 1).padStart(2, "0");
                    yyyy = today.getFullYear();
                    date = dd + "-" + mm + "-" + yyyy;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url, {
                            params: {
                                district_id: district_id,
                                date: date,
                            },
                            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' },
                        })];
                case 2:
                    resp = _a.sent();
                    console.log(resp.data);
                    debugger;
                    available_places = {};
                    if (resp.data) {
                        isAvailable_1 = false;
                        details = [];
                        centerDetails = {};
                        resp.data.centers.forEach(function (center) {
                            details = [];
                            center.sessions.forEach(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (e.available_capacity > 0 && e.min_age_limit == 18) {
                                        console.log("vaccine Available");
                                        details.push({
                                            date: e.date,
                                            total_vaccine: e.available_capacity,
                                            minimum_age: e.min_age_limit,
                                            time: e.slots,
                                        });
                                        isAvailable_1 = true;
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            centerDetails[center.name] = details;
                        });
                        available_places["centerDetails"] = centerDetails;
                        if (isAvailable_1) {
                            sgMail.setApiKey(process.env.key);
                            msg = {
                                to: process.env.emailReceive,
                                from: process.env.emailSender,
                                subject: "Vaccine aagyi salle",
                                text: JSON.stringify(available_places),
                            };
                            sgMail
                                .send(msg)
                                .then(function () {
                                console.log("Email sent");
                            })
                                .catch(function (error) {
                                console.error(error);
                            });
                        }
                    }
                    else {
                        console.log("Modi ji ne vaccine nahi bheji");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, 900000);
};
getAvailabilty();

import express from "express";
import * as CntrolrFun from "../../Controller/Food/client.js";

const foodClientRoutes = express.Router();

foodClientRoutes.get("/getFoodCrdDta", CntrolrFun.GettingFoodCrdDta);
foodClientRoutes.post("/getFoodWholeDta", CntrolrFun.GettingFoodWholeData);
foodClientRoutes.post("/reportServiceLanding", CntrolrFun.ReportServiceLanding);
foodClientRoutes.post("/placeOrder", CntrolrFun.PlaceOrder);
foodClientRoutes.post("/getOrders", CntrolrFun.GetOrdersByService);
foodClientRoutes.post("/updateOrderStatus", CntrolrFun.UpdateOrderStatus);
foodClientRoutes.post("/bookTable", CntrolrFun.BookTable);
foodClientRoutes.post("/food/changeRatingData", CntrolrFun.ChangeFoodRating);
export default foodClientRoutes;

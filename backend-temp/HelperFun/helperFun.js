import JWT from "jsonwebtoken"
import { Colleges, Schools } from "../Models/Schl&ClgSchemeas.js";
import { Emergencies, Pharmacies, Specialists } from "../Models/HealthModels.js";
import { ObjectId } from "mongodb";

// Function that help to decode the JWT token:
export const DecodeTheToken = (token) => {
    try {
        const decoded = JWT.verify(token, process.env.JWT_KEY);
        return decoded;
    } catch (error) {
        return undefined;
    }
}

// Getting the specfic url of cloudinary image:
export function getPublicIdFromUrl(imageUrl) {
    if (!imageUrl) return null;

    if (!imageUrl.includes("res.cloudinary.com")) {
        return null;
    }

    const urlWithoutQuery = imageUrl.split("?")[0];
    const splitOnUpload = urlWithoutQuery.split("/upload/");

    if (splitOnUpload.length < 2) return null;

    let pathWithExt = splitOnUpload[1];

    pathWithExt = pathWithExt.replace(/^v\d+\//, "");

    return pathWithExt.replace(/\.[^/.]+$/, "");
}

export const getCollections = (req) => {
    const db = req.app.locals.db;

    return {
        ADMINS: db.collection(process.env.ACCOUNTS_COLLECTION || "Accounts"),
        NRs: db.collection(process.env.NSPR_C),
        SCHOOLS: db.collection(process.env.S_C),
        COLLEGE: db.collection(process.env.C_C),
        USER: db.collection(process.env.ACCOUNTS_COLLECTION || "Accounts"),
        ORDERS: db.collection(process.env.ORDERS_C || "Orders"),
        RESERVATIONS: db.collection(process.env.RESERVATIONS_C || "Reservations")
    };
};

// Resolve the appropriate resource (Model or Native Collection) based on ServiceType
export const resolveServiceResource = async (req, type) => {
    const serviceType = type || req.token?.ServiceType;
    
    const foodTypes = [
        "FOOD", "Food", "RESTAURANT", "RESTURANT", "Restaurant",
        "Bakery", "Cafe", "Fast Food", "Fine Dining", "Local Food", "Street Food"
    ];

    if (foodTypes.includes(serviceType)) {
        return { 
            model: selectCollection(req, "FOOD"), 
            isFoodService: true,
            collection: selectCollection(req, "FOOD")
        };
    }

    const Model = await getServiceModel(serviceType);
    return { 
        model: Model, 
        isFoodService: false,
        collection: selectCollection(req, serviceType)
    };
};

// Generic Document Fetcher (Handles Mongoose and Native Driver)
export const getServiceDoc = async (req, type, id) => {
    const serviceId = id || req.token?.ServiceId;
    const serviceType = type || req.token?.ServiceType;

    if (!serviceId) throw new Error("Service ID is required");

    const { model, isFoodService, collection } = resolveServiceResource(req, serviceType);

    if (!model && !collection) throw new Error(`Invalid service type: ${serviceType}`);

    let document;
    if (isFoodService || !model.findById) {
        // Native Driver Fetch
        document = await collection.findOne({ _id: new ObjectId(serviceId) });
    } else {
        // Mongoose Model Fetch
        document = await model.findById(serviceId);
    }

    if (!document) throw new Error("Service document not found");
    return document;
};

export const selectCollection = (req, usuallNameOfColl) => {
    const db = req.app.locals.db;
    let coll;
    switch (usuallNameOfColl) {
        case "SCHOOL":
            coll = db.collection(process.env.S_C);
            break;
        case "COLLEGE":
            coll = db.collection(process.env.C_C);
            break;
        case "New Service Request":
            coll = db.collection(process.env.NSPR_C);
            break;
        case "Admins":
        case "Users":
            coll = db.collection(process.env.ACCOUNTS_COLLECTION || "Accounts");
            break;
        case "NewAdmission":
            coll = db.collection(process.env.NEWADMISSION_COLL);
            break;
        case "SPECIALIST":
            coll = db.collection(process.env.SP_C);
            break;
        case "PHARMACY":
            coll = db.collection(process.env.PH_C);
            break;
        case "EMERGENCY":
            coll = db.collection(process.env.EM_C);
            break;
        case "FOOD":
        case "Food":
        case "Restaurant":
        case "RESTAURANT":
        case "RESTURANT":
        case "Cafe":
        case "Fast Food":
        case "Bakery":
        case "Local Food":
        case "Street Food":
        case "Fine Dining":
            coll = db.collection(process.env.F_C);
            break;
        case "AdmissionsRecord":
            coll = db.collection(process.env.ADMISSION_RECORD);
            break;
        case "UserOtpVerifications":
            coll = db.collection(process.env.UOV);
            break
        case "Food":
            coll = db.collection(process.env.F_C);
            break
    }
    return coll;
}

export const getServiceModel = async (type) => {
    const t = type?.toUpperCase();
    
    const map = {
        SCHOOL: Schools,
        COLLEGE: Colleges,
        SPECIALIST: Specialists,
        PHARMACY: Pharmacies,
        EMERGENCY: Emergencies,
        BUSINESS: (await import("../Models/business/Business.js")).default,
        USER: (await import("../Models/User.js")).Users,
        ADMIN: (await import("../Models/Admins.js")).Admins
    };

    return map[t] || map[type] || null;
};

export const getSectorFromType = (type) => {
    if (!type) return null;
    const t = type.toString().trim().toUpperCase();
    const edu = ["SCHOOL", "COLLEGE"];
    const health = ["SPECIALIST", "PHARMACY", "EMERGENCY"];
    const food = ["RESTAURANT", "FOOD", "RESTURANT", "BAKERY", "CAFE", "FAST FOOD", "FINE DINING", "LOCAL FOOD", "STREET FOOD"];

    if (edu.includes(t)) return "EDUCATION";
    if (health.includes(t)) return "HEALTH";
    if (food.includes(t)) return "FOOD";

    return null;
};

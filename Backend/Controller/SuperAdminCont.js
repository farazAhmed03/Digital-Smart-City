import { selectCollection, getServiceModel, getCollections, resolveServiceResource, getServiceDoc } from "../HelperFun/helperFun.js";

export const DeleteThSAManager = async (req, res) => {
    try {

        const role = req.token.role;

        /* =====================================================
           Authorization
        ===================================================== */

        if (role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized."
            });
        }

        const { catagory } = req.body;

        if (!catagory) {
            return res.status(400).json({
                success: false,
                message: "Category is required."
            });
        }

        const AdminColl = selectCollection(req, "Admins");

        const result = await AdminColl.updateOne(
            { _id: new ObjectId(req.token.id) },
            {
                $pull: {
                    SAManagers: { AccessTo: catagory }
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: "No manager found for this category."
            });
        }

        return res.status(200).json({
            success: true,
            message: `${catagory} manager deleted successfully.`
        });

    } catch (error) {

        console.error("DeleteThSAManager Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
};



// 🔹 NEW BUSINESS MANAGEMENT FUNCTIONS
export const GetBusinessesByStatus = async (req, res) => {
    try {
        const role = req.token.role;
        const accessTo = req.token.AccessTo;

        const isAuth = role === "SUPER_ADMIN" ||
            (role === "SAManager" && accessTo === "Business");

        if (!isAuth) return res.json({ success: false, message: "Not authorized." });

        const { status } = req.body;
        const { ADMINS, NRs } = getCollections(req);
        const Business = await getServiceModel("BUSINESS");

        let rawData = [];

        if (["approved", "suspended"].includes(status)) {
            // Fetch from Business Collection
            rawData = await Business.find({ status });
        } else {
            // Fetch from NRs Collection
            rawData = await NRs.find({ catagory: "Business", status }).toArray();
        }

        // Map for frontend compatibility
        const data = rawData.map(item => ({
            ...item,
            address: item.location || item.address || ""
        }));

        res.json({ success: true, ResponseData: data });
    } catch (error) {
        console.error("GetBusinessesByStatus Error:", error);
        res.status(500).json({ success: false, message: "Server error", ResponseData: [] });
    }
};

export const UpdateBusinessStatus = async (req, res) => {
    try {
        const isAuth = req.token.role === "SuperAdmin" ||
            (req.token.role === "SAManager" && req.token.AccessTo === "Business");

        if (!isAuth) return res.json({ success: false, message: "Not authorized." });

        const { id, status, fromCollection } = req.body;
        const { NRs } = getCollections(req);
        const Business = await getServiceModel("BUSINESS");


        if (fromCollection === "Business") {
            await Business.findByIdAndUpdate(id, { status });
        } else {
            await NRs.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
        }

        res.json({ success: true, message: "Business status updated successfully" });
    } catch (error) {
        console.error("UpdateBusinessStatus Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const GetBusinessNotificationCounts = async (req, res) => {
    try {
        const { NRs } = getCollections(req);
        const requestsCount = await NRs.countDocuments({ catagory: "Business", status: "new_request" });
        res.json({ success: true, requestsCount });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

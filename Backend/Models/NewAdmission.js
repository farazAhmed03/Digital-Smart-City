const NewAdmissionSchema = new mongoose.Schema({

    studentName: String,
    fatherName: String,
    email: String,
    phone: String,
    WhatsAppNum: String,
    targetClass: String,
    previousSchool: String,
    address: String,

    InstId: mongoose.Schema.Types.ObjectId,

    paymentScreenshot: String,

    status: {
        type: String,
        default: "pending"
    },

    /* ========= Snapshot Data ========= */

    instituteSnapshot: {
        instituteId: mongoose.Schema.Types.ObjectId,
        instituteName: String,
        instituteStatus: Boolean,
        serviceType: String
    },

    adminSnapshot: {
        adminName: String,
        adminEmail: String,
        adminWhatsapp: String,
        adminPhone: String,
        adminLocation: String,
        adminIDCard: String,
        adminVerified: Boolean
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    collection: "NewAdmission"
});
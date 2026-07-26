import { OnlineCourses } from "../../Models/OnlineCourse.js";
import { CourseEnrollments } from "../../Models/CourseEnrollment.js";
import { OCSettings } from "../../Models/OCSettings.js";
import { sendEnrollmentEmail } from "../../utils/sendEnrollmentEmail.js";
import { sendWhatsAppNotification } from "../../utils/whatsAppSender.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";
import { getPublicIdFromUrl } from "../../HelperFun/helperFun.js";

/* =========================================================
   ADMIN: COURSE MANAGEMENT
========================================================= */

// Create Course
export const createCourse = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const {
            title, shortDescription, fullDescription, instructor, duration,
            price, category, startDate, endDate, curriculum, status, isPublished,
            mode, platform, address, whatYouWillLearn, whoIsThisCourseFor, skillsYouWillGain,
            whatsappGroupLink
        } = req.body;

        const file = req.file;

        // Validate required fields
        if (!title || !shortDescription || !fullDescription || !instructor || !duration || !price || !category || !startDate || !endDate || !whatsappGroupLink || !file) {
            return res.status(400).json({ success: false, message: "All fields including WhatsApp link and course image are required." });
        }

        // Timeout wrapper helper
        const withTimeout = (promise, ms, errorMessage) => {
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error(errorMessage)), ms)
            );
            return Promise.race([promise, timeout]);
        };

        // Retry helper for image upload
        const uploadWithRetry = async (file, folder, retries = 1) => {
            for (let attempt = 1; attempt <= retries + 1; attempt++) {
                try {
                    return await withTimeout(
                        uploadToCloudinary(file, folder),
                        60000, // 60 seconds
                        "Image upload timed out."
                    );
                } catch (err) {
                    console.error(`Upload attempt ${attempt} failed:`, err.message);
                    if (attempt > retries) throw err; // give up after last retry
                }
            }
        };

        // Upload image
        let uploadRes;
        try {
            uploadRes = await uploadWithRetry(file, "online_courses", 1);
        } catch (uploadErr) {
            console.error("Image upload error:", uploadErr);
            return res.status(504).json({ success: false, message: uploadErr.message });
        }

        if (!uploadRes || !uploadRes.secure_url) {
            return res.status(500).json({ success: false, message: "Image upload failed." });
        }

        // Parse and validate curriculum
        let parsedCurriculum = [];
        if (curriculum) {
            try {
                parsedCurriculum = JSON.parse(curriculum);
                for (const module of parsedCurriculum) {
                    if (!module.lessons || !Array.isArray(module.lessons) || module.lessons.length === 0) {
                        return res.status(400).json({ success: false, message: "Each module must have at least one lesson." });
                    }
                    for (const lesson of module.lessons) {
                        if (!lesson.content || lesson.content.trim() === "") {
                            return res.status(400).json({ success: false, message: "Each lesson must have content." });
                        }
                    }
                }
            } catch (parseErr) {
                return res.status(400).json({ success: false, message: "Invalid curriculum format." });
            }
        }

        // Create course with timeout
        let newCourse;
        try {
            newCourse = await withTimeout(
                OnlineCourses.create({
                    title,
                    shortDescription,
                    fullDescription,
                    instructor,
                    image: uploadRes.secure_url,
                    duration,
                    price,
                    category,
                    mode: mode || "Online",
                    platform,
                    address,
                    startDate,
                    endDate,
                    whatYouWillLearn: whatYouWillLearn ? JSON.parse(whatYouWillLearn) : [],
                    whoIsThisCourseFor,
                    skillsYouWillGain: skillsYouWillGain ? JSON.parse(skillsYouWillGain) : [],
                    status,
                    isPublished: isPublished === "true" || isPublished === true,
                    whatsappGroupLink,
                    curriculum: parsedCurriculum
                }),
                15000,
                "Course creation timed out."
            );
        } catch (creationErr) {
            console.error("Course creation error:", creationErr);
            return res.status(504).json({ success: false, message: creationErr.message });
        }

        res.status(201).json({ success: true, message: "Course created successfully.", data: newCourse });

    } catch (err) {
        console.error("createCourse error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const { id } = req.params;
        const updateData = req.body;
        const file = req.file;

        const course = await OnlineCourses.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found." });

        if (file) {
            // Delete old image
            const publicId = getPublicIdFromUrl(course.image);
            if (publicId) await deleteFromCloudinary(publicId);

            // Upload new image
            const uploadRes = await uploadToCloudinary(file, "online_courses");
            if (uploadRes && uploadRes.secure_url) updateData.image = uploadRes.secure_url;
        }

        if (updateData.curriculum) updateData.curriculum = JSON.parse(updateData.curriculum);
        if (updateData.whatYouWillLearn) updateData.whatYouWillLearn = JSON.parse(updateData.whatYouWillLearn);
        if (updateData.skillsYouWillGain) updateData.skillsYouWillGain = JSON.parse(updateData.skillsYouWillGain);

        if (updateData.isPublished !== undefined) {
            updateData.isPublished = updateData.isPublished === "true" || updateData.isPublished === true;
        }

        const updatedCourse = await OnlineCourses.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: "Course updated successfully.", data: updatedCourse });
    } catch (err) {
        console.error("updateCourse error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Permanent Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const { id } = req.params;
        const course = await OnlineCourses.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found." });

        // 1. Find all enrollments for this course
        const enrollments = await CourseEnrollments.find({ courseId: id });

        // 2. Delete all enrollment screenshots from Cloudinary
        for (const enrollment of enrollments) {
            if (enrollment.paymentScreenshot) {
                const publicId = getPublicIdFromUrl(enrollment.paymentScreenshot);
                if (publicId) await deleteFromCloudinary(publicId);
            }
        }

        // 3. Delete all enrollment records
        await CourseEnrollments.deleteMany({ courseId: id });

        // 4. Delete course image from Cloudinary
        const publicId = getPublicIdFromUrl(course.image);
        if (publicId) await deleteFromCloudinary(publicId);

        // 5. Delete course record permanently
        await OnlineCourses.findByIdAndDelete(id);

        res.json({ success: true, message: "Course and all associated enrollments deleted permanently." });
    } catch (err) {
        console.error("deleteCourse error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get All Courses (Admin)
export const getAllCoursesAdmin = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const courses = await OnlineCourses.find().sort({ createdAt: -1 });
        res.json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

/* =========================================================
   ADMIN: SETTINGS MANAGEMENT
========================================================= */

export const getOCSettings = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        let settings = await OCSettings.findOne();
        if (!settings) {
            settings = await OCSettings.create({}); // Create default if doesn't exist
        }
        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const updateOCSettings = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const updateData = req.body;
        const file = req.file;

        let settings = await OCSettings.findOne();
        if (!settings) settings = await OCSettings.create({});

        // Handle Background Image Upload
        if (file) {
            if (settings.hero?.backgroundImage) {
                const publicId = getPublicIdFromUrl(settings.hero.backgroundImage);
                if (publicId) await deleteFromCloudinary(publicId);
            }
            const uploadRes = await uploadToCloudinary(file, "oc_settings");
            if (uploadRes && uploadRes.secure_url) {
                if (!updateData.hero) updateData.hero = {};
                updateData.hero.backgroundImage = uploadRes.secure_url;
            }
        }

        // Parse nested objects if sent as strings (from FormData)
        if (typeof updateData.hero === "string") updateData.hero = JSON.parse(updateData.hero);
        if (typeof updateData.feeInfo === "string") updateData.feeInfo = JSON.parse(updateData.feeInfo);
        if (typeof updateData.registration === "string") updateData.registration = JSON.parse(updateData.registration);
        if (typeof updateData.uiTexts === "string") updateData.uiTexts = JSON.parse(updateData.uiTexts);

        const updatedSettings = await OCSettings.findOneAndUpdate({}, updateData, { new: true, upsert: true });
        res.json({ success: true, message: "Settings updated successfully.", data: updatedSettings });
    } catch (err) {
        console.error("updateOCSettings error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

/* =========================================================
   CLIENT: COURSE VIEWING & ENROLLMENT
========================================================= */

// Get Published Courses
export const getActiveCourses = async (req, res) => {
    try {
        const courses = await OnlineCourses.find({ isPublished: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: courses });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get Course Detail
export const getCourseDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await OnlineCourses.findById(id);
        if (!course) return res.status(404).json({ success: false, message: "Course not found." });
        res.json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Submit Enrollment
export const enrollInCourse = async (req, res) => {
    try {
        const { fullName, email, phone, whatsappNumber, city, courseId, courseName, transactionId, classMode } = req.body;
        const file = req.file;

        if (!fullName || !email || !phone || !whatsappNumber || !city || !courseId || !courseName || !file) {
            return res.status(400).json({ success: false, message: "Required fields (including WhatsApp number) and payment screenshot missing." });
        }

        const uploadRes = await uploadToCloudinary(file, "course_enrollments");
        if (!uploadRes || !uploadRes.secure_url) return res.status(500).json({ success: false, message: "Payment screenshot upload failed." });

        const enrollment = await CourseEnrollments.create({
            fullName,
            email,
            phone,
            whatsappNumber,
            city,
            classMode: classMode || "Online",
            courseId,
            courseName,
            transactionId,
            paymentScreenshot: uploadRes.secure_url
        });

        res.status(201).json({ success: true, message: "Enrollment request submitted. Please wait for approval." });
    } catch (err) {
        console.error("enrollInCourse error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

/* =========================================================
   ADMIN: ENROLLMENT MANAGEMENT
========================================================= */

// Get All Enrollments
export const getAllEnrollments = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const enrollments = await CourseEnrollments.find().sort({ createdAt: -1 });
        res.json({ success: true, data: enrollments });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Approve/Reject Enrollment
export const updateEnrollmentStatus = async (req, res) => {
    try {
        const { role, AccessTo: accessTo } = req.token;
        if (role !== "SUPER_ADMIN" && !(role === "SAManager" && accessTo === "Education")) {
            return res.status(403).json({ success: false, message: "Not authorized." });
        }
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        if (status === "Rejected" && !rejectionReason) {
            return res.status(400).json({ success: false, message: "Rejection reason is required." });
        }

        const enrollment = await CourseEnrollments.findById(id);
        if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found." });

        enrollment.status = status;
        if (status === "Rejected") enrollment.rejectionReason = rejectionReason;
        await enrollment.save();

        // Fetch Course details for WhatsApp Group Link
        const course = await OnlineCourses.findById(enrollment.courseId);
        const groupLink = course?.whatsappGroupLink || "https://chat.whatsapp.com/DK_Official";

        // Send Email Notification
        await sendEnrollmentEmail(enrollment.email, enrollment.courseName, status, rejectionReason, groupLink);

        // Send WhatsApp Notification if Approved
        if (status === "Approved" && enrollment.whatsappNumber) {
            const waMessage = `Welcome to ${enrollment.courseName}! ✅\n\nWe are excited to have you. Please join the official WhatsApp group for updates and communication:\n\n🔗 Join here: ${groupLink}\n\nSee you in class!\n- Digital Kohat Team`;
            await sendWhatsAppNotification(enrollment.whatsappNumber, waMessage);
        }

        res.json({ success: true, message: `Enrollment ${status} successfully.` });
    } catch (err) {
        console.error("updateEnrollmentStatus error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

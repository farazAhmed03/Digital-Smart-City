import Customer from "../../Models/business/Customer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @route   POST /api/customer/auth/register
// @desc    Register a new customer
// @access  Public
export const registerCustomer = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        // Check for existing customer
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: "Customer with that email or phone already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = new Customer({
            name,
            email,
            phone,
            password: hashedPassword
        });

        const savedCustomer = await newCustomer.save();

        // Create JWT
        const payload = {
            customer: {
                id: savedCustomer._id,
                name: savedCustomer.name,
                email: savedCustomer.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_KEY || "fallback_secret_key",
            { expiresIn: "7d" },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    success: true,
                    message: "Registration successful",
                    token,
                    customer: {
                        id: savedCustomer._id,
                        name: savedCustomer.name,
                        email: savedCustomer.email,
                        phone: savedCustomer.phone
                    }
                });
            }
        );
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};

// @route   POST /api/customer/auth/login
// @desc    Login a customer and get token
// @access  Public
export const loginCustomer = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        // Check user
        const customer = await Customer.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        });

        if (!customer) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Create JWT
        const payload = {
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_KEY || "fallback_secret_key",
            { expiresIn: "7d" },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    message: "Login successful",
                    token,
                    customer: {
                        id: customer._id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone
                    }
                });
            }
        );
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// @route   GET /api/customer/auth/me
// @desc    Get current logged in customer
// @access  Private (Customer)
export const getMe = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer.id).select("-password");
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.json({ success: true, customer });
    } catch (error) {
        console.error("GetMe Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

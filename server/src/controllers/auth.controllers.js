import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { fullName, email, password} = req.body;
    
        //validation of the request body
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        if (!password || password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const normalizedEmail = email.toLowerCase();
    
        if(!emailRegex.test(normalizedEmail)){
            return res.status(422).json({message: "Invalid email format"})
        }
    
        //checking if the user with this email already exists
    
        const existingUser = await User.findOne({email: normalizedEmail})
    
        if(existingUser){
             return res
              .status(409)
              .json({ message: "User with this email already exists" });
        }
    
        //hashing password
        const hashedPassword = await bcrypt.hash(password, 12);
    
        //creating user
        const newUser = await User.create({
            fullname: fullName,
            email: normalizedEmail,
            password: hashedPassword,
            lastLogin: Date.now()
        })
        
        //issueing jwt token
        const token = jwt.sign({id: newUser._id,  role: newUser.role}, process.env.JWT_SECRET, {expiresIn: '7d'})

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("authToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        });
    
        return res.status(201).json({
            success: true,
            user: newUser,
            message: "User registered successfully"
        })
    } catch (error) {
        console.log("Error in registering user : ", error)
        return res.status(500).json({message: 'internal server error'})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        //validation
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const normalizedEmail = email.toLowerCase();
    
        //check if the user exists or not
        const existingUser = await User.findOne({email: normalizedEmail}).select("+password");
        if(!existingUser){
            return res.status(401).json({message: "Invalid Credentials"})
        }

        //check if the user is active
        if(existingUser.status === 'inactive'){
            return res.status(403).json({message: "User is deactivated"})
        }
    
        //compare the password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid Credentials"})
        }
    
        //issueing jwt token
        const token = jwt.sign({id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET, {expiresIn: '7d'})

        await existingUser.updateOne({lastLogin: Date.now()})

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("authToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        });


        return res.status(200).json({
            success: true,
            email: existingUser.email,
            message: "User logged in successfully"
        })

    } catch (error) {
        console.log("Error in signing in user : ", error)
        return res.status(500).json({message: 'internal server error'})    
    }

}

export const logout = (req, res) => {
    res.clearCookie("authToken", {
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({message: "Logout successful"});
}
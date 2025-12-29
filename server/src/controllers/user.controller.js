import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
export const getMyProfile = (req, res) => {
  return res.status(200).json({
    user: req.user
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullname: fullName },
      { new: true }
    ).select("_id fullname email role status");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
    
        if(!currentPassword || !newPassword){
            return res.status(400).json({message: "All fields required"})
        }
    
        //check if currentPassword is correct
        const user = await User.findOne({email: req.user.email}).select('+password')
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Current Password is wrong"})
        }

        //check if new password is same as old
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
        return res.status(400).json({
            message: "New password must be different from current password"
        });
        }

        //validate new password
        if(newPassword.length<8){
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });            
        }
    
        //hash new password
        const hashNewPassword = await bcrypt.hash(newPassword, 12);
    
        await user.updateOne({password: hashNewPassword})
        
        res.status(200).json({message: "Password Updated Successfully"})
    
    } catch (error) {
    console.log("Error while changing passoword : ", error);
    res.status(500).json({message: "Internal Server Error"})
    }
}
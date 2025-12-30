import User from "../models/user.model.js"
export const getAllUsers = async (req, res) => {
    try {
        //reading query params for pagination and calculating skip
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
        //getting users 
        const users = await User.find().select("_id fullname email role status lastLogin").skip(skip).limit(limit).sort({lastLogin: -1})
    
        const totalUsers = await User.countDocuments();
    
        return res.status(200).json({
                    users,
                    pagination: {
                        page,
                        limit,
                        total: totalUsers
                    }
                });
        
    } catch (error) {
        console.log("Error in gettig all users : ", error);
        return res.status(500).json({message: "Internal Server Error"})
    }

}

export const activateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        //admin shouldn't be able to modify themselve
        if (userId === req.user._id.toString()) {
        return res.status(400).json({
            message: "You cannot modify your own account status"
        });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {status: "active"},
            {new: true}
        ).select("_id fullname role status");

            if (!user) {
            return res.status(404).json({ message: "User not found" });
            }

        return res.status(200).json({
            user,
            message: "User set as active"
        })


    } catch (error) {
        console.log("Error activating user : ", error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const deactivateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        //admin shouldn't be able to modify themselve
        if (userId === req.user._id.toString()) {
        return res.status(400).json({
            message: "You cannot modify your own account status"
        });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {status: 'inactive'},
            {new: true}
            ).select("_id fullname role status");

            if (!user) {
            return res.status(404).json({ message: "User not found" });
            }

        return res.status(200).json({
            user,
            message: "User set as inactive"
        })


    } catch (error) {
        console.log("Error deactivating user : ", error);
        return res.status(500).json({message: "Internal Server Error"})
    }   
}
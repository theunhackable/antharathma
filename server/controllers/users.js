import User from "../models/User.js";


export const getUser = async(req, res) => {
    try{

        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch(err) {
        res.status(404).json({error: err.message});
    }
}

export const getUserFriends = async(req, res) => {
    try{

        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            User.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(({_id, fristName, lastName, occupation, location, picturePath}) => {
            return {_id, fristName, lastName, occupation, location, picturePath}
        })


        res.status(200).json(formattedFriends);

    } catch(err) {
        res.status(404).json({error: err.message});
    }
};


// UPDATE

export const addRemoveFriend = async (req, res) => {
    try{

        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        
        // iffriendId in user frineds then unfriend him else add him to the friend list
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !==friendId);
            friend.friends = friend.friends.filter((friendId) => friendId !== id)
        }
        else {
            user.freinds.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            User.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(({_id, fristName, lastName, occupation, location, picturePath}) => {
            return {_id, fristName, lastName, occupation, location, picturePath}
        })
        res.status(200).json(formattedFriends);

    } catch(err) {
        res.status(404).json({error: err.message});
    }
}
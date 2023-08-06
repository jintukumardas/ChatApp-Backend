// Group controller - This controller contains the functions that are used to manage groups.

const Group = require("../models/group");
const User = require("../models/user");

// Create a new group
async function createGroup(req, res) {
  try {
    const newGroup = await Group.create(req.body);
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
}

// Delete group
async function deleteGroup(req, res) {
  try {
    const { groupId } = req.params;
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
}

// Search member of a group
async function searchMember(req, res) {
  try {
    const groupId = await req.params.groupId;
    const userId = await req.params.userId;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    for(var i=0;i<group.members.length;i++){
        if(group.members[i].toString()===userId){
          return res.status(200).json(group.members[i]); //Return matched member
        }
    }
    res.status(404).json({ error: "Member not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to search members" });
  }
}

// Add a member to a group
async function addMember(req, res) {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if the user is already a member of the group
    const existingMember = group.members.find(
      (member) => member.userId.toString() === userId
    );
    if (existingMember) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    // Create a reference to the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the user as a member
    group.members.push([userId]);
    await group.save();

    res.json({ message: "Member added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add member" });
  }
}

module.exports = {
  createGroup,
  deleteGroup,
  searchMember,
  addMember,
};

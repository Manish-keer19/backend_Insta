import { Request, Response } from "express";
import { Message } from "../models/Messages.modal";

interface MessageRequest extends Request {
  body: {
    currentUserId: string;
    anotherUserId: string;
    message: string;
    messageId: string;
  };
}

export const getAllMessages = async (
  req: MessageRequest, // Use the custom request type
  res: Response
): Promise<any> => {
  try {
    const { currentUserId, anotherUserId } = req.body;

    if (!currentUserId || !anotherUserId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const messages = await Message.findOne({
      $or: [
        { currentUser: currentUserId, anotherUser: anotherUserId },
        { currentUser: anotherUserId, anotherUser: currentUserId },
      ],
    }).populate({
      path: "messages.sender",
      model: "User",
    });

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log("Could not get the messages", error);
    return res.status(500).json({
      success: false,
      message: "Could not get the messages",
    });
  }
};

export const editMessage = async (
  req: MessageRequest, // Use the custom request type
  res: Response
): Promise<any> => {
  try {
    const { currentUserId, anotherUserId, message, messageId } = req.body;
    console.log("curentUserId is ", currentUserId);
    console.log("anotherUserId is ", anotherUserId);
    console.log("message is ", message);
    console.log("messageId is ", messageId);

    if (!currentUserId || !anotherUserId || !message || !messageId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let updatedMessageDoc;

    if (currentUserId !== anotherUserId) {
      console.log("bhai current user id or another user id is not equal");

      // Find the document and update the specific message in the messages array
      updatedMessageDoc = await Message.findOneAndUpdate(
        {
          $or: [
            { currentUser: currentUserId, anotherUser: anotherUserId },
            { currentUser: anotherUserId, anotherUser: currentUserId },
          ],
          "messages._id": messageId,
        },
        { $set: { "messages.$[elem].message": message } }, // Update the message text
        {
          new: true, // Return the updated document
          arrayFilters: [{ "elem._id": messageId }], // Filter for the specific message in the array
        }
      ).populate({
        path: "messages.sender",
        model: "User",
      });
    } else {
      console.log("bhai current user id or another user id is  equal");
      updatedMessageDoc = await Message.findOneAndUpdate(
        {
          $and: [
            { currentUser: currentUserId },
            { anotherUser: currentUserId },
            { "messages._id": messageId },
          ],
        },
        { $set: { "messages.$[elem].message": message } }, // Update the message text
        {
          new: true, // Return the updated document
          arrayFilters: [{ "elem._id": messageId }], // Filter for the specific message in the array
        }
      ).populate({
        path: "messages.sender",
        model: "User",
      });
    }

    console.log(updatedMessageDoc);
    if (!updatedMessageDoc) {
      return res.status(400).json({
        success: false,
        message: "Could not update the message",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message updated successfully",
      messages: updatedMessageDoc,
    });
  } catch (error) {
    console.log("Could not update the message", error);
    return res.status(500).json({
      success: false,
      message: "Could not update the message",
    });
  }
};

export const deleteMessage = async (
  req: MessageRequest, // Use the custom request type
  res: Response
): Promise<any> => {
  try {
    const { currentUserId, anotherUserId, messageId } = req.body;
    console.log("curentUserId is ", currentUserId);
    console.log("anotherUserId is ", anotherUserId);
    console.log("messageId is ", messageId);

    if (!currentUserId || !anotherUserId || !messageId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let updatedMessageDoc;
    if (currentUserId !== anotherUserId) {
      // delete that message from the messages array
      updatedMessageDoc = await Message.findOneAndUpdate(
        {
          $or: [
            { currentUser: currentUserId, anotherUser: anotherUserId },
            { currentUser: anotherUserId, anotherUser: currentUserId },
          ],
          "messages._id": messageId,
        },
        { $pull: { messages: { _id: messageId } } }, // delete the message doc
        {
          new: true, // Return the updated document
        }
      ).populate({
        path: "messages.sender",
        model: "User",
      });
    } else {
      // delete that message from the messages array
      updatedMessageDoc = await Message.findOneAndUpdate(
        {
          $and: [
            { currentUser: currentUserId },
            { anotherUser: currentUserId },
            { "messages._id": messageId },
          ],
        },
        { $pull: { messages: { _id: messageId } } }, // delete the message doc
        {
          new: true, // Return the updated document
        }
      ).populate({
        path: "messages.sender",
        model: "User",
      });
    }

    if (!updatedMessageDoc) {
      return res.status(400).json({
        success: false,
        message: "Could not delete the message",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      messages: updatedMessageDoc,
    });
  } catch (error) {
    console.log("Could not delete the message", error);
    return res.status(500).json({
      success: false,
      message: "Could not delete the message",
    });
  }
};

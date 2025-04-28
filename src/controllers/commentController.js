const { router, bcrypt, prisma, jwt } = require("../common/common");
require("dotenv").config();


const deleteComment = async (commentId, currentUserId) => {
    if (!currentUserId) {
        throw new Error("You must be logged in to delete a comment");
    }
    const comment = await prisma.comment.findUnique({
    where: {
        id: commentId
    }
    });

    if (!comment) {
        throw new Error("Comment not found");
    }
    if (comment.userId !== currentUserId) {
        throw new Error ("Authorization required to delete this comment")
    }
    return prisma.comment.delete({
        where: {
            id: commentId
        }
    });
};

  module.exports = {
    deleteComment
  };
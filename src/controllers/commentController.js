const { router, bcrypt, prisma, jwt } = require("../common/common");

// Function to create a new comment
async function createComment(req, res, next) {
    try {
        const { reviewId } = req.params; // Extract reviewId from request parameters
        const { text } = req.body; // Extract content from request body
        const userId = req.user.id; // Get userId from the authenticated user

        // Create a new comment in the database
        const comment = await prisma.comment.create({
            data: {
                text,
                review: {
                    connect: {
                        id: reviewId // Connect the comment to the review using reviewId
                    }
                },
                user: {
                    connect: {
                        id: userId // Connect the comment to the user using userId
                    }
                }
            }
        });

        res.status(201).json(comment); // Respond with the created comment
    } catch (error) {
        console.error("Error creating comment:", error); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while creating the comment." }); // Respond with an error
        next(error); // Pass the error to the next middleware
    }
}

// Function to get all user's comments for a specific review
async function getMyComments(req, res, next) {
    try {
        const userId = req.user.id; // Get userId from the authenticated user

        const comments = await prisma.comment.findMany({
            where: {
                userId: userId // Find comments where the userId matches the authenticated user
            },
            include: {
                review: true // Include the review information in the response
            }
        });

        res.json(comments); // Respond with the list of comments
    } catch (error) {
        console.error("Error fetching comments:", error); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while fetching comments." }); // Respond with an error
        next(error); // Pass the error to the next middleware
    }
}

// Function to update a specific comment
async function updateComment(req, res, next) {
    try {
        const { commentId } = req.params; // Extract userId and commentId from request parameters
        const { text } = req.body; // Extract content from request body
        const userId = req.user.id; // Get userId from the authenticated user

        // Update comment in the database based on commentId
        const comment = await prisma.comment.findUnique({ 
            where: {
                id: commentId 
            }
        });
        
        // Check if the comment exists and if the user is authorized to update it
        if (!comment || comment.userId !== userId) {
            return res.status(403).json({ error: "You are not authorized to update this comment." }); 
        }

        // Update the comment in the database
        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId // Find the comment by its ID
            },
            data: {
                text // Update the content of the comment
            }
        });
        res.json(updatedComment); // Respond with the updated comment
        
    } catch (error) {
        console.error("Error updating comment:", error); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while updating the comment." }); // Respond with an error
        next(error); // Pass the error to the next middleware
    }
}

// Function to delete a specific comment
async function deleteComment(req, res, next) {
    try {
        const { commentId } = req.params; // Extract userId and commentId from request parameters
        const userId = req.user.id; // Get userId from the authenticated user

        // Find the comment in the database
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId // Find the comment by its ID
            }
        });

        // Check if the comment exists and if the user is authorized to delete it
        if (!comment || comment.userId !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this comment." }); 
        }

        // Delete the comment from the database
        await prisma.comment.delete({
            where: {
                id: commentId // Find the comment by its ID
            }
        });

        res.json({ message: "Comment deleted successfully." }); // Respond with a success message
        
    } catch (error) {
        console.error("Error deleting comment:", error); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while deleting the comment." }); // Respond with an error
        next(error); // Pass the error to the next middleware
    }
}

module.exports = {
    createComment,
    getMyComments,
    updateComment,
    deleteComment
}; // Export the functions to be used in other parts of the application
import Client from "../models/Client.js";
import ErrorResponse from "../utils/errorResponse.js";
// @desc    Get all clients
// @route   GET /api/clients
// @access  Private

async function getClients(req, res) {
    try {
        const clients = await Client.find({ removed: false }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "clients fetched successfully",
            data: clients,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private

async function getClient(req, res) {
    try {

        const id = req.params.id;
        const client = await Client.findById(id);
        if (!client) {
            return next(new ErrorResponse("client not found", 404));
        }
        if (client.removed) {
            return next(new ErrorResponse("client not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "client fetched successfully",
            data: client,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// @desc    Create client
// @route   POST /api/clients
// @access  Private

async function createClient(req, res) {
    try {
        /**check if client exists using client's email
         or client's company name 
         or phone number , 
         **/
        if (req.body.email || req.body.company || req.body.tel) {
            return next(new ErrorResponse("client is already in your list", 400));
        }
        const client = await Client.create(req.body);
        res.status(200).json({
            success: true,
            message: "client created successfully",
            data: client,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private

async function updateClient(req, res, next) {
    try {
        const id = req.params.id;
        const client = await Client.findById(id);
        if (!client) {
            return next(new ErrorResponse("client not found", 404));
        }
        if (client.removed) {
            return next(new ErrorResponse("client not found", 404));
        }

        // Update the client
        const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "client updated successfully",
            data: updatedClient,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//delete client
// @desc    Delete client/ mark as removed
// @route   DELETE /api/clients/:id 
// @access  Private

async function deleteClient(req, res, next) {
    try {
        const id = req.params.id;
        const client = await Client.findById(id);
        if (!client) {
            return next(new ErrorResponse("client not found", 404));
        }
        if (client.removed) {
            return next(new ErrorResponse("client not found", 404));
        }
        //mark as removed
        const updatedClient = await Client.findByIdAndUpdate(id, { removed: true }, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "client deleted successfully",
            data: updatedClient,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
import Client from "../models/Client.js";
import ErrorResponse from "../utils/errorResponse.js";
import clientSchema from "../helper/clientValidate.js";
// @desc    Get all clients
// @route   GET /api/clients
// @access  Private

async function getClients(req, res) {
    try {
        const clients = await Client.find({ removed: false }).sort({ createdAt: -1 });

        //if no clients found
        if (!clients || clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No clients found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Clients fetched successfully",
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
        const client = await Client.findById(id).populate("invoices");
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
        //validate the client
        await clientSchema.validate(req.body);
        //check if client already exists
        const { email, company, tel } = req.body;
        const clientExists = await Client.findOne({
             $or: [{ email }, 
                { company }, 
                { tel }],
                removed: true });
        if (clientExists) {
            console.error("Error in createClient: client already exists", clientExists);
            return res.status(400).json({
                success: false,
                message: "client already exists",
            });
        }

        if (clientExists) {
            // Handle the conflict, if client exists
            //Update "removed" status to false
            if (clientExists.removed===true) {
                clientExists.removed = false;
                await clientExists.save();
            }
            res.status(200).json({
                success: true,
                message: "client created successfully",
                data:Client,
            });
        } else {
            // Create a new client
            const client = await Client.create(req.body);
            res.status(201).json({
                success: true,
                message: "client created successfully",
                data: client,
            });
        }
    } catch (error) {
        console.error("Error in createClient:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please check the server logs for details.",
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

//@desc    search for client by  email or company 's name or tel
//@route   GET /api/clients/search?keyword=keyword
//@access  Private

async function searchClients(req, res) {
    try {
        const { searchQuery } = req.params;

        if (!searchQuery) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        // URL decoding the search query
        const decodedSearchQuery = decodeURIComponent(searchQuery);

        // case-insensitive regular expression to search by name
        const clients = await Client.find({
            company: { $regex: new RegExp(decodedSearchQuery, "i") },
        });

        res.status(200).json({
            success: true,
            message: "Clients found successfully",
            data: clients,
        });
    } catch (error) {
        console.error("Error in searchClients:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Please check the server logs for details.",
        });
    }
}

// @desc    Get all client's invoices
// @route   GET /api/clients/:id/invoices
// @access  Private



export { getClients, getClient, createClient, updateClient, deleteClient, searchClients };
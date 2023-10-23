import yup from 'yup';

// Create a schema for the client form
const clientSchema = yup.object().shape({
    company: yup.string().required("Name is required").trim(),
    email: yup.string().email("Invalid email").required("Email is required"),
    tel: yup.string().required("Phone is required").trim(),
    address: yup.string().required("Address is required").trim(),
    country: yup.string().required("Country is required").trim(),
});

// async function validateClient(req, res, next) {
//     try {
//         await clientSchema.validate(req.body);
//         next();
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }
export default clientSchema;
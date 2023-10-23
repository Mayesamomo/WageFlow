import yup from 'yup';

// Create a schema for the invoice form
const invoiceSchema = yup.object().shape({
    date: yup.string().required("Date is required"),
    client: yup.object().shape({
        _id: yup.string().required('Client ID is required'),
    }).required('Client is required'),
    items: yup.array().of(
        yup.object().shape({
            dateServed: yup.date().required('Date served is required'),
            day: yup.string().required('Day is required'),
            location: yup.string().trim(),
            startTime: yup.string().trim(),
            endTime: yup.string().trim(),
            // totalHours: yup.number().required('Total hours is required'),
            ratePay: yup.number().default(0),
            serviceType: yup.string().required('Service type is required'),
            tax: yup.number().default(0),
        })
    ),
    notes: yup.string().trim(),
    taxRate: yup.number().default(0),
    // subTotal: yup.number().required('Subtotal is required'),
    // totalTax: yup.number().required('Total tax is required'),
    // totalAmount: yup.number().required('Total amount is required'),
});

export default invoiceSchema;

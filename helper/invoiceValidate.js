import yup from 'yup';

const invoiceValidationSchema = yup.object().shape({
    client: yup.string().required(),
    date: yup.date().required(),
    items: yup.array().of(
      yup.object().shape({
        dateServed: yup.date().required(),
        day: yup.string().required(),
        location: yup.string().trim(),
        startTime: yup.string().trim(),
        endTime: yup.string().trim(),
        totalHours: yup.number().notRequired(),
        ratePay: yup.number().default(0),
        serviceType: yup.string().required().trim(),
        tax: yup.number().default(0),
        totalRate: yup.number().required().default(0),
      })
    ),
    taxRate: yup.number().required().default(0),
    notes: yup.string().trim(),
    subTotal: yup.number().required().default(0),
    totalTax: yup.number().required().default(0),
    totalAmount: yup.number().required().default(0),
});



export default invoiceValidationSchema;
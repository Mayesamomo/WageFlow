import moment from 'moment';
import currency from 'currency.js';

//@desc calculate total hours worked
//@param items: array of items
//@return total hours worked

function calculateTotalItemHours(item) {
    const startTime = moment(item.startTime, ["h:mm A", "H:mm"],true);
    const endTime = moment(item.endTime, ["h:mm A", "H:mm"],true);
   
    //check if both startTime and endTime are valid
    if(startTime.isValid() && endTime.isValid()){
        //check if endTime is before startTime
        if(endTime.isBefore(startTime)){
            endTime.add(1,'days');
        }
        const duration = moment.duration(endTime.diff(startTime));
        return duration.asHours();
    }
    throw new Error('Invalid time format. Please use a valid time format (e.g., "h:mm A" or "H:mm").');
}

//@desc calculate total rate
//@param items: array of items
//@return total rate

function calculateTotalItemRate(item) {
    const totalHours = item.totalHours;
    const ratePay = new currency(item.ratePay);
    return ratePay.multiply(totalHours);
}

//@desc calculate total tax for items
//@param items: array of items
//@return total tax for items

function calculateItemTax(item, taxRate) {
    const totalRate = new currency(calculateTotalItemRate(item));
    const tax = totalRate.multiply(taxRate / 100);
    return tax.value;
}

//@desc calculate total tax
//@param items: array of items
//@return total tax

function calculateTotalItemTax(items, taxRate) {
    return items.reduce((total, item) => total + calculateItemTax(item, taxRate), 0);
}

//@desc calculate subtotal
//@param items: array of items
//@return subtotal

function calculateSubtotal(items) {
    let subtotal = new currency(0);
    items.forEach(item => {
        subtotal = subtotal.add(calculateTotalItemRate(item));
    });
    return subtotal.value;
}

//@desc calculate total invoice tax
//@param items: array of items
//@return total invoice tax

function calculateInvoiceTax(items) {
    let totalTax = new currency(0);
    items.forEach(item => {
        totalTax = totalTax.add(item.tax);
    });
    return totalTax.value;
}

//@desc calculate total invoice amount
//@param items: array of items
//@return total invoice amount

function calculateTotalInvoiceAmount(subtotal, totalTax) {
    const subtotalAmount = new currency(subtotal);
    const totalTaxAmount = new currency(totalTax);
    return subtotalAmount.add(totalTaxAmount).value;
}


export {
    calculateTotalItemHours,
    calculateTotalItemRate,
    calculateItemTax,
    calculateTotalItemTax,
    calculateSubtotal,
    calculateInvoiceTax,
    calculateTotalInvoiceAmount}
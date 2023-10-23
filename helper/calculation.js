import moment from 'moment';    
import currency from 'currency.js'; 

//@desc: calculate total hours

export function calculateTotalHours  (timeIn, timeOut){
    const timeInMoment = moment(timeIn, 'HH:mm');
    const timeOutMoment = moment(timeOut, 'HH:mm');
const duration = moment.duration(timeOutMoment.diff(timeInMoment));
    const totalHours = duration.asHours();
    return totalHours;
};


//@desc: calculate total rate 
export function calculateTotalRate(totalHours, ratePay){
    const totalRate = currency(ratePay).multiply(totalHours).value;
    return totalRate;
};


//@desc: calculate total tax

export function calculateTotalTax(totalRate, tax){
    if(tax < 0 || tax > 100){
        throw new Error('Tax must be between 0 and 100');
    }
    const taxAmount = currency(totalRate).multiply(tax/100).value;
    return taxAmount;
}

//@desc: calculate subtotal

export function calculateSubTotal(items){
    //initialize subtotal
    let subTotal = currency(0);

    //loop through items
    items.forEach(item => {
        subTotal = subTotal.add(item.totalRate);
    });
    //convert to number
    return subTotal.value;
}

//@desc: calculate total
export  function calculateTotal(subTotal, totalTax){
    const subTotalCurrency = currency(subTotal);
    const totalTaxCurrency = currency(totalTax);

    const total = subTotalCurrency.add(totalTaxCurrency);
    return total.value;
}


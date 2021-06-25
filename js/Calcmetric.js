class CalcMetric{
    availability(paramArray) {
        let errorCounter = 0;
        for (let i = 0; i < paramArray.length; i++) {
            if (parseInt(paramArray[i]) !== 0) {
                errorCounter++;
            }
        }
        return 100 - Math.round((errorCounter / paramArray.length) * 100);
    }
}
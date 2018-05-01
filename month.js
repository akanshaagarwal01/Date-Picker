(function () {
    function Month() {
        this._months = {
            0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
        };
    }

    Month.prototype.getMonthInWords = function (monthInNumber) {
        return this._months[monthInNumber];
    }

    Month.prototype.getMonthInNumber = function (monthInWords) {
        for (let key in this._months) {
            if (this._months[key] === monthInWords) {
                return key;
            }

        }
    }

    window.Month = Month;
})();
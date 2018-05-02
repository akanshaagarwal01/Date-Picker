(function () {
    function Headers(id) {
        this._id = id;
        this._monthObj = new Month();
        this._calendar = new Calendar(this._id);
        this._DOMElements = {};
    }

    Headers.prototype.initializeDOM = function (currDateSelection, minDate, maxDate, datePicker) {
        this._DOMElements = {
            monthName: document.getElementById(`monthName-${this._id}`),
            yearName: document.getElementById(`yearName-${this._id}`),
            monthHeader: document.getElementById(`monthHeader-${this._id}`),
            yearHeader: document.getElementById(`yearHeader-${this._id}`)
        };
        this._DOMElements.monthHeader.querySelector('.left').addEventListener("click", this.showPreviousMonth.bind(this, currDateSelection, minDate, maxDate, datePicker));
        this._DOMElements.monthHeader.querySelector('.right').addEventListener("click", this.showNextMonth.bind(this, currDateSelection, minDate, maxDate, datePicker));
        this._DOMElements.yearHeader.querySelector('.left').addEventListener("click", this.showPreviousYear.bind(this, currDateSelection, minDate, maxDate, datePicker));
        this._DOMElements.yearHeader.querySelector('.right').addEventListener("click", this.showNextYear.bind(this, currDateSelection, minDate, maxDate, datePicker));
    }

    Headers.prototype.renderHeaders = function (currDateSelection, datePicker) {
        let headerContainer = document.createElement('div');
        headerContainer.className = "headerContainer";
        headerContainer.id = `headerContainer-${this._id}`;

        headerContainer.appendChild(this.renderMonthHeader(currDateSelection, datePicker));
        headerContainer.appendChild(this.renderYearHeader(currDateSelection, datePicker));
        headerContainer.appendChild(this.renderWeekHeader());
        return headerContainer;
    }

    Headers.prototype.renderMonthHeader = function (currDateSelection, datePicker) {
        let monthHeader = document.createElement('div');
        monthHeader.className = "monthHeader";
        monthHeader.id = `monthHeader-${this._id}`;
        let sHtml = `<img class = "left" src = "images/chevron-left.png"> 
            <text class = "monthName" id = "monthName-${this._id}" >${this._monthObj.getMonthInWords(currDateSelection.getMonth())}</text>
                <img class = "right" src = "images/chevron-left.png" > `;
        monthHeader.innerHTML = sHtml;
        return monthHeader;
    }

    Headers.prototype.showPreviousMonth = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currMonth = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        let yearName = +this._DOMElements.yearName.textContent;
        if (yearName > +minDate.getFullYear() ||
            (yearName === +minDate.getFullYear() &&
                currMonth > +minDate.getMonth())) {
            let prevMonth = currMonth - 1;

            if (prevMonth < 0) {
                prevMonth = 11;
                yearName = +this._DOMElements.yearName.textContent - 1;
                this._DOMElements.yearName.textContent = yearName;
            }
            this._DOMElements.monthName.textContent = this._monthObj.getMonthInWords(prevMonth);
            let date = new Date(yearName, prevMonth, 1);
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));
        }
        else alert("Date can't be lesser than minimum Date");
    }

    Headers.prototype.showNextMonth = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currMonth = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        let yearName = +this._DOMElements.yearName.textContent;
        if (yearName < +maxDate.getFullYear() ||
            (yearName === +maxDate.getFullYear() &&
                currMonth < +maxDate.getMonth())) {
            let nextMonth = currMonth + 1;
            if (nextMonth > 11) {
                nextMonth = 0;
                yearName = +this._DOMElements.yearName.textContent + 1;
                this._DOMElements.yearName.textContent = yearName;
            }
            this._DOMElements.monthName.textContent = this._monthObj.getMonthInWords(nextMonth);
            let date = new Date(yearName, nextMonth, 1);
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));
        }
        else alert("Date can't be more than maximum Date");
    }

    Headers.prototype.renderYearHeader = function (currDateSelection, datePicker) {
        let yearHeader = document.createElement('div');
        yearHeader.className = "yearHeader";
        yearHeader.id = `yearHeader-${this._id}`;
        let sHtml = `<img class = "left" src = "images/chevron-left.png" > 
        <text class = "yearName" id = "yearName-${this._id}" >${currDateSelection.getFullYear()}</text>
        <img class="right" src="images/chevron-left.png">`;
        yearHeader.innerHTML = sHtml;
        return yearHeader;
    }

    Headers.prototype.showPreviousYear = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currYear = +this._DOMElements.yearName.textContent;
        let monthName = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        if (currYear > +minDate.getFullYear() + 1
            || (currYear === +minDate.getFullYear() + 1 && +monthName >= +minDate.getMonth())) {
            yearName = +currYear - 1;
            this._DOMElements.yearName.textContent = yearName;
            let date = new Date(yearName, monthName, 1);
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));
        }
        else alert("Date can't be more than maximum Date");
    }

    Headers.prototype.showNextYear = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currYear = +this._DOMElements.yearName.textContent;
        let monthName = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        if (currYear < +maxDate.getFullYear() - 1
            || (currYear === +maxDate.getFullYear() - 1 && +monthName <= +maxDate.getMonth())) {
            let yearName = +currYear + 1;
            this._DOMElements.yearName.textContent = yearName;
            let date = new Date(yearName, monthName, 1);
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));
        }
        else alert("Date can't be more than maximum Date");
    }

    Headers.prototype.renderWeekHeader = function () {
        let weekHeader = document.createElement('div');
        weekHeader.className = "weekHeader";
        weekHeader.id = `weekHeader-${this._id}`;
        const daysOfWeek = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday"
        };
        for (day in daysOfWeek) {
            dayHeader = document.createElement('div');
            dayHeader.className = "dayHeader";
            dayHeader.id = `dayHeader-${this._id}`;
            dayHeader.innerHTML = daysOfWeek[day].slice(0, 1);
            weekHeader.appendChild(dayHeader);
        }
        return weekHeader;
    }

    window.Headers = Headers;
})();
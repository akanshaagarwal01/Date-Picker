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
            yearHeader: document.getElementById(`yearHeader-${this._id}`),
            prevMonthArrow: document.getElementById(`prevMonth-${this._id}`),
            nextMonthArrow: document.getElementById(`nextMonth-${this._id}`),
            prevYearArrow: document.getElementById(`prevYear-${this._id}`),
            nextYearArrow: document.getElementById(`nextYear-${this._id}`)
        };
        let active;
        if (minDate || maxDate) {
            active = this.calcActive(currDateSelection.getFullYear(), currDateSelection.getMonth(), minDate, maxDate);
            Object.keys(active).forEach(key => {
                if (!active[key]) {
                    this._DOMElements[key].classList.add("inactive");
                }
                else {
                    this._DOMElements[key].classList.remove("inactive");
                }
            });
        }
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

    Headers.prototype.calcActive = function (currYear, currMonth, minDate, maxDate) {
        let activeList = {
            prevMonthArrow: true,
            nextMonthArrow: true,
            prevYearArrow: true,
            nextYearArrow: true
        }
        if (minDate && (currYear <= +minDate.getFullYear() && currMonth <= +minDate.getMonth())) {
            activeList.prevMonthArrow = false;
            activeList.prevYearArrow = false;
        }

        if (maxDate && (currYear >= +maxDate.getFullYear() && currMonth >= +maxDate.getMonth())) {
            activeList.nextMonthArrow = false;
            activeList.nextYearArrow = false;
        }

        if (minDate && (currYear <= +minDate.getFullYear()
            || (currYear <= +minDate.getFullYear() + 1 && +currMonth < +minDate.getMonth()))) {
            activeList.prevYearArrow = false;
        }

        if (maxDate && (currYear >= +maxDate.getFullYear()
            || (currYear >= +maxDate.getFullYear() - 1 && +currMonth > +maxDate.getMonth()))) {
            activeList.nextYearArrow = false;
        }
        return activeList;
    }


    Headers.prototype.renderMonthHeader = function (currDateSelection, datePicker) {
        let monthHeader = document.createElement('div');
        monthHeader.className = "monthHeader";
        monthHeader.id = `monthHeader-${this._id}`;
        let sHtml = `<img class = "left" id = "prevMonth-${this._id}" src = "images/chevron-left.png"> 
            <text class = "monthName" id = "monthName-${this._id}" >${this._monthObj.getMonthInWords(currDateSelection.getMonth())}</text>
                <img class = "right" id = "nextMonth-${this._id}" src = "images/chevron-left.png" > `;
        monthHeader.innerHTML = sHtml;
        return monthHeader;
    }

    Headers.prototype.showPreviousMonth = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currMonth = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        let yearName = +this._DOMElements.yearName.textContent;
        if (!this._DOMElements.prevMonthArrow.classList.contains("inactive")) {
            let prevMonth = currMonth - 1;

            if (prevMonth < 0) {
                prevMonth = 11;
                yearName = +this._DOMElements.yearName.textContent - 1;
                this._DOMElements.yearName.textContent = yearName;
                if (datePicker._particulars.onYearChange) {
                    datePicker._particulars.updatedYear = yearName;
                    datePicker._particulars.onYearChange(datePicker._particulars);
                }
            }
            this._DOMElements.monthName.textContent = this._monthObj.getMonthInWords(prevMonth);
            let date = new Date(yearName, prevMonth, 1);
            if (datePicker._particulars.onMonthChange) {
                datePicker._particulars.updatedMonth = prevMonth;
                datePicker._particulars.onMonthChange(datePicker._particulars);
            }
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));

            // minDate if passed, should restrict rendering previous month, if month goes beyond it
            let active;
            if (minDate) {
                active = this.calcActive(yearName, prevMonth, minDate, maxDate);
                Object.keys(active).forEach(key => {
                    if (!active[key]) {
                        this._DOMElements[key].classList.add("inactive");
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                    }
                });
            }
        }
    }

    Headers.prototype.showNextMonth = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currMonth = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        let yearName = +this._DOMElements.yearName.textContent;
        if (!this._DOMElements.nextMonthArrow.classList.contains("inactive")) {
            let nextMonth = currMonth + 1;

            if (nextMonth > 11) {
                nextMonth = 0;
                yearName = +this._DOMElements.yearName.textContent + 1;
                this._DOMElements.yearName.textContent = yearName;
                if (datePicker._particulars.onYearChange) {
                    datePicker._particulars.updatedYear = yearName;
                    datePicker._particulars.onYearChange(datePicker._particulars);
                }
            }
            this._DOMElements.monthName.textContent = this._monthObj.getMonthInWords(nextMonth);
            let date = new Date(yearName, nextMonth, 1);
            if (datePicker._particulars.onMonthChange) {
                datePicker._particulars.updatedMonth = nextMonth;
                datePicker._particulars.onMonthChange(datePicker._particulars);
            }
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));

            // maxDate if passed, should restrict rendering next month, if month goes beyond it
            let active;
            if (maxDate) {
                active = this.calcActive(yearName, nextMonth, minDate, maxDate);
                Object.keys(active).forEach(key => {
                    if (!active[key]) {
                        this._DOMElements[key].classList.add("inactive");
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                    }
                });
            }
        }
    }

    Headers.prototype.renderYearHeader = function (currDateSelection, datePicker) {
        let yearHeader = document.createElement('div');
        yearHeader.className = "yearHeader";
        yearHeader.id = `yearHeader-${this._id}`;
        let sHtml = `<img class = "left" id = "prevYear-${this._id}" src = "images/chevron-left.png" > 
        <text class = "yearName" id = "yearName-${this._id}" >${currDateSelection.getFullYear()}</text>
        <img class="right" id = "nextYear-${this._id}" src="images/chevron-left.png">`;
        yearHeader.innerHTML = sHtml;
        return yearHeader;
    }

    Headers.prototype.showPreviousYear = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currYear = +this._DOMElements.yearName.textContent;
        let monthName = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        if (!this._DOMElements.prevYearArrow.classList.contains("inactive")) {
            yearName = +currYear - 1;
            this._DOMElements.yearName.textContent = yearName;
            let date = new Date(yearName, monthName, 1);
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));
            if (datePicker._particulars.onYearChange) {
                datePicker._particulars.updatedYear = yearName;
                datePicker._particulars.onYearChange(datePicker._particulars);
            }
            // minDate if passed, should restrict rendering previous year, if year goes beyond it
            let active;
            if (minDate) {
                active = this.calcActive(yearName, monthName, minDate, maxDate);
                Object.keys(active).forEach(key => {
                    if (!active[key]) {
                        this._DOMElements[key].classList.add("inactive");
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                    }
                });
            }
        }
    }

    Headers.prototype.showNextYear = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currYear = +this._DOMElements.yearName.textContent;
        let monthName = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        if (!this._DOMElements.nextYearArrow.classList.contains("inactive")) {
            let yearName = +currYear + 1;
            this._DOMElements.yearName.textContent = yearName;
            let date = new Date(yearName, monthName, 1);
            document.getElementById(`monthContainer-${this._id}`).replaceWith(this._calendar.renderCalendar(date, minDate, maxDate, datePicker));
            if (datePicker._particulars.onYearChange) {
                datePicker._particulars.updatedYear = yearName;
                datePicker._particulars.onYearChange(datePicker._particulars);
            }
            // maxDate if passed, should restrict rendering previous year, if year goes beyond it
            let active;
            if (maxDate) {
                active = this.calcActive(yearName, monthName, minDate, maxDate);
                Object.keys(active).forEach(key => {
                    if (!active[key]) {
                        this._DOMElements[key].classList.add("inactive");
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                    }
                });
            }
        }

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
            dayHeader.innerHTML = daysOfWeek[day].slice(0, 3);
            weekHeader.appendChild(dayHeader);
        }
        return weekHeader;
    }

    window.Headers = Headers;
})();
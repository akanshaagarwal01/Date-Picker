import Month from './month';
import Calendar from './calendar';
(function () {
    function Headers(id) {
        this._id = id;
        this._monthObj = new window.Month();
        this._calendar = new window.Calendar(this._id);
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
                    this._DOMElements[key].style.fill = "rgb(97, 95, 95)";
                }
                else {
                    this._DOMElements[key].classList.remove("inactive");
                    this._DOMElements[key].style.fill = "rgb(248, 247, 247)";
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
        let svgPath = "M409.13 109.2c-19.608-33.592-46.205-60.189-79.798-79.796C295.733 9.798 259.055-.003 219.272-.003c-39.781 0-76.47 9.801-110.06 29.407-33.595 19.604-60.192 46.201-79.8 79.796C9.803 142.797.002 179.486.002 219.26c0 39.78 9.804 76.463 29.407 110.06 19.607 33.592 46.204 60.189 79.799 79.798 33.597 19.605 70.283 29.407 110.06 29.407s76.47-9.802 110.06-29.407c33.593-19.602 60.189-46.206 79.795-79.798 19.603-33.596 29.403-70.284 29.403-110.06.001-39.782-9.8-76.472-29.399-110.06zM288.64 306.91c3.621 3.614 5.435 7.901 5.435 12.847 0 4.948-1.813 9.236-5.435 12.847l-29.126 29.13c-3.61 3.617-7.891 5.428-12.84 5.421-4.951 0-9.232-1.811-12.854-5.421L104.2 232.104c-3.617-3.62-5.424-7.898-5.424-12.848 0-4.949 1.807-9.233 5.424-12.847l129.62-129.62c3.621-3.615 7.902-5.424 12.854-5.424 4.949 0 9.229 1.809 12.84 5.424l29.126 29.13c3.621 3.615 5.435 7.898 5.435 12.847 0 4.946-1.813 9.233-5.435 12.845l-87.646 87.65 87.646 87.646z"
        let sHtml = `<svg class = "left" id = "prevMonth-${this._id}" 
        viewBox="0 0 600 600" width="20px" height="20px" fill="rgb(248, 247, 247)" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}"/></svg>
            <text class="monthName" id="monthName-${this._id}" >${this._monthObj.getMonthInWords(currDateSelection.getMonth())}</text>
            <svg class = "right" id = "nextMonth-${this._id}" 
        viewBox="0 0 600 600" width="20px" height="20px" fill="rgb(248, 247, 247)" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}"/></svg>`;
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
                        this._DOMElements[key].style.fill = "rgb(97, 95, 95)";
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                        this._DOMElements[key].style.fill = "rgb(248, 247, 247)";
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
                        this._DOMElements[key].style.fill = "rgb(97, 95, 95)";
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                        this._DOMElements[key].style.fill = "rgb(248, 247, 247)";
                    }
                });
            }
        }
    }

    Headers.prototype.renderYearHeader = function (currDateSelection, datePicker) {
        let yearHeader = document.createElement('div');
        yearHeader.className = "yearHeader";
        yearHeader.id = `yearHeader-${this._id}`;
        let svgPath = "M409.13 109.2c-19.608-33.592-46.205-60.189-79.798-79.796C295.733 9.798 259.055-.003 219.272-.003c-39.781 0-76.47 9.801-110.06 29.407-33.595 19.604-60.192 46.201-79.8 79.796C9.803 142.797.002 179.486.002 219.26c0 39.78 9.804 76.463 29.407 110.06 19.607 33.592 46.204 60.189 79.799 79.798 33.597 19.605 70.283 29.407 110.06 29.407s76.47-9.802 110.06-29.407c33.593-19.602 60.189-46.206 79.795-79.798 19.603-33.596 29.403-70.284 29.403-110.06.001-39.782-9.8-76.472-29.399-110.06zM288.64 306.91c3.621 3.614 5.435 7.901 5.435 12.847 0 4.948-1.813 9.236-5.435 12.847l-29.126 29.13c-3.61 3.617-7.891 5.428-12.84 5.421-4.951 0-9.232-1.811-12.854-5.421L104.2 232.104c-3.617-3.62-5.424-7.898-5.424-12.848 0-4.949 1.807-9.233 5.424-12.847l129.62-129.62c3.621-3.615 7.902-5.424 12.854-5.424 4.949 0 9.229 1.809 12.84 5.424l29.126 29.13c3.621 3.615 5.435 7.898 5.435 12.847 0 4.946-1.813 9.233-5.435 12.845l-87.646 87.65 87.646 87.646z"
        let sHtml = `<svg class="left" id="prevYear-${this._id}" viewBox="0 0 600 600" width="20px" height="20px" 
        fill="rgb(248, 247, 247)" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}"/></svg>
                    <text class="yearName" id="yearName-${this._id}" >${currDateSelection.getFullYear()}</text>
                    <svg class="right" id="nextYear-${this._id}" viewBox="0 0 600 600" width="20px" height="20px" 
                    fill="rgb(248, 247, 247)" xmlns="http://www.w3.org/2000/svg"><path d="${svgPath}"/></svg>`;
        yearHeader.innerHTML = sHtml;
        return yearHeader;
    }

    Headers.prototype.showPreviousYear = function (currDateSelection, minDate, maxDate, datePicker, e) {
        let currYear = +this._DOMElements.yearName.textContent;
        let monthName = +this._monthObj.getMonthInNumber(this._DOMElements.monthName.textContent);
        if (!this._DOMElements.prevYearArrow.classList.contains("inactive")) {
            let yearName = +currYear - 1;
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
                        this._DOMElements[key].style.fill = "rgb(97, 95, 95)";
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                        this._DOMElements[key].style.fill = "rgb(248, 247, 247)";
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
                        this._DOMElements[key].style.fill = "rgb(97, 95, 95)";
                    }
                    else {
                        this._DOMElements[key].classList.remove("inactive");
                        this._DOMElements[key].style.fill = "rgb(248, 247, 247)";
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
            0: "SUNDAY",
            1: "MONDAY",
            2: "TUESDAY",
            3: "WEDNESDAY",
            4: "THURSDAY",
            5: "FRIDAY",
            6: "SATURDAY"
        };
        for (const day in daysOfWeek) {
            let dayHeader = document.createElement('div');
            dayHeader.className = "dayHeader";
            dayHeader.id = `dayHeader-${this._id}`;
            dayHeader.innerHTML = daysOfWeek[day].slice(0, 3);
            weekHeader.appendChild(dayHeader);
        }
        return weekHeader;
    }
    window.Headers = Headers;
    return Headers;
})();

// export default Headers;
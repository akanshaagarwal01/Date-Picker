(function () {
    function Calendar(id) {
        this._id = id;
        this._monthObj = new Month();
    }

    Calendar.prototype.renderCalendar = function (currDateSelection, minDate, maxDate, datePicker) {
        let year = currDateSelection.getFullYear();
        let month = currDateSelection.getMonth();
        let dd = currDateSelection.getDate();
        let date = new Date(year, month);
        let firstDay = date.getDay();
        let monthContainer = document.createElement('div');
        monthContainer.className = "monthContainer";
        monthContainer.id = `monthContainer-${this._id}`;
        if (firstDay > 0) {
            let weekContainer = document.createElement('div');
            weekContainer.className = "weekContainer";
            for (let i = firstDay; i > 0; i--) {
                let dayContainer = makeDayContainer(true, { year, month, date: date.getDate() - i }, minDate, maxDate);
                weekContainer.appendChild(dayContainer);
            }
            for (let i = firstDay; i <= 6; i++) {
                let dayContainer = makeDayContainer(false, { date }, minDate, maxDate);
                weekContainer.appendChild(dayContainer);
                date.setDate(date.getDate() + 1);
            }
            monthContainer.append(weekContainer);
        }
        let weekContainer = document.createElement('div');
        weekContainer.className = "weekContainer";
        while (date.getMonth() === month) {
            let dayContainer = makeDayContainer(false, { date }, minDate, maxDate);
            weekContainer.appendChild(dayContainer);
            if (date.getDay() === 6) {
                monthContainer.append(weekContainer);
                weekContainer = document.createElement('div');
                weekContainer.className = "weekContainer";
            }
            date.setDate(date.getDate() + 1);
            monthContainer.append(weekContainer);
        }
        if (date.getDay() < 6) {
            for (let i = date.getDay(); i <= 6; i++) {
                weekContainer = monthContainer.lastElementChild;
                let dayContainer = makeDayContainer(true, { year, month: date.getMonth(), date: date.getDate() }, minDate, maxDate);
                weekContainer.appendChild(dayContainer);
                date.setDate(date.getDate() + 1);
            }
        }

        function makeDayContainer(custom, dateObj, minDate, maxDate) {
            let offRange = false;
            //if minDate or maxDate, or both restrictons exist, the dates beyond them should be rendered as non-selectable. 
            if (!custom && (minDate || maxDate) &&
                ((!minDate ||
                    (minDate &&
                        (dateObj.date.getFullYear() === minDate.getFullYear()
                            && dateObj.date.getMonth() === minDate.getMonth()
                            && dateObj.date.getDate() < minDate.getDate()))
                ) ||
                    (!maxDate ||
                        (maxDate &&
                            (dateObj.date.getFullYear() === maxDate.getFullYear()
                                && dateObj.date.getMonth() === maxDate.getMonth()
                                && dateObj.date.getDate() > maxDate.getDate()))
                    ))
            ) {
                offRange = true;
            }
            let dayContainer = document.createElement('div');
            dayContainer.className = (custom || offRange) ? "dayContainer inactive" : "dayContainer active";
            dayContainer.innerHTML = custom ? new Date(dateObj.year, dateObj.month, dateObj.date).getDate()
                : dateObj.date.getDate();
            if (!custom && (dateObj.date.getDate() === datePicker._particulars.currentDateSelection.getDate()
                && dateObj.date.getMonth() === datePicker._particulars.currentDateSelection.getMonth()
                && dateObj.date.getFullYear() === datePicker._particulars.currentDateSelection.getFullYear())) {
                dayContainer.classList.add("selectedDate");
            }
            return dayContainer;
        }
        monthContainer.addEventListener("click", this.pickADate.bind(this, month, year, datePicker));
        return monthContainer;
    }

    Calendar.prototype.pickADate = function (month, year, datePicker, event) {
        if (!event.target.classList.contains('inactive') && event.target.classList.contains('dayContainer')) {
            let prevSelected = document.getElementsByClassName("dayContainer selectedDate")[0];
            if (prevSelected) {
                prevSelected.classList.remove("selectedDate");
            }
            event.target.classList.add("selectedDate");
            let date = new Date(year, month, event.target.textContent);
            datePicker._particulars.currentDateSelection = date;
            if (datePicker._particulars.onDateSelect) {
                datePicker._particulars.onDateSelect(datePicker._particulars);
            }
            document.getElementById(`container-${this._id}`).remove();
        }
    }

    window.Calendar = Calendar;
})();
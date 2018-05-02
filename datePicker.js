(function () {
    function DatePicker(parent, particulars) {
        this._parent = parent;
        this._particulars = particulars;
        this._currDateSelection = new Date(this._particulars.currentDateSelection);
        this._minDate = new Date(this._particulars.minDate);
        this._maxDate = new Date(this._particulars.maxDate);
        this._id = this._particulars.id;
        this._monthObj = new Month();
        this._headers = new Headers(this._id);
        this._calendar = new Calendar(this._id);
        DatePicker.prototype.renderDatePicker.call(this);
    };

    DatePicker.prototype.renderDatePicker = function () {
        if ((this._currDateSelection.getFullYear() > this._minDate.getFullYear() ||
            (this._currDateSelection.getFullYear() === this._minDate.getFullYear() &&
                this._currDateSelection.getMonth() >= this._minDate.getMonth()))
            && (this._currDateSelection.getFullYear() < this._maxDate.getFullYear() ||
                (this._currDateSelection.getFullYear() === this._maxDate.getFullYear() &&
                    this._currDateSelection.getMonth() <= this._maxDate.getMonth()))) {
            let parentDimensions = this._parent.getBoundingClientRect();
            let selected = document.getElementById(`selected-${this._id}`);
            if (!selected) {
                document.body.appendChild(this.renderSelectedDate(parentDimensions));
            }
            let container = document.createElement("div");
            container.className = "container";
            container.id = `container-${this._id}`;
            container.style.top = +parentDimensions.bottom + 50 + 'px';
            container.style.left = +parentDimensions.left;
            container.appendChild(this._headers.renderHeaders(this._currDateSelection, this));
            container.appendChild(this._calendar.renderCalendar(this._currDateSelection, this._minDate, this._maxDate, this));
            document.body.appendChild(container);
            document.body.addEventListener("click", this.hideDatePicker.bind(this));
            this._headers.initializeDOM(this._currDateSelection, this._minDate, this._maxDate, this);
        }
        else alert("Out of range dates !");
    };

    DatePicker.prototype.hideDatePicker = function (event) {
        let container = document.getElementById(`container-${this._id}`);
        let target = event.target;
        if (target !== this._parent && container) {
            while (target !== container && target !== document.body) {
                target = target.parentElement;
            }
            if (target === document.body) {
                container.remove();
            }
        }
    };

    DatePicker.prototype.renderSelectedDate = function (parentDimensions) {
        let selected = document.createElement('div');
        selected.id = `selected-${this._id}`;
        selected.className = "selected";
        selected.innerHTML = `${this._currDateSelection.getDate()}-${this._monthObj.getMonthInWords(this._currDateSelection.getMonth())}-${this._currDateSelection.getFullYear()}`;
        selected.style.top = +parentDimensions.bottom + 10 + 'px';
        selected.style.left = +parentDimensions.left + 'px';
        return selected;
    };

    window.DatePicker = DatePicker;
})();
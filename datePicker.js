(function () {
    function DatePicker(parent, particulars) {
        this._parent = parent;
        this._particulars = particulars;
        this._currDateSelection = new Date(this._particulars.currentDateSelection);
        this._id = this._particulars.id;
        this._monthObj = new Month();
        this._headers = new Headers(this._id);
        this._calendar = new Calendar(this._id);
        DatePicker.prototype.renderDatePicker.call(this);
    }

    DatePicker.prototype.renderDatePicker = function (currDateSelection = this._currDateSelection) {
        let selected = document.getElementById(`selected-${this._id}`);
        if (!selected) {
            this._parent.appendChild(this.renderSelectedDate());
        }
        let container = document.createElement("div");
        container.className = "container";
        container.id = `container-${this._id}`;
        container.appendChild(this._headers.renderHeaders(this._currDateSelection, this));
        container.appendChild(this._calendar.renderCalendar(this._currDateSelection, this));
        this._parent.appendChild(container);
        this._headers.initializeDOM(this);
    };

    DatePicker.prototype.renderSelectedDate = function (currDateSelection = this._currDateSelection) {
        let selected = document.createElement('div');
        selected.id = `selected-${this._id}`;
        selected.className = "selected";
        selected.innerHTML = `${currDateSelection.getDate()}-${this._monthObj.getMonthInWords(currDateSelection.getMonth())}-${currDateSelection.getFullYear()}`;
        return selected;
    }

    window.DatePicker = DatePicker;
})();
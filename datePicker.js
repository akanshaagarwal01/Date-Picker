(function () {
    function DatePicker(parent, particulars) {
        this._parent = parent;
        this._particulars = particulars;
        this._currDateSelection = this._particulars.currentDateSelection ?
            new Date(this._particulars.currentDateSelection) : new Date();
        this._minDate = this._particulars.minDate ? new Date(this._particulars.minDate) : undefined;
        this._maxDate = this._particulars.maxDate ? new Date(this._particulars.maxDate) : undefined;
        this._id = this._particulars.id;
        this._monthObj = new Month();
        this._headers = new Headers(this._id);
        this._calendar = new Calendar(this._id);
        DatePicker.prototype.renderDatePicker.call(this);
    };

    DatePicker.prototype.renderDatePicker = function () {
        let parentDimensions = this._parent.getBoundingClientRect();
        let selected = document.getElementById(`selected-${this._id}`);
        let container = document.createElement("div");
        container.className = "container";
        container.id = `container-${this._id}`;
        container.style.top = +parentDimensions.bottom + 10 + 'px';
        container.style.left = +parentDimensions.left;
        container.appendChild(this._headers.renderHeaders(this._currDateSelection, this));
        container.appendChild(this._calendar.renderCalendar(this._currDateSelection, this._minDate, this._maxDate, this));
        document.body.appendChild(container);
        document.body.addEventListener("click", this.hideDatePicker.bind(this));
        this._headers.initializeDOM(this._currDateSelection, this._minDate, this._maxDate, this);
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

    window.DatePicker = DatePicker;
})();
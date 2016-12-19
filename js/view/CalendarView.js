var CalendarView = function () {
    this.initialize = function () {
        this.el = $('<div/>');
    };

    this.render = function () {
        this.el.html(CalendarView.template());
        return this;
    };

    this.loadEvents = function () {
        return this;
    };

    this.initialize();
};

CalendarView.template = Handlebars.compile($("#calendar-tpl").html());

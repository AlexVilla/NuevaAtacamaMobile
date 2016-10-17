var CalendarView = function () {
    this.initialize = function () {
        this.el = $('<div/>');
        //this.el.ready(this.loadEvents);
    };

    this.render = function () {
        this.el.html(CalendarView.template());
        return this;
    };

    this.loadEvents = function () {
//        var JsonEvents = JSON.parse(events);
//        var JsonEvents = JsonEvents.items;
//        var cal = new Array({});
//        for(var i = 0; i < JsonEvents.length; i++){
//            if(JsonEvents[i].status==="confirmed")
//                {
//                    cal[i] = "elemento "+i;
//                    cal[i].location = JsonEvents[i]['location'];
//                    cal[i].endDate = JsonEvents[i]['end']['datetime'];
//                    cal[i].startDate = JsonEvents[i]['start']['datetime'];
//                    cal[i].location = JsonEvents[i]['summary'];
//                }
//        }
//        $('.calendar-content').html(CalendarView.liTemplate());
        return this;
    };

    this.initialize();
};

CalendarView.template = Handlebars.compile($("#calendar-tpl").html());
//CalendarView.liTemplate = Handlebars.compile($("#calendar-li-tpl").html());

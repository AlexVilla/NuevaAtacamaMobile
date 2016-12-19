'use strict';
var app = {
    changeImg: function(ancho) {
        if (ancho < 768) {
            $(".logo > img").attr("src", "img/logo-small.png");
        } else if (ancho >= 768 && ancho < 992) {
            $(".logo > img").attr("src", "img/logo-medium.png");
        } else if (ancho >= 992 && ancho < 1200) {
            $(".logo > img").attr("src", "img/logo-large.png");
        } else {
            $(".logo > img").attr("src", "img/logo-big.png");
        }
    },

    showAlert: function(message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    showConfirm: function(message, title) {
        var value = "";
        if (navigator.notification) {
            value = navigator.notification.confirm(message, app.onConfirmTransm, title, ['Continuar', 'Cancelar']);
        } else {
            value = confirm(title ? (title + ": " + message) : message);
            app.onConfirmTransm(1);
        }
    },


    onConfirmTransm: function(button) {
        if (button === 1) {
            $.proxy(app.showAlert("Está a punto de ser redirigido a nuestro sitio web", "Atención"), app);
            window.setTimeout(function() {
                if (device.platform == "Android") {
                    navigator.app.loadUrl('http://www.iglesianuevatacama.cl/m/#./EN-VIVO', {
                        openExternal: true
                    });
                } else if (device.platform == "iOS") {
                    cordova.InAppBrowser.open(encodeURI('http://www.iglesianuevatacama.cl/m/#./EN-VIVO'), '_system');
                }
            }, 2000);
        } else {
            window.location.hash = '';
        }
    },
    route: function() {
        var hash = window.location.hash;
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return;
        }

        //ver si el hash es igual al establecido en la variable detailsURL dentro de la funcion
        //initialize, de ser así rendereriza lo que corresponde
        var match = hash.match(app.detailsURL);
        switch (String(match).split("/")[0]) {
            case "#himnario":
                $('body').html(new HimnarioView(this.store).render().el);
                break;
            case "#himno":
                this.store.findByNumber(String(match).split("/")[1], function(numero) {
                    $('body').html(new LetraView(numero).render().el);
                });
                break;
            case "#calendar":
                $('body').html(new CalendarView().render().el);
                break;
            default:
                //$.proxy(this.showAlert("Contacte a soporte", "Error"), this);
                $('body').html(new HomeView(self.store).render().el);
        }
    },

    registerEvents: function() {
        $(".goHimnario").click(function() {
            window.location.hash = '#himnario';
        });
        $(".goOnline").click(function() {
            var networkState = navigator.connection.type;
            if (networkState != "wifi") {
                if (networkState == "none") {
                    $.proxy(app.showAlert("Necesita internet para acceder", "Error"), app);
                } else {
                    $.proxy(app.showConfirm("Esta acción puede consumir datos móviles", "ATENCION"), app);
                }
            } else {
                $.proxy(app.showAlert("Está a punto de ser redirigido a nuestro sitio web", "Atención"), app);
                window.setTimeout(function() {
                    if (device.platform == "Android") {
                        navigator.app.loadUrl('http://www.iglesianuevatacama.cl/m/#./EN-VIVO', {
                            openExternal: true
                        });
                    } else if (device.platform == "iOS") {
                        cordova.InAppBrowser.open(encodeURI('http://www.iglesianuevatacama.cl/m/#./EN-VIVO'), '_system');
                    }
                }, 2000);
            }
        });

        $(".goCalendar").click(function() {
            var networkState = navigator.connection.type;
            if (networkState === "none") {
                $.proxy(app.showAlert("Necesita internet para acceder", "Error"), app);
            } else {
            window.location.hash = '#calendar';
            } 
        });
        $(window).on('hashchange', $.proxy(this.route, this));
    },

    onDeviceReady: function() {
        if (device.platform == "iOS") {
            StatusBar.styleBlackOpaque();
            StatusBar.overlaysWebView(false);
            StatusBar.backgroundColorByHexString("#62555c");
            $(".logo").css("margin", "10px 0");
        }
    },

    onBackKeyDown: function(e) {
        e.preventDefault();
        var hash = window.location.hash;
        if (hash === "") {
            if (navigator.notification) {
                var value = navigator.notification.confirm("¿Realmente desea salir de la aplicación?", $.proxy(this.exit, this), 'Salir', ['Salir', 'Cancelar']);
            } else {
                navigator.app.exitApp();
            }
        }
        var backURL = /^#himnario|^#himno\/(\d{1,})|#calendar/g;
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return;
        }
        //ver si el hash es igual al establecido en la variable detailsURL dentro de la funcion
        //initialize, de ser así rendereriza lo que corresponde
        var match = hash.match(backURL);
        switch (String(match).split("/")[0]) {
            case "#himnario":
                window.location = '';
                break;
            case "#himno":
                window.location.hash = '#himnario';
                break;
            case "#calendar":
                window.location = '';
                break;
            default:
                return;
        }
    },

    exit: function(option) {
        if (option == 1) {
            navigator.app.exitApp();
        } else {
            window.location = '';
        }
    },

    initialize: function() {
        this.homeTpl = Handlebars.compile($("#home-tpl").html());
        this.detailsURL = /^#himnario|^#himno\/(\d{1,})|#calendar/g;
        var self = this;
        this.store = new LocalStorageStore(function() {
            $('body').html(new HomeView(self.store).render().el);
            self.registerEvents();
        });
        document.addEventListener("backbutton", $.proxy(this.onBackKeyDown, this), false);
        document.addEventListener("deviceready", $.proxy(this.onDeviceReady, this), false);
    }
};

var himno = {
    reduceFontRecur: function(elem) {
        var font = Math.round(parseInt($(elem).css('font-size')));
        var fontText = "font-size: " + (font - 1) + "px !important";
        $(elem).attr('style', fontText);
        var element = parseInt($(elem).width());
        var win = parseInt($(window).width());
        if (element >= win) {
            reduceFontRecur(elem);
        } else {
            $(elem).css('overflow', 'hidden', 'important');
            return true;
        }
    },

    changeSize: function(type) {
        var sizeAttr = $('pre').attr('style').split(":");
        var sizeCSS = $('pre').css('font-size').split(":");
        var actualSizeAttr = Math.round(parseInt(sizeAttr[1].split(" ")[1]));
        var actualSizeCSS = Math.round(parseInt(sizeCSS));
        var actualSize = 0;
        //verificar cual es el mayor tamaño de letra
        if (actualSizeCSS > actualSizeAttr) {
            actualSize = actualSizeCSS;
        } else if (actualSizeCSS < actualSizeAttr) {
            actualSize = actualSizeAttr;
        } else {
            actualSize = actualSizeAttr;
        }
        var value = "",
            newSize = 0;
        if (type == 1) {
            newSize = actualSize + 2;
            value = "font-size: " + newSize + "px !important";
        } else if (type == 2) {
            newSize = actualSize - 2;
            value = "font-size: " + newSize + "px !important";
        }
        $('pre').css('cssText', value);
    }
};


var calendar = {
    showMap: function(q) {
        var device = navigator.userAgent;
        var url = 'http://maps.google.com?q=' + q;
        if (device.match(/Iphone/i) || device.match(/iPhone|iPad|iPod/i)) {
            // iOs
            //url = 'http://maps.apple.com/maps?q=Current%20Location&daddr=' + q;
            url = 'maps://?q=' + q;
        } else if (device.match(/Android/i)) {
            // Android
            url = 'geo:0,0?q=' + q;
        }
        return url;
    },

    openoptions: function(element) {
        var actividad = $(element).children('.summary').text();
        var direccion = $(element).children('.location').text().replace(/\s/gi, "+").split('/');
        var modal = $('#myModal');
        if (direccion[0]=="") {
            $('#maps').css('display', 'none');
        }else{
            $('#maps').css('display', 'inherit');
            var LocationURL = calendar.showMap(direccion[0]);
            modal.find('#maps').attr('href', LocationURL);
        }
        var date = $(element).children('.date').text();
        modal.find('.modal-title').text(actividad);
        modal.find('#calendar').attr('data-date', date);
        modal.find('#calendar').attr('data-title', actividad);
        modal.find('#calendar').attr('data-location', direccion);
        $('#myModal').modal();
    },

    openoptions2: function(element) {
        var actividad = $(element).children('.summary').text();
        var direccion = $(element).children('.location').text().replace(/\s/gi, "+").split('/');
        var LocationURL = calendar.showMap(direccion[0]);
        var modal = $('#myModal2');
        modal.find('.modal-title').text(actividad);
        modal.find('#maps').attr('href', LocationURL);
        $('#myModal2').modal();
    },
    transformDate: function(date) {
        //recibe dia DE mes DEL año (ej: 10 de enero del 1999)
        date = date.split(/del{0,1}/g);
        var meses = {
            'Enero': 'Jan',
            'Febrero': 'Feb',
            'Marzo': 'Mar',
            'Abril': 'Apr',
            'Mayo': 'May',
            'Junio': 'Jun',
            'Julio': 'Jul',
            'Agosto': 'Aug',
            'Septiembre': 'Sep',
            'Octubre': 'Oct',
            'Noviembre': 'Nov',
            'Diciembre': 'Dec',
        };
        date[0] = date[0].trim();
        var mes = date[1].trim();
        date[1] = meses[mes];
        date[2] = date[2].trim();
        date = date.join(' ');
        return date;
    },

    moreDayEventToCalendar: function(callElement) {
        var horaInicio, horaTermino, fecha = $(callElement).attr('data-date').split(/desde|hasta/g),
            startDate, endDate;
        fecha[0] = calendar.transformDate(fecha[0]);
        horaInicio = fecha[1];
        horaTermino = fecha[2];
        fecha = fecha[0];
        startDate = new Date(fecha + horaInicio);
        endDate = new Date(fecha + horaTermino);
        return [startDate, endDate];
    },

    createEventOnCalendar: function(opt, element) {
        //funciones para agregar eventos al calendario
        var startDate, endDate;
        switch (opt) {
            case 3: // actividad de todo el día
                var date = calendar.transformDate($(element).attr('data-date'));
                startDate = new Date(date);
                startDate = new Date(startDate.getTime() + 86400000);
                endDate = startDate;
                break;
            case 4: //actividad con 2 dias en el mismo mes o de 2 en diferente mes
                if ($(element).attr('data-date').split(' ')[0] === 'Del') { //contiene del, que corresponde a actividades dentro del mismo mes
                    date = $(element).attr('data-date').split(' ');
                    startDay = date[1];
                    endDay = date[3];
                    month = date[5];
                    year = date[7];
                    startDate = startDay + ' de ' + month + ' del ' + year;
                    startDate = calendar.transformDate(startDate);
                    endDate = endDay + ' de ' + month + ' de ' + year;
                    endDate = calendar.transformDate(endDate);
                    startDate = new Date(startDate);
                    endDate = new Date(endDate);
                    startDate = new Date(startDate.getTime() + 86400000);
                    endDate = new Date(endDate.getTime() + 86400000);
                } else { // actividad con 2 dias, pero de diferente mes
                    date = $(element).attr('data-date').split('al');
                    year = 'del ' + date[1].trim().split(' ')[4];
                    startDate = date[0] + year;
                    startDate = calendar.transformDate(startDate);
                    endDate = date[1];
                    endDate = calendar.transformDate(endDate);
                    startDate = new Date(startDate);
                    endDate = new Date(endDate);
                    startDate = new Date(startDate.getTime() + 86400000);
                    endDate = new Date(endDate.getTime() + 86400000);
                }
                break;
            case 5: //actividad durante el dia con horario
                var data = calendar.moreDayEventToCalendar(element);
                startDate = data[0];
                endDate = data[1];
                break;
            case 7:
                break;
            default:
                break;
        }

        return [startDate, endDate];
    }
};
app.initialize();
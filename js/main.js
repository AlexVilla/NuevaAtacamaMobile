var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    showConfirm: function (message, title) {
        function onConfirm(button) {
            if (button === 1) {
                $.proxy(app.showAlert("Está a punto de ser redirigido a nuestro sitio web", "Atención"), app);
                window.setTimeout(function(){
                    if(device.platform=="Android"){
                        navigator.app.loadUrl('http://www.iglesianuevatacama.cl/m/#./EN-VIVO',{openExternal:true});
                    }else if(device.platform=="iOS"){
                        cordova.InAppBrowser.open(encodeURI('http://www.iglesianuevatacama.cl/m/#./EN-VIVO'),'_system');
                    }
                }, 2000);
            } else {
                window.location.hash = '';
            }
        }

        if (navigator.notification) {
            var value = navigator.notification.confirm(message, onConfirm, title, ['Continuar', 'Cancelar']);
        } else {
            var value = confirm(title ? (title + ": " + message) : message);
            onConfirm(1);
        }


    },

    route: function () {
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
            this.store.findByNumber(String(match).split("/")[1], function (numero) {
                $('body').html(new LetraView(numero).render().el);
            });
            break;
        case "#calendar":
            $('body').html(new CalendarView().render().el);
            break;
        default:
            $.proxy(this.showAlert("Contacte a soporte", "Error"), this)
            $('body').html(new HomeView(self.store).render().el);
        }
    },

    registerEvents: function () {
        $(".goHimnario").click(function () {
            window.location.hash = '#himnario';
        });
        $(".goOnline").click(function () {
            var networkState = navigator.connection.type;
            if (networkState != "wifi") {
                if (networkState == "none") {
                    $.proxy(app.showAlert("Necesita internet para acceder", "Error"), app);
                } else {
                    $.proxy(app.showConfirm("Esta acción puede consumir datos móviles", "ATENCION"), app);
                }
            } else {
                $.proxy(app.showAlert("Está a punto de ser redirigido a nuestro sitio web", "Atención"), app);
                window.setTimeout(function(){
                    if(device.platform=="Android"){
                        navigator.app.loadUrl('http://www.iglesianuevatacama.cl/m/#./EN-VIVO',{openExternal:true});
                    }else if(device.platform=="iOS"){
                        cordova.InAppBrowser.open(encodeURI('http://www.iglesianuevatacama.cl/m/#./EN-VIVO'),'_system');
                    }
                }, 2000);
            }
        });
        $(".goCalendar").click(function () {
//            var networkState = navigator.connection.type;
//            if (networkState === "none") {
//                $.proxy(app.showAlert("Necesita internet para acceder", "Error"), app);
//            } else {
                window.location.hash = '#calendar';
            //}
        });
        $(window).on('hashchange', $.proxy(this.route, this));
    },

    initialize: function () {
        this.homeTpl = Handlebars.compile($("#home-tpl").html());
        this.detailsURL = /^#himnario|^#himno\/(\d{1,})|#calendar/g;
        var self = this;
        this.store = new LocalStorageStore(function () {
            $('body').html(new HomeView(self.store).render().el);
            self.registerEvents();
        });
        document.addEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            if (device.platform == "iOS") {
                StatusBar.styleBlackOpaque();
                StatusBar.overlaysWebView(false);
                StatusBar.backgroundColorByHexString("#62555c");
                $(".logo").css("margin", "10px 0");
            }
        }

        function onBackKeyDown(e) {
            e.preventDefault();
            var hash = window.location.hash;
            if (hash == "") {
                if (navigator.notification) {
                    var value = navigator.notification.confirm("¿Realmente desea salir de la aplicación?", exit, 'Salir', ['Salir', 'Cancelar']);
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
        }

        function exit(option) {
            if (option == 1) {
                navigator.app.exitApp();
            } else {
                window.location = '';
            }
        }
    }
};

app.initialize();

var HimnarioView = function (store) {
    this.initialize = function () {
        this.el = $('<div/>');
        this.el.on('keyup focus', '.search-key', this.findByName);
    };

    this.render = function () {
        this.el.html(HimnarioView.template());
        return this;
    };

    this.findByName = function () {
        store.findByName($('.search-key').val(), function (himno) {
            for(i in himno){
                nombre = himno[i].nombre;
                var nombre = nombre.replace(/&amp;/gi,'&');
                var nombre = nombre.replace(/&nbsp;/gi,' ');
                var nombre = nombre.replace(/&iquest;/gi,'¿');
                var nombre = nombre.replace(/&aacute;/gi,'á');
                var nombre = nombre.replace(/&eacute;/gi,'é');
                var nombre = nombre.replace(/&iacute;/gi,'í');
                var nombre = nombre.replace(/&oacute;/gi,'ó');
                var nombre = nombre.replace(/&uacute;/gi,'ú');
                var nombre = nombre.replace(/&ntilde;/gi,'ñ');
                var nombre = nombre.replace(/&iexcl;/gi, '¡');
                var nombre = nombre.replace(/&quot;/gi, '"');
                nombre = nombre.toUpperCase();
                if(nombre.charAt(0) == "¡" || nombre.charAt(0) == "¿" || nombre.charAt(0) == "\""){
                    nombre = nombre.charAt(0) + nombre.charAt(1).toUpperCase() + nombre.slice(2);
                }else{
                    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
                }
                // var nombre = nombre.replace(/él\s/gi,'Él ');
                // var nombre = nombre.replace(/señor\s/gi,'Señor ');
                // var nombre = nombre.replace(/dios\s/gi,'Dios ');
                // var nombre = nombre.replace(/cristo\s/gi,'Cristo ');
                // var nombre = nombre.replace(/jesucristo\s|jesuCristo\s/gi,'Jesucristo ');
                himno[i].nombre = nombre;
            }
            $('.himno-list').html(HimnarioView.liTemplate(himno));
            if (self.iScroll) {
                //console.log('Refresh iScroll');
            } else {
                //console.log('New iScroll');
                self.iScroll = new iScroll($('.scroll', self.el)[0], {
                    hScrollbar: false,
                    vScrollbar: false
                });
            }
        });
    };

    this.initialize();
}

HimnarioView.template = Handlebars.compile($("#himnario-tpl").html());
HimnarioView.liTemplate = Handlebars.compile($("#himno-li-tpl").html());

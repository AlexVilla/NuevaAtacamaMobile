var LetraView = function (himno) {
    this.render = function () {

        for (i in himno) {
            if (i === "nombre" || i === "letra") {
                contenido = himno[i];
                var contenido = contenido.replace(/&amp;/gi, '&');
                var contenido = contenido.replace(/&nbsp;/gi, ' ');
                var contenido = contenido.replace(/&iquest;/gi, '¿');
                var contenido = contenido.replace(/&aacute;/gi, 'á');
                var contenido = contenido.replace(/&eacute;/gi, 'é');
                var contenido = contenido.replace(/&iacute;/gi, 'í');
                var contenido = contenido.replace(/&oacute;/gi, 'ó');
                var contenido = contenido.replace(/&uacute;/gi, 'ú');
                var contenido = contenido.replace(/&ntilde;/gi, 'ñ');
                var contenido = contenido.replace(/&iexcl;/gi, '¡');
                var contenido = contenido.replace(/&quot;/gi, '"');
                if (i === "nombre") {
                    contenido = contenido.toLowerCase();
                    if (contenido.charAt(0) == "¡" || contenido.charAt(0) == "¿" || contenido.charAt(0) == "\"") {
                        contenido = contenido.charAt(0) + contenido.charAt(1).toUpperCase() + contenido.slice(2);
                    } else {
                        contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1);
                    }
                    var contenido = contenido.replace(/él\s/gi, 'Él ');
                    var contenido = contenido.replace(/señor\s/gi, 'Señor ');
                    var contenido = contenido.replace(/dios\s/gi, 'Dios ');
                    var contenido = contenido.replace(/cristo\s/gi, 'Cristo ');
                    var contenido = contenido.replace(/jesucristo\s|jesuCristo\s/gi, 'Jesucristo ');
                }
                himno[i] = contenido;
            }
            if (i === "letra") {
                contenido = himno[i];
                var contenido = contenido.toLowerCase();
                var contenido = contenido.replace(/Verse\s{1,}/gim, 'Verso ');
                var contenido = contenido.replace(/Verse\s/gim, 'Verso ');
                var contenido = contenido.replace(/Verse\S/gi, 'Verso ');
                var contenido = contenido.replace(/Verso\S/gi, 'Verso ');
                var contenido = contenido.replace(/Verso\S/gi, 'Verso ');
                var contenido = contenido.replace(/verso\S/gi, 'Verso ');
                var contenido = contenido.replace(/Versus\S|Versus\s/gi, 'Verso ');
                var contenido = contenido.replace(/versus\S|versus\s/gi, 'Verso ');
                var contenido = contenido.replace(/Chorus\S/gi, 'Coro ');
                var contenido = contenido.replace(/Chorus\s/gi, 'Coro ');
                var contenido = contenido.replace(/Chorus/gi, 'Coro ');
                var contenido = contenido.replace(/él\s/gi, 'Él ');
                var contenido = contenido.replace(/señor\s/gi, 'Señor ');
                var contenido = contenido.replace(/dios\s/gi, 'Dios ');
                var contenido = contenido.replace(/cristo\s/gi, 'Cristo ');
                var contenido = contenido.replace(/jesucristo\s|jesuCristo\s/gi, 'Jesucristo ');
                var contenido = contenido.charAt(0).toUpperCase() + contenido.slice(1);
                var contenido = contenido.toUpperCase();
                himno[i] = contenido;
            }
        }

        this.el.html(LetraView.template(himno));
        return this;
    };

    this.initialize = function () {
        this.el = $('<div/>');
    };

    this.initialize();
}

LetraView.template = Handlebars.compile($('#himno-content').html());

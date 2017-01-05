var LocalStorageStore = function (successCallback, errorCallback) {

    this.findByName = function (searchKey, callback) {
        var himnario = JSON.parse(window.localStorage.getItem("himnario"));
        var results = himnario.filter(function (element) {
            var fullName = element.numero + " - " + element.nombre + " " + element.letra.toLowerCase().split(',').join('');
            var contenido = fullName;
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
            var fullName = contenido;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        console.log(results);
        callLater(callback, results);
    }

    this.findByNumber = function (numero, callback) {
        var himnario = JSON.parse(window.localStorage.getItem("himnario"));
        var himno = null;
        var l = himnario.length;
        for (var i = 0; i < l; i++) {
            if (himnario[i].numero === numero) {
                himno = himnario[i];
                break;
            }
        }
        callLater(callback, himno);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    var callLater = function (callback, data) {
        if (callback) {
            setTimeout(function () {
                callback(data);
            });
        }
    }

    var himnario = $.ajax({
        url: 'js/store/himnarioDataBase.json',
        dataType: 'json'
    });

    himnario.done(function () {
        var bd = himnario.responseText;
        window.localStorage.setItem("himnario", bd);
    });

    callLater(successCallback);

}

var setVersion = function(version){
    window.localStorage.setItem('version', version);
}

var checkVersion = function(){
    var version = window.localStorage.getItem('version');
    return(version);
}
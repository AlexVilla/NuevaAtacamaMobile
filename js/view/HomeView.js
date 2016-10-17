var HomeView = function(store){
    
    this.initialize = function(){
        this.el = $('<div/>');    
    };
    
    this.render = function(){
        this.el.html(HomeView.template());
        return this;
    }
    
    this.initialize();
}

HomeView.template = Handlebars.compile($('#home-tpl').html());
var tour = {
    id: "naming-steps",
    steps: [{
        title: "Mira las nuevas opciones en las actividades",
        width: 250,
        content: "",
        target: "prox-actividades",
        placement: "top",
        multipage: true,
        nextOnTargetClick: true,
        showNextButton: false,
        onNext: function() {
            window.location = "#calendar";
        }
    }, {
        title: "Haz click aquí",
        width: 150,
        content: "para ver las actividades semanales",
        target: "diaria-tab",
        placement: "bottom",
        nextOnTargetClick: true,
        showNextButton: false
    },{
        title: "Haz click aquí",
        width: 250,
        yOffset: 220,
        arrowOffset: 200,
        content: "para ver las nuevas opciones",
        target: "primer-evento",
        placement: "bottom",
        nextOnTargetClick: true, 
        showNextButton: false,
    }]
}

// Waiting page full loaded
$(document).ready(function() {
    var lists;

    $("#subscribe").click(function(event) {
        event.preventDefault();
        sessionStorage.setItem('login', $("#login").val());
        sessionStorage.setItem('password', $("#password").val());
        subscribe();
    });

    $("#connect").click(function(event) {
        event.preventDefault();
        sessionStorage.setItem('login', $("#login").val());
        sessionStorage.setItem('password', $("#password").val());
        connect();
    });

    $(document).on('click', '.add-list', function(){
        event.preventDefault();

        Swal.fire({
            title: 'Titre de la liste:',
            input: 'text',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                return 'Tu dois choisir un titre!'
                }
            var lastList = lists.todoListes.length;
            lists.todoListes[lastList + 1] = {'name': value, 'elements': []};
            updateListe(lists);
            }
        })
    });

    $(document).on('click', '.name', function(){
        event.preventDefault();
        var id = $(this).parent().attr('id');

        Swal.fire({
            title: 'Changement du titre de la liste:',
            input: 'text',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                return 'Tu dois choisir un titre!'
                }
            lists.todoListes[id].name = value;
            updateListe(lists);
            }
        })
    });

    $(document).on('click', '.item', function(){
        event.preventDefault();
        var id_list = $(this).attr('list');
        var id_item = $(this).attr('item');

        Swal.fire({
            title: 'Changement du texte la task :',
            input: 'text',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                return 'Tu dois choisir un texte!'
                }
            lists.todoListes[id_list].elements[id_item] = value
            updateListe(lists);
            }
        })
    });

    $(document).on('dblclick', '.item', function(){
        event.preventDefault();
        console.log("deleted");
    });

    $(document).on('click', '.delete-list', function(){
        event.preventDefault();
        deleteListe($(this).parent().attr('id'));
    });

    $(document).on('submit', '.add-child', function(){
        event.preventDefault();
        elements = lists.todoListes[$(this).attr("parent")].elements;
        var last_elem;
        for (var i=0;i<elements.length;i++){
            last_elem = i + 1;
        }

        if(last_elem == null) {
            last_elem = 0;
        }

        lists.todoListes[$(this).attr("parent")].elements[last_elem] = $(this).children().val();
        updateListe(lists);

    }); 

    function connect(){

        if(sessionStorage.getItem('login') != '' || sessionStorage.getItem('password') != '') {
            $("#subscribe-form").remove();
            getListe();
            $(".action-bar").append('<button class="button-connect m-2 add-list" ><i class="fa fa-plus"></i> Nouvelle Liste</button>');
            $(".action-bar").append('<button class="button-connect m-2" disabled><i class="fa fa-save"></i> Save</button>');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Il semblerait que vous ayez oublié de remplir tout les champs !'
            })
        }
    }

    function subscribe(){

        if(sessionStorage.getItem('login') != '' || sessionStorage.getItem('password') != '') {
            var query = `http://92.222.69.104/todo/create/${sessionStorage.getItem('login')}/${sessionStorage.getItem('password')}`;

            $.ajax({
                url: query			
            }).done(function(data) {
                $("#subscribe-form").remove();
                getListe();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Il semblerait que vous ayez oublié de remplir tout les champs !'
            })
        }
    }

    function getListe(){
        var query = `http://92.222.69.104:80/todo/listes`;
        
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": query,
            "method": "GET",
            "headers": {
                "login": sessionStorage.getItem('login'),
                "password": sessionStorage.getItem('password')
            }
        }

        $.ajax(settings).done(function (response) {
            lists = response;
            $("#sortable").empty();
            for (var i=0;i<response.todoListes.length;i++){
                if(response.todoListes[i] != null) {
                    showListe(response.todoListes[i], i);
                }
            }
            $("#sortable").attr('id', 'sortable');
            $("#sortable").sortable();
            $("#sortable").disableSelection();
        });
    }

    function showListe(liste, id) {
        var name = liste.name;
        var list = $(`<div class='list' id='${id}'><span class='delete-list'><i class='fa fa-times-circle'></i></span></div>`);
        $(`<div class='name'>/div>`).text(name).appendTo(list);

        var items = $(`<ul class='items' id='sortable${id}'></ul>`)

        for (var i=0;i<liste.elements.length;i++){
            $(`<li class='item' list='${id}' item='${i}'></li>`).text(liste.elements[i]).appendTo(items);
        }
        items.appendTo(list);
        $(`<form class="add-child" parent="${id}"><input class='add-item' type='text'></form>`).appendTo(list);
        $("#sortable").append(list);
    }

    function deleteListe(id){
        var query = `http://92.222.69.104:80/todo/listes`;
        
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": query,
            "method": "GET",
            "headers": {
                "login": sessionStorage.getItem('login'),
                "password": sessionStorage.getItem('password')
            }
        }
        $.ajax(settings).done(function (response) {
            delete response.todoListes[id];
            updateListe(response);
        });
    }

    function updateListe(datas) {
        var login = sessionStorage.getItem('login');
        var password = sessionStorage.getItem('password');
        $.ajax({
            url      : "http://92.222.69.104/todo/listes/",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $("#sortable").empty();
                getListe();
            },
            data: JSON.stringify(datas)
        });
    }

});
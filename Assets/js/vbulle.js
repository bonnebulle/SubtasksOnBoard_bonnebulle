  ///à charger à la fin de /assets/jsapp.min.js
// NEXT TO....
// var _KB = null;
// jQuery(document).ready(function () {
//   _KB = new Kanboard.App();
//   _KB.execute();

///// LOAD 
// var script = document.createElement('script');
// script.src = 'assets/js/vbulle.js';
// document.head.appendChild(script);

///// ( IN USE WITH 2 PLUGINS )
// SubtasksOnBoard
// ( https://github.com/JustFxDev/SubtasksOnBoard )
// --> ( FORK https://github.com/bonnebulle/SubtasksOnBoard_bonnefille )
// Subtaskdescription
// ( https://github.com/Shaun-Fong/SubtaskDescription )
// --> ( FORK https://github.com/bonnebulle/SubtaskDescription_bonnebulle )
////
/// + infos
//// README _ HELP /////
// /README_VBULLE_NOTES.txt
////////////////////////

// alert("vb")
const adebug_active = "oui";
const off="off";
const on="on";

if ( $("#board").length != 0 ) {




  /// MV Menu
  $(".project-header").insertAfter(".title-container > h1");

  /// Modal links
  $(".task-board-title a:not(.not_popup)").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    let editurl_origine = $(this).attr("href")
    let editurl = editurl_origine.replace("show","edit").replace("TaskViewController", "TaskModificationController")
    KB.modal.open(editurl, "medium", !0);
  })

  /// Fix Normal Desc text -> link open normal modal 
  $(".markdown.description-inside-task").each(function (e) {
    // alb( $(this).parent().parent().data("task-url") )
    let editurl_origine = $(this).parent().parent().data("task-url") 

    $(this).on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      let editurl = editurl_origine.replace("show","edit").replace("TaskViewController", "TaskModificationController")
      KB.modal.open(editurl, "medium", !0);
      
      setTimeout(function () {
        $('textarea[name="description"]').focus()
        // alb("focus")
      },300);
    })
      $(this).find("a").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let url = $(this).attr("href")
        window.open(url, '_kan_url');
        alb(url,off)
      })
  
  })


  //// swimlane

  ///// no swimlane
  //// ADD Swimline default
  $("#board").each(function() {
    if ( $(this).find(".board-swimlane-toggle").length == 0 ) {
      // alb("Null")
      let swan_id=$(this).find("tr").first().attr("class").replace("board-swimlane-columns-", "")
      let trsw = `<tr id="swimlane-`+swan_id+`">
          <th class="board-swimlane-header" colspan="4">
                            <a href="#" class="board-swimlane-toggle" data-swimlane-id="`+swan_id+`">
                        <i class="fa fa-chevron-circle-up hide-icon-swimlane-3" title="Replier la swimlane" role="button" aria-label="Replier la swimlane"></i>
                        <i class="fa fa-chevron-circle-down show-icon-swimlane-3" title="Déplier la swimlane" role="button" aria-label="Déplier la swimlane" style="display: none"></i>
                    </a></span>
                
                Swimlane par défaut
                
                <span title="Nombre de tâches dans cette swimlane" class="board-column-header-task-count swimlane-task-count-`+swan_id+`">
                                    (<span><span class="ui-helper-hidden-accessible">Nombre de tâches dans cette swimlane </span>0)
                            </span>
            </span></th>
        </tr>`
      $(this).find("tr").first().before(trsw)
    }  
  })

  ///// swimlane
  /// butuns pls
  var projectId = $(".page").attr("data-project_id")
  /// WRAP
  $("a.board-swimlane-toggle").wrap("<span class='board-swimlane-toggle-wrapper'></span>")
  
  /// MOVE WRAPPER after count (clone then remove original)
  $("a.board-swimlane-toggle").each(function() {
    var $originalWrapper = $(this).closest("span.board-swimlane-toggle-wrapper");
    if ($originalWrapper.length) {
      var $header = $originalWrapper.closest("th.board-swimlane-header");
      var $count = $header.find(".board-column-header-task-count").first();
      if ($count.length) {
        var $clone = $originalWrapper.clone(true, true);
        $count.after($clone);
        $originalWrapper.remove();
      }
    }
  });

  //// ADD
  $("span.board-swimlane-toggle-wrapper").append("<span class='quick_swimlane'> \
    <a title='Modifier Swimelines' href='/?controller=SwimlaneController&action=index&project_id="+projectId+"'> \
       <i class='fa fa-align-justify' aria-hidden='true'></i>  \
    </a> \
    <a title='Modifier Colones' href='/?controller=ColumnController&action=index&project_id="+projectId+"'> \
       <i class='fa fa fa-columns' aria-hidden='true'></i>  \
    </a> \
    </span>")

    $(".board-swimlane-header").each(function() {
    if ($(this).children(".board-swimlane-header-wrapper").length === 0) {
      $(this).wrapInner("<span class='board-swimlane-header-wrapper'></span>");
    }
  })
  


  // TAGS CLICK -> SEARCH FILTER
  $(".task-tag a").each(function (e) {

    /// ONCLICK
    $(this).on("click", function(e) {
      $this=$(this)
      e.preventDefault(); // <-- c'est ici qu'il faut le mettre

      let tagname = $(this).text();
      let url = window.location.href;

      // 1. Supprimer le paramètre "search" s'il existe
      let urlObj = new URL(url);
      urlObj.searchParams.delete('search');
      
      // alb(url)

      // 2. Ajouter le nouveau paramètre "search"
      urlObj.searchParams.append('search', `+tag:"${tagname}"`);

      let tagurl = urlObj.toString().replace("%2B","+")
      // alb(tagurl)
      // console.log("Redirection vers :", tagurl);

      // 3. Rediriger vers la nouvelle URL
      window.location.href = tagurl;
      // history.replaceState(null, '', tagurl);
    });
  });

  /// SEARCH -> COLOR TopMenuFILTER 
  let url = window.location.href;
  let urlObj = new URL(url);
  if (urlObj.searchParams.has('search')) {
    $("#form-search").addClass("active");
  }


  // VBULLE highlightTaskById --> #PERMALINK -> SCROL + HEIGHTLIGHT
  // 1. Récupérer le paramètre data-task-id dans l'URL
  function getTaskIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('data-task-id');
  }
  function getSubTaskIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('data-subtask-id');
  }

  // 2. Chercher l'élément correspondant dans la page
  function highlightTaskById() {
    // alb("highlightTaskById")
    const taskId = getTaskIdFromUrl();
    const subtaskId = getSubTaskIdFromUrl();

    if (taskId) {
      const el = document.querySelector(`[data-task-id="${taskId}"]`);
      // ### Normal link, no subtask -> task highlight
      if (el) {
        const params = new URLSearchParams(window.location.search);
        if (!params.get('highlight')) {
          el.classList.add('task-highlighted');
        }
        /// SCROLL
        el.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'center' });

        // 2. Après un petit délai, ajuste le scroll horizontal
        setTimeout(function() {
          window.scrollBy({ top: -80, left: -20, behavior: 'auto' });
        }, 100);
      }  
    }

    if (subtaskId) { // ### avec sub id (ex: after mv subtask (cible))
      /// USED after moving subtask (cible)
      // alb(subtaskId)
      // const sub_el_scroll=document.querySelector(`[data-subtask_id="${subtaskId}"]`)
      const sub_el = $('.sub_title_form[data-subtask_id="'+subtaskId+'"]');
      $(sub_el).parent().next(".sub_desc").addClass('sub_task-highlighted');
      $(sub_el).parent().addClass('sub_task-highlighted');
      /// SCROLL
      sub_el[0].scrollIntoView({ 
        behavior: 'auto',
        block: 'start', // vertical haut bas
        inline: 'center' // horizontal gauche droite
      });

      // 2. Après un petit délai, ajuste le scroll horizontal
      setTimeout(function() {
        window.scrollBy({ top: -90, left: -20, behavior: 'auto' });
      }, 100);

    }

  }
  // Exécuter au chargement de la page
  $(document).ready(function() {
    setTimeout(function () {           
      highlightTaskById();
    },100);

    $(".quick_swimlane").after("<span class='toggle_showall'><i class='fa fa-eye'></i></span>")

  });



  
  /// Butun drag tasks
  $(".task-board-header").each(function () {
    let dragme='<i class="fa fa-hand-paper-o header_task" aria-hidden="true" onclick=""></i>';
    $(this).append(dragme)
  });


  // VBULLE SUBTASK on clic +
  $(document).on("click", ".dropdown-submenu-open_alt li a, .rm_task_quickaction, .editbutt", function (e) {
      e.preventDefault();
      let url=$(this).attr("href")
      // alb("test")
      KB.modal.open(url, "medium", !0);
      setTimeout(function () {
        if ($("#form-title").length == 1) {
          $("#form-title").attr("tabindex", "0")
            $("#form-title").focus()
            // alb("focus")
        }
        $('.select2-selection').attr("tabindex", "-1")
      },400);  
      setTimeout(function () {
        $('select[name="user_id"], #form-time_estimated, #form-due_date, [name="another_subtask"]').attr("tabindex", "-1")
        $('[name="due_description"], .btn.btn-blue').attr("tabindex", "1")
        // .on('keydown', function(e){ if (e.keyCode == 9)  e.preventDefault() });
      },200);
      setTimeout(function () {
      if ($("#modal-confirm-button").length == 1) {
        $(".form-actions").find("#modal-confirm-button").focus()
        $(".form-actions").find("a").addClass("keyboard-clickable").attr("tabindex", "0")
        // alb("kkkk")
      }

      
      },500);

  });
  // js-modal-medium rmbutt


  /// INIT TOGGLE
  initToggleSubDesc("mess");

  function initToggleSubDesc(mess, action) {
    // alb("initToggleSubDesc== "+mess)

    /// SHOW/HIDE SUBTASK (checkboxs) toggles
    $(".task-board .table-suboncard .toggle_sub_desc_a").each(function () {
      // var coco=coco_hide=0
      /// AUTO RUN RESTORE PREVIOUS STATE
      let $this=$(this)
      var $desc=$(this).parent().parent().next(".sub_desc")
      let $checkbox= $desc.find(".toggle_sub_desc_checkbox")
      let task_id = $(this).attr("data-task_id")
      let subtask_id = $(this).attr("data-subtask_id")
      /// GET LOCAL SHOW/HIDE chekbox
      let saved = localStorage.getItem("sub_desc_checkbox_"+ task_id+"_"+subtask_id);
      
      // if (saved !== null) {
        if ((saved=="true")) {
          $($checkbox).prop("checked", true);
          $desc.removeClass("active")
          $(this).removeClass("active")
          // coco_hide++
        } else { /// OUVERT par default
          $($checkbox).prop("checked", false);
          $desc.addClass("active")
          $(this).addClass("active")
          // coco++
        }
      // }

      $desc.removeClass("loading")

      /// ONCLICK
      $(this).on("click", function(e) {
        e.preventDefault();

        //// FUNCTION
        let $desc=$(this).parent().parent().next(".sub_desc")
        toggle_save_checkboxs($this, $desc, task_id, subtask_id)

      });

    });
  }

  /// SHOW/HIDE ALL
  $(document).on("click", ".all_toggle", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $this=$(this)
    var $task_wrp = $(this).parent().parent().parent()
    var $desc=$task_wrp.find(".sub_desc")
    let $checkbox= $desc.find(".toggle_sub_desc_checkbox")
    let $checkbox_a= $task_wrp.find(".toggle_sub_desc_a")
    
    if ($this.is(".active")) {
      $checkbox.prop("checked", false);
      $desc.addClass("active")
      $checkbox_a.addClass("active")
    } else {
      $checkbox.prop("checked", true);
      $desc.removeClass("active")
      $checkbox_a.removeClass("active")
    }
    $this.toggleClass("active")
    
    $desc.each(function() {
      let task_id = $(this).attr("data-taskid")
      let subtask_id = $(this).attr("data-subid")
      let $desc=$(this)
      let $checkbox= $desc.find(".toggle_sub_desc_checkbox")
    
      // INVERS (toggle) STATE
      $checkbox.prop("checked", !$checkbox.prop("checked"));
    
      setTimeout(function () {
        if ($checkbox.prop("checked")==true) {
          var checkis="true"
          $desc.removeClass("active")
          $($this).removeClass("active")
        } else {
          var checkis="false"
          $desc.addClass("active")
          $($this).addClass("active")
        }
        // alb(checkis)
        /// GET LOCAL SHOW/HIDE chekbox 1
        localStorage.setItem("sub_desc_checkbox_"+task_id+"_"+subtask_id, checkis);
      },10);

    })

  })


  $(document).on("click", ".toggle_showall", function(e) {
    e.preventDefault();
    e.stopPropagation();

    // On veut savoir si on doit tout ouvrir ou tout fermer
    // On prend l’état du premier bouton comme référence
    let anyActive = $(".toggle_sub_desc_a").first().hasClass("active");

    $(".toggle_sub_desc_a").each(function() {
      // On ne clique que si l’état n’est pas celui désiré
      if (anyActive && $(this).hasClass("active")) {
        $(this).click();
      } else if (!anyActive && !$(this).hasClass("active")) {
        $(this).click();
      }
    });
  });


  ////////////
  //////////// AJAX
  ////////////
  function ajax_this(subtaskId,taskId,newText,newTitle,$this,project_id, $title, $context) {

   console.log("----" + taskId +
    "\nsubtaskId " + subtaskId +
    "\nnewText " + newText +
    "\nnewTitle " + newTitle +
    "\ntitle " + $title +
    "\context " + $context
  ) 

  ////// TITLE
    $.ajax({
      url: "/assets/php/change_subdescription.php",
      type: "POST",
      data: {
          task_id: taskId,
          subtask_id: subtaskId,
          title: newTitle,
          text: newText,
          context: $context
          // csrf_token: csrf_token // si tu utilises le CSRF
      },
      success: function(response) {
          // Optionnel : remettre le texte initial au blur
          var $form = $this;
          // alb("ok ajax")
          ////// END -> DO
          if ((newTitle!="") && (newText!="")) {
             //// USE on paste (title + desc_text)
            reset_textarea("success onclick title", $form, "title_and_desc", taskId, subtaskId)
          } else {
            reset_textarea("success onclick noptitle", $form, "title")
          }
      },
      error: function(xhr) {
          alb("Erreur AJAX : " + xhr.statusText);
      }
    });
    
  }


  // function preventMoving(e) {
  //   var key = (e.keyCode ? e.keyCode : e.which);
  //   if(key == 13) {
  //       e.preventDefault();
  //       // alert("ees")
  //       A
  //   }
  // }


  // VBULLE SUBTASK on clic +
  function sub_title_clic(context) {
    // alb("sub_dec_clic")

    setTimeout(function () {

      $(".sub_desc.sub_desc_title").each(function () {
        $(this).removeClass("loading")
      })
      
    },900);


    // alb($('.sub_desc').length)

    // SUBTASK TITLE -> TEXTAREA -> PHP MAJ DUE_DESCRIPTION
    $('.sub_task_title_only').on('click', function(e) {
      e.preventDefault(); // 1. Empêche le comportement par défaut
      e.stopPropagation();



      var $this = $(this);
      var $parent = $(this).closest(".subt_td")
      $parent.addClass("textarea_active")
      var $wrap_desc = $(this).closest(".wrap_desc");
      var $button = $('<button class="sub_task_title_only_button" type="submit">OK</button>');
      $this.after($button);


      /// CONTINUE .sub_desc DESC ACTIONS
      /// POP TEXTAREA title
      var currentText = $this.find(".title_text").text()
      // .replace("\n","---");
      if ($this.find('textarea.title_please').length === 0) {
        var $textarea = $('<textarea class="title_please" name="text" tabindex="-1" placeholder="Titre">').val(currentText);
        $this.append($textarea);
    }
      $textarea.focus();
      $this.find(".title_text").remove()

      /// AUTO HEIGHT
      // autoResizeTextarea($textarea[0]);
      // alert("res")
      // $textarea.on('input', function() {
        // autoResizeTextarea(this);
      // });

      



      /// PREVENT on NEW TEXTAREA POPed
      $($textarea).on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
      });


      // Récupérer les éléments nécessaires
      var $subDesc = $(this).parent().parent().parent().find('.sub_desc');
      var subtaskId = $subDesc.data('subid');
      var taskId = $subDesc.data('taskid');
      var project_id = $subDesc.data('projectid');


      /// ONCLICK SUBMIT BUTTON
      $(".sub_task_title_only_button").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var newText = $(this).parent().find('textarea[name="text"]').val();
        // alb("000",on)
        ajax_this(subtaskId,taskId,"",newText,$this,project_id,"title")
      
      }); /// END $('.submit_sub_desc_edit') ONCLICK SUBMIT BUTTON





      
    }); /// END .sub_desc CLICK



    /// ON SUBTASK TEXTAREA SUBMIT --- TITLE / desc ?
    $(document).on('submit', '.sub_title_form', function(e) {
      e.preventDefault(); // Empêche le rechargement de la page
      // alb($(this).attr("class"))
      let $this = $(this);
      var subtaskId = $(this).attr('data-subtask_id');
      var taskId = $(this).attr('data-task_id');
      var project_id = $(this).attr('data-project_id');
      var newText = $(this).find("textarea").val();
      // alb(taskId +" -- "+ subtaskId +" -- "+ newText)
      if (newText != "") {
        // alb("001",on)
        // alert(newText)
        ajax_this(subtaskId,taskId,"",newText,$this,project_id,"title")
      }
    }); /// SUBMIT
  } /// FUN sub_dec_clic
  /////// INIT
  sub_title_clic()
  //////////////


  
  // VBULLE SUBTASK on clic +
  function sub_dec_clic(message, context) {

    // SUBTASK -> TEXTAREA -> PHP MAJ DUE_DESCRIPTION
    $('.sub_desc_title').on('click', function(e) {
      e.preventDefault(); // 1. Empêche le comportement par défaut
      e.stopPropagation();
      // alb("kkkk")

      reset_textarea_on_escape();


      // 2. Transforme le contenu en textarea
      var $this = $(this);
      var $wrap_desc = $(this).find(".wrap_desc");
      var $button = $('<button class="submit_sub_desc_edit" type="submit">Valider</button>');

      // console.log($($this).find(".submit_sub_desc_edit"))
      if ( $($this).find(".submit_sub_desc_edit").length <= 0 ) {
        // alb("exits")
      // } else {
        $wrap_desc.after($button);
      }

      /// ONCLICK SUBMIT BUTTON
      $(".submit_sub_desc_edit").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    
        // Récupérer les éléments nécessaires
        var $subDesc = $(this).closest('.sub_desc');
        var subtaskId = $subDesc.data('subid');
        var taskId = $subDesc.data('taskid');
        var newText = $subDesc.find('textarea[name="text"]').val();
    
        
        // Optionnel : CSRF token si besoin
        // var csrf_token = $subDesc.find('input[name="csrf_token"]').val();
    
        //// AJAX POST DATAS
        ///// DESC
        $.ajax({
            url: "/assets/php/change_subdescription.php", 
            type: "POST",
            data: {
                task_id: taskId,
                subtask_id: subtaskId,
                text: newText
                // csrf_token: csrf_token // si tu utilises le CSRF
            },
            success: function(response) {
                // Optionnel : remettre le texte initial au blur
                var $form = $subDesc;
                ///// END -> DO
                reset_textarea("success onclick",$form, "duedescription", taskId, subtaskId)
                $form.find('.wrap_desc').addClass("after_escape")
                $($form).find(".original").remove()
            },
            error: function(xhr) {
                alb("Erreur AJAX : " + xhr.statusText);
            }
        });
        //// END AJAX


      }); 
      /// END $('.submit_sub_desc_edit') ONCLICK ---- SUBMIT BUTTON

      


      //// CREATION DE TEXTAREA
      //// MAIS avant === get desc from MYSQL (ajax)
      var $subDesc = $(this).closest('.sub_desc');
      var taskId = $subDesc.data('taskid');
      var subtaskId = $subDesc.data('subid');

      $.ajax({
        url: "/assets/php/get_subdescription.php",
        type: "POST",
        dataType: "json",
        data: { 
          task_id: taskId, 
          subtask_id: subtaskId,
          what: "due_description"
        },
        success: function(response) { 

          if (response.due_description || response.title) {
          
            console.log("OK GET due_description", response.due_description); 
            // console.log("OK due_description", response.title); 

            // var $textarea = $('<textarea class="desc_please" name="text" tabindex="-1" placeholder="Markdown">').val(response.due_description);
            var $textarea = $('<textarea class="desc_please" name="text" tabindex="-1" placeholder="Markdown" style="max-height: 500px;">').val(response.due_description);

            
            var contenu = $wrap_desc.html();
            $wrap_desc.html("<div class='original'>" + contenu + "</div>");

            $wrap_desc.prepend($textarea);
            $textarea.focus();
  
            // /// AUTO HEIGHT
            // alert("kkk")
            autoResizeTextarea($textarea[0]);
            $textarea.on('input', function() {
              autoResizeTextarea(this);
            });
  
            /// PREVENT on NEW TEXTAREA POPed
            $($textarea).on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

          } else  { //// NO response.due_description

            var $textarea = $('<textarea class="desc_please" name="text" tabindex="-1" placeholder="Markdown">').val("MYSQL error :\n"+ response);
            $wrap_desc.replaceWith($textarea);
            $textarea.focus();

          }

        },
        error: function(xhr, status, error) { 
          console.log("ERR", xhr, status, error); 
        }
      });

      

    }); /// END .sub_desc CLICK
  } /// FUN sub_dec_clic
  /////// INIT
  sub_dec_clic()
  //////////////

  /// ON SUBTASK TEXTAREA SUBMIT
  $(document).on('submit', '.sub_desc_form', function(e) {
    e.preventDefault(); // Empêche le rechargement de la page
  
    var $form = $(this);
    var url = $(this).attr('action');
    var data = $(this).serialize(); 

    // Récupérer la valeur du champ texte
    var text = $(this).parent().find('textarea[name="text"]').val();
    var lines = text.split('\n');
    var sepIndex = lines.findIndex(line => line.trim().match(/^[-]{3,}$/));
    var title, description;
    if (sepIndex !== -1) {

        var $subDesc = $(this).parent().parent().find('.sub_desc');
        var subtaskId = $subDesc.data('subid');
        var taskId = $subDesc.data('taskid');
        var project_id = $subDesc.data('projectid');
        
        // alb(subtaskId)
        // alb(taskId)
        // alb(project_id)

        let newTitle = lines.slice(0, sepIndex).join('\n').trim();
        let newText = lines.slice(sepIndex + 1).join('\n').trim();
        // alb(newTitle)
        // alb(newText)
        // alb("002",on)
        ajax_this(subtaskId,taskId,newText,newTitle,$form,project_id,"all") // DESC !inversed_order==first
        // ajax_this(subtaskId,taskId,newText,"",$form,project_id) // DESC !inversed_order==first

        // alb("ok")

    } else {


      var $subDesc = $(this).parent().parent().find('.sub_desc');
      // alb($($subDesc).attr("class"))
      var subtaskId = $subDesc.data('subid');
      var taskId = $subDesc.data('taskid');
      // var project_id = $subDesc.data('projectid');


      $.post(url, data, function(response) {
        // alb("Description mise à jour !");
        ///// END -> DO

        // reset_textarea($message, $form, context, taskId, subtaskId) {
        reset_textarea("on submit ok",$form, "duedescription", taskId, subtaskId)
        // alb("iii")
        /////
      }).fail(function(xhr) {
          alb("Erreur AJAX : " + xhr.statusText);
      }); /// POST

    }

    $(this).find(".original").remove()


  
  }); /// SUBMIT
  




  $(".wrap_desc a").on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let url = $(this).attr("href")
    window.open(url, '_kan_url');
    // alb(url)
  })


  ///// DRAGNDROP subtasks
  function drame_subtasks(message, context) {
    $(".table-suboncard tbody").sortable({
        forcePlaceholderSize: true,
        handle: ".drame", 
        helper: function (e, ui) {
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        },
        stop: function (event, ui) {
          var subtask = ui.item;
          let order = [];
          let current_table=$(subtask).parent("tbody")
          let task_id=$(subtask).find(".sub_desc").attr("data-taskid")

        $(current_table).find(".subt_tr").each(function(index) {
          index++
          $(this).attr("index", index)
          let desc_tr=$(this).find(".sub_desc")
          let subtask_id=$(desc_tr).attr("data-subid")
          /// SAVE CURENT ORDER
          order.push(subtask_id);
        });

        /// SET ORDER
        // console.log("order == "+order)
        /// MYSQL --> change_suborder.php
        $.ajax({
          url: "/assets/php/change_suborder.php",
          type: "POST",
          data: {
              task_id: task_id,
              order: order
          },
          success: function(response) {
              // Optionnel : traiter la réponse
              // alb("new order")
          }
        }); // AJAX

        }, /// STOP_END dragndrop
        start: function (event, ui) {
            ui.item.addClass("draggable-item-selected");
        }
    }).disableSelection();
  };
  
  
  $(".task-board-icons").each(function() {
    let thisis=$(this)
    let vide=0

    $(thisis).find(".task-board-icons-row").each(function() {
      /// https://stackoverflow.com/a/10262019
      const str= $(this).text()
      const isWhitespaceString = str => !str.replace(/\s/g, '').length
      if ( isWhitespaceString ) {
        vide++
        $(this).remove()
      }
      alb(vide, off)
      if (vide!=3) {
        alb("all_vide", off)
        $(thisis).removeClass("loading_have_subt")
      }
    })
  })





  

  ///// FUNCTIONS
  /// ALERTE + CONSOLE
  function alb(message, active) {
    if (adebug_active=="oui" && active!="off") alert(message);
  }
  function csl(message, active) {
    if (adebug_active=="oui" && active!="off") console.log(message);
  }

  /// RESET TEXTAREA
  /// ( USE ON SUBTASK TEXTAREA SUBMIT )
  function reset_textarea($message, $form, context, taskId, subtaskId) {

    // $("html").css("overflow", "hidden")
    
    // alb("reset_textarea == "+$message, on)
    var $textarea = $form.find("textarea");
    var newText = $textarea.val();
    // alb("taskId == "+taskId)
    // alb("subtaskId == "+subtaskId)
    // alb("$message == "+$message)

    // LOAD marked JS --> 
    // app/Template/layout.php
    // <?= $this->asset->js('assets/js/marked.min.js') ?>

    var html_new_desc = marked.parse(newText);
    // .replace(/\* <br>/g, "uuu"); // Conversion Markdown -> HTML
    // var $formform = $(this).find("form");


    if (context=="title_and_desc") { //// USE on paste (title + desc_text)
    
      //// TITLE and DESC
      // $form.parent().find(".sub_task_title_only")
      $formform=$form.parent().parent().find(".sub_desc_form")
      // alb($formform.attr("class"))
      $titltitle=$formform.parent().parent().find(".sub_task_title_only")
      // alb($titltitle.attr("class"))
      

      $.ajax({
        url: "/assets/php/get_subdescription.php",
        type: "POST",
        dataType: "json",
        data: { 
          task_id: taskId, 
          subtask_id: subtaskId,
          what: "title_desc"
        },
        success: function(response) { 
          let title = response.title;
          let due_description = response.due_description;

          //// RESET ( ok final preview )
          let md_due_description= marked.parse(due_description)
          let md_title= marked.parse(title)
          $formform.find(".wrap_desc").html(md_due_description);
          $($formform).find(".original").remove()
          $titltitle.html('<span class="title_text">'+md_title.replace(/\n+$/,"").replace(/---/,"\n")+'</span>');

          var $button = $form.parent().find(".submit_sub_desc_edit");
          $button.remove();

        }
        
      });

    
    } else if (context=="title") {
    //// TITLE

      $form.parent().find(".sub_task_title_only").html('<span class="title_text">'+html_new_desc.replace(/\n+$/,"").replace(/---/,"\n")+'</span>');
      // $form.parent().find(".sub_task_title_only").html('<span class="title_text">'+html_new_desc+'</span>');

      var $button = $form.parent().find(".sub_task_title_only_button");
      $form.parent().removeClass("textarea_active")
      $button.remove();


    } else {
    //// DESC
      // alb("desc")
      // setTimeout(function () {  
      // alb(taskId + " - " + subtaskId)
          $.ajax({
            url: "/assets/php/get_subdescription.php",
            type: "POST",
            dataType: "json",
            data: {
              task_id: taskId,
              subtask_id: subtaskId,
              what: "due_description"
            },
            success: function(response) { 
              // alert("ff - "+response.due_description)

              let due_description=marked.parse(response.due_description); 
              let html_new_desc_fix = (html_new_desc=="vide") ? "" : html_new_desc;
              let due_description_checked = (due_description=="vide") ? html_new_desc_fix : due_description;
              let due_description_fixed = due_description_checked.replace(/\n+$/,"").replace(/---/,"\n")
              // var mdpls = marked.parse(due_description_fixed);

              $form.find(".wrap_desc").html(due_description_fixed).addClass("tmp_modified");
              var $button = $form.parent().find(".submit_sub_desc_edit");
              $button.remove();


                // BUG PERSISTE, RELOAD
                // let delay_before_reload_page = 100
                setTimeout(function () {           
                  const url = new URL(window.location.href);
                  url.searchParams.set('data-task-id', taskId);
                  url.searchParams.set('data-subtask-id', subtaskId);
                  // alert("rem")
                  // window.location.href = url.toString();
                },100);

                // TROP DE SOUCIS AVEC MD RENDING ---- RELOAD
              
          //     //// NO ERROR (pas vide) return 
          //     if (due_description!="vide") {
          //       $($form).find(".original").remove(); return; /// RETURN
          //     }
              
          //     //// ERROR continue (ré-envoi)
          //     if (due_description=="vide") 

          //       $.ajax({
          //         url: "/assets/php/change_subdescription.php",
          //         type: "POST",
          //         data: {
          //             task_id: taskId,
          //             subtask_id: subtaskId,
          //             // title: newTitle,
          //             text: newText.replace(/\n+$/,"").replace(/---/,"\n") //// ON renvoie de nouveau le text original (textarea)
          //             // title: $title
          //             // csrf_token: csrf_token // si tu utilises le CSRF
          //         },
          //         success: function(response) {
          //             // Optionnel : remettre le texte initial au blur
          //             let due_description=response.due_description;
          //             let due_description_checked = (due_description=="vide") ? html_new_desc : due_description;
          //             let due_description_fixed = due_description_checked.replace(/\n+$/,"").replace(/---/,"\n")
          //             // var linkified = linkify(due_description_fixed);
        
          //             $form.find(".wrap_desc").html(due_description_fixed).addClass("tmp_modified");
          //         },
          //         error: function(xhr) {
          //             alb("Erreur AJAX : " + xhr.statusText);
          //         }
          //       }); /// AJAX ERRORS
                
          //       // BUG PERSISTE, RELOAD
          //       let delay_before_reload_page = 100
          //       setTimeout(function () {           
          //         const url = new URL(window.location.href);
          //         url.searchParams.set('data-task-id', taskId);
          //         url.searchParams.set('data-subtask-id', subtaskId);
          //         window.location.href = url.toString();
          //       },delay_before_reload_page);

              

            },
            error: function(xhr, status, error) { 
              alert("ERR", xhr, status, error); 
            }
          }); // AJAX original
        
        // },400);

      } /// ELSE end

      // $textarea.remove();
    
      // var $button = $form.parent().find(".submit_sub_desc_edit");
      // $button.remove();

    // RELOAD/DO READY to start textarea
    // setTimeout(function () {
    //   // alb("re.init sub_dec_clic")
    //   /////// RE.INIT  SUBTASK CLICK -> TEXTAREA...
    //   sub_dec_clic("re", context)
    //   ////////
    // },400);
    
  } /// DESC + TITLE




  //// SAVE TOGGLE SHOW/HIDE
  function toggle_save_checkboxs($this, $desc, task_id, subtask_id) {
    // alb("toggle_save_checkboxs")
    // $this=$(this)
    // let $desc=$($this).parent().parent().next(".sub_desc")
    let $checkbox= $desc.find(".toggle_sub_desc_checkbox")
    
    // INVERS (toggle) STATE
    $checkbox.prop("checked", !$checkbox.prop("checked"));
    
    setTimeout(function () {
      if ($checkbox.prop("checked")==true) {
        var checkis="true"
        $desc.removeClass("active")
        $($this).removeClass("active")
      } else {
        var checkis="false"
        $desc.addClass("active")
        $($this).addClass("active")

      }
      //// SET LOCAL SHOW/HIDE
      localStorage.setItem("sub_desc_checkbox_"+task_id+"_"+subtask_id, checkis);
    },10);

  }

  /// DESC VIDE
  $(".description-inside-task").each(function() {
    if ($(this).find("p").length == 0) {
      // alb("yes")
      $(this).addClass("vide")
    }
  })






  //// MV SUB TASKS -- Cibles + cible_mod, context==keypress
  function cibles(context, $nearest_subt_tr) {
    $(".cible").on("click", function(e) {
      let delay_before_reload_page = 900
      let clicli=0
      e.preventDefault();
      e.stopPropagation();
      $('html').addClass('wait_clic');


      //// THIS IS FIRST CLICKED <-----
      if (context=="keypress") {
        var subid = $($nearest_subt_tr).find(".sub_desc").data('subid');
        $($nearest_subt_tr).closest(".task-board").addClass("clicked_parent");
        $($nearest_subt_tr).closest(".subt_tr").addClass('first_clic_origine');
      } else { // Default
        var subid = $(this).parent().parent().parent().find(".sub_desc").data('subid');
        $(this).closest(".task-board").addClass("clicked_parent");
        $(this).closest(".subt_tr").addClass('first_clic_origine');
      }
      
      // overlays
      $('.subt_td').each(function() {
        // ADD overlay (if not)
        if ($(this).find('.subt_overlay').length === 0) {

            $(this).append('<div class="subt_overlay total subt"></div>');

            $(this).on("click", function(e) {
              e.preventDefault();
              e.stopPropagation();
              clicli++;

              
              let task_id = $(this).find(".sub_title_form").data("task_id");
              // let subtask_id = $(this).find(".sub_title_form").data("subtask_id");
              // alb(subtask_id)
              let subtask_pos = Number($(this).find(".sub_title_form").data("position"));
              let subtask_id_cible = subid;
              // alb(subtask_pos)
              let current_table = $(this).closest(".task-board");
              // alb(current_table.attr("class"))
              // alb(task_id + " + " +subtask_id)
              // return;

              let getparent = $(this).closest(".task-board");
              let parentclass=$(getparent).attr("class")
              if ( !/clicked_parent\s*$/.test(parentclass) ) {
                // Appel AJAX pour déplacer la sous-tâche
                $.ajax({
                  url: '/assets/php/change_subtask_parent.php',
                  type: 'POST',
                  data: {
                    subtask_id: subid,
                    task_id: task_id
                  },
                  success: function(response) {
                    // FEEDBACK
                    // alb('Sous-tâche déplacée !');
                    console.log("tache déplacée")
                  },
                  error: function(xhr) {
                    alb('Erreur lors du déplacement : ' + xhr.statusText);
                  }
                }); /// AJAX SAVE MV
              }


              /// GET POSITION ORDER
              // Récupérer l'ordre actuel
              let order = [];
              $(current_table).find(".subt_tr").each(function() {
                let subtask_id = $(this).find(".sub_desc").attr("data-subid");
                
                if ( !/clicked_parent\s*$/.test(parentclass) ) {  
                  /// NOT SAME ORIGINE (normal)
                  order.push(subtask_id);
                
                } else {
                  /// SAME ORIGINE --- do no add subid (origine) to array (return)
                  if (subtask_id == subid) {
                    return 
                  } else {
                    order.push(subtask_id);
                  }
                }
              });


              order.splice(Number(subtask_pos) - 1, 0, String(subid));
              console.log(subtask_pos)
              console.log(order);
              // return
              $.ajax({
                url: "/assets/php/change_suborder.php",
                type: "POST",
                data: {
                    task_id: task_id,
                    order: order
                },
                success: function(response) {
                    // Optionnel : recharger la page ou mettre à jour l'UI
                    // Redirige vers la même page avec les paramètres demandés
                    setTimeout(function () {           
                      const url = new URL(window.location.href);
                      // alb(task_id + "----" +subid)
                      url.searchParams.set('data-task-id', task_id);
                      url.searchParams.set('data-subtask-id', subid);
                      window.location.href = url.toString();
                    },delay_before_reload_page);
                }
              }); // AJAX
      


              clicli = 0;
              $('html').removeClass('wait_clic');
              $('html').removeData('subid');
            })
            
        } /// OVERLAY SUB TASKS EXISTS

      }); /// subt_td each -- overlays

      
      //// On click element -> GOOO
      $('.task-board').each(function() {

        // ADD overlay (if not)
        if ($(this).find('.subt_td').length === 0) {
          if ($(this).find('.subt_overlay').length === 0) {

            $(this).append('<div class="subt_overlay total"></div>');
            
            $(this).on("click", function(e) {
              e.preventDefault();
              e.stopPropagation();
              clicli++;

              let task_id = $(this).data("task-id")
              // alb(task_id)

              ///// AJAX
              $.ajax({
                url: '/assets/php/change_subtask_parent.php',
                type: 'POST',
                data: {
                  subtask_id: subid,
                  task_id: task_id
                },
                success: function(response) {
                  // FEEDBACK
                  // alb('Sous-tâche déplacée !');
                  console.log("tache déplacée 111")

                  // Optionnel : recharger la page ou mettre à jour l'UI
                  // Redirige vers la même page avec les paramètres demandés
                  setTimeout(function () {
                    const url = new URL(window.location.href);
                    url.searchParams.set('data-task-id', task_id);
                    url.searchParams.set('data-subtask-id', subid);
                    window.location.href = url.toString();
                  },delay_before_reload_page);
                },
                error: function(xhr) {
                  alb('Erreur lors du déplacement : ' + xhr.statusText);
                }
              }); /// AJAX SAVE MV
            });

          } /// overlay not exist ?
        } // subt_td not exist ?
      }); /// task-board ( no sub overlay )

      reset_cible_on_escape();

    }) //// CIBLE
  } /// cibles
  cibles()





  function fn_get_blocs_texts(thiis, action_pls) {

    // alert(action_pls)
    let today = new Date(),
    time = today.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    
    let clip_text = "";
    let promises = [];

    let projet_name = $(thiis).attr("data-projet-name");
    let swimlane_name = $(thiis).attr("data-swimlane-name");
    
    clip_text += projet_name + " > ";
    clip_text += swimlane_name + " > ";
    clip_text += "\nTâche n° : " + $(thiis).find(".task-board-title a").attr("href").replace("\/?","").replace("controller=TaskViewController&action=show&task_id=","") + "\n"

    clip_text += "---------\n\n"
    /// TITRE DESC
    clip_text += "# "
    clip_text += md( $(thiis).find(".task-board-title a").text() ) + "\n"
    clip_text += md( $(thiis).find(".description-inside-task").html() ) + "\n"
    
    let tasktotal = $(thiis).find('.subt_tr').length;

    /// SUB TASKS
    $(thiis).find('.subt_tr').each(function() {
        let id = $(thiis).attr("data-task-id");
        let subid = $(this).find("[data-subtask_id]").attr("data-subtask_id");
        
        // On wrappe la promesse pour conserver id et subid
        promises.push(
            cpclip_subtasks(id, subid).then(result => ({
                id: id,
                subid: subid,
                result: result
            }))
        );
    });
    
    /// INFOS
    const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
    const {weekday, dayNumber, month, year} = frenchTodayDate();
    const aujourdhui = `${capitalize(weekday)}, le ${dayNumber} ${month} ${year}`;
    
    Promise.all(promises).then(results => {
      let tascount = 1;
      
      results.forEach(item => {


        let projet_id = $(thiis).attr("data-project-id")
        var host = window.location.host; 
        var proto = window.location.protocol; 
        let id = $(thiis).attr("data-task-id");

        let public_link = $(thiis).find(".view_readonly").attr("href")
        // alert(public_link)
        // "/?controller=BoardViewController&action=show&project_id=" + projet_id + "&data-task-id=" + id +")"

        let task_link = (action_pls=="md_to_pdf") ?
            "\n[lien vers la tâche]("+proto + "//" + host + public_link +")" :
            proto + "//" + host + public_link
        alert(task_link)
        /// FIRST
        if (tascount == 1) {
            clip_text += aujourdhui + " -- " + time + "\n";
            clip_text += task_link
            
            clip_text += "\n\n" + tascount + " ======================== " + tascount + "/" + tasktotal + "\n\n";
        }
        
        // "[lien vers la sous-tâche]("+proto + "//" + host + "/?controller=BoardViewController&action=show&project_id=" + projet_id + "&data-task-id=" + id +"&data-subtask-id="+item.subid +")\n" :
        let sub_task_link_top = (action_pls=="md_to_pdf") ?
            "[lien vers la sous-tâche]("+proto + "//" + host + public_link +"&data-subtask-id="+item.subid +")\n" :
            ""

        clip_text += sub_task_link_top;

        /// TEXTE
        clip_text += item.result; 
  

        // "\n\n-- Lien :\n"+proto + "//" + host + "/?controller=BoardViewController&action=show&project_id=" + projet_id + "&data-task-id=" + id +"&data-subtask-id="+item.subid+"\n"
        let sub_task_link = (action_pls=="md_to_pdf") ?
            "" :
            "\n\n-- Lien :\n"+proto + "//" + host + public_link +"&data-subtask-id="+item.subid+"\n"

        clip_text += sub_task_link;
               


        tascount++
        // NORMAL
        if ((tascount>1) && (tascount!=tasktotal+1)) {
          clip_text+="\n\n"+tascount+" ====================\ \n\n"
          
        };


        // LAST
        if (tascount==tasktotal+1) {
          clip_text += "\n\n=========================== "+Number(tascount-1)+"/"+Number(tasktotal)+"\n\n\n"
        };




      });


      /// LAST if no subtasks
      if (tasktotal==0) {
        
        clip_text+="\n\n========================\n\n"


      };



      
      if (action_pls=="md_to_pdf") {
        exporterEnPdf(clip_text)
      } else {
        navigator.clipboard.writeText(clip_text).then(() => {
            alert(clip_text);
        }).catch(err => {
          alert('Erreur lors de la copie : ' + err);
        });
      }
    });
  }


  /// CLIPALL infos date French
  const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ]
  function frenchTodayDate() {

    let today = new Date();
    let year = today.getFullYear()
    let dayNumber = today.getDate()
    let month = mois[today.getMonth()]
    let weekday = today.toLocaleDateString("fr-FR", { weekday: "long" });

    return { weekday, dayNumber, month, year }
  }

  $('.task-board').each(function() {
    const thiis = $(this)


    /// ADD cpclip_all button
    $(thiis).find(".rm_task_quickaction").before("\
    <a class='cpclip_all' onclick=''> \
        <i class='fa fa-clipboard'></i> \
    </a> \
    <a class='md_to_pdf' onclick=''> \
        <i class='fa fa-file'></i> \
    </a>")


    var host = window.location.host; 
    var proto = window.location.protocol; 
    var data_task_id = $(this).attr("data-task-id")
    var data_project_id = $(this).attr("data-project-id")
    /// ADD plink_sub_task button
    $(thiis).find(".rm_task_quickaction").before("\
      <a class='plink_sub_task' href='"+proto+"//"+host+"/?controller=BoardViewController&action=show&project_id="+data_project_id+"&data-task-id="+data_task_id+"'> \
          <i class='fa fa-link'></i> \
      </a>")
    


    $(thiis).find(".cpclip_all").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      let thiis=$(this).parent().parent().parent()
      fn_get_blocs_texts(thiis)
    })
    $(thiis).find(".md_to_pdf").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      let thiis=$(this).parent().parent().parent()
      fn_get_blocs_texts(thiis, "md_to_pdf")
    })

  }) //// task-board


  // FAIL
  // function ajouterCesureAutomatique(texte) {
  //   // Fonction plus agressive qui coupe les mots vraiment longs
  //   return texte.replace(/\b(\w{8,})\b/g, function(mot) {
  //     // Coupe tous les mots de 8+ caractères tous les 4-5 caractères
  //     return mot.replace(/(\w{4,5})/g, '$1\u00AD');
  //   });
  // }

  function exportMarkdownToPdf(markdownText, filename = 'document.pdf') {
    // const texteAvecCesure = ajouterCesureAutomatique(markdownText);
    const htmlContent = marked.parse(markdownText);
    
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .pdf-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
          padding: 20px;
          margin-left: 30px;
          max-width: 600px;  /* Réduit de 800px à 600px pour forcer plus de césures */
          text-align: justify;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .pdf-container h1 { 
          font-size: 24pt; 
          margin-top: 0;
          margin-bottom: 16px;
          border-bottom: 2px solid #eee;
          padding-bottom: 8px;
        }
        .pdf-container h2 { 
          font-size: 20pt; 
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .pdf-container h3 { 
          font-size: 16pt; 
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .pdf-container p { 
          margin: 8px 0;
          word-wrap: break-word;
        }
        .pdf-container code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10pt;
          word-wrap: break-word;
        }
        .pdf-container pre {
          background: #f4f4f4;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
          margin: 12px 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .pdf-container pre code {
          background: none;
          padding: 0;
        }
        .pdf-container ul, .pdf-container ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        .pdf-container li {
          margin: 4px 0;
          word-wrap: break-word;
        }
        .pdf-container blockquote {
          border-left: 4px solid #ddd;
          margin: 12px 0;
          padding-left: 16px;
          color: #666;
          font-style: italic;
        }
        .pdf-container table {
          border-collapse: collapse;
          width: 100%;
          margin: 12px 0;
          table-layout: fixed;
        }
        .pdf-container th, .pdf-container td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          word-wrap: break-word;
        }
        .pdf-container th {
          background: #f4f4f4;
          font-weight: bold;
        }
        .pdf-container a {
          color: #0366d6;
          text-decoration: none;
          word-wrap: break-word;
        }
        .pdf-container img {
          max-width: 100%;
          height: auto;
        }
      </style>
      <div class="pdf-container" lang="fr">
        ${htmlContent}
      </div>
    `;
    
    const options = {
      margin: [10, 0, 0, 45],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(options).from(container).save();
  }

  function exporterEnPdf(clip_text) {
    console.log("GO --- exporterEnPdf")
    console.log(clip_text)
    exportMarkdownToPdf(clip_text, 'kanboard-export.pdf');
  }
  

  ///// TEXTAREA AUTO HEIGHT (depreciated)
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto'; // Réinitialise d'abord la hauteur
    textarea.style.height = (textarea.scrollHeight + 4) + 'px'; // Ajuste à la hauteur du contenu (+10px)
    // $("html").css("overflow", "hidden")
  }
  /////


  function cpclip_subtasks(id, subid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "/assets/php/get_subdescription.php",
        type: "POST",
        dataType: "json",
        data: { task_id: id, subtask_id: subid, what: "title_desc" },
        success: function(response) {
          if (response.title) {
            // alb(response.title)
            let final_cp = "## "+response.title + "\n" + response.due_description;
            resolve(final_cp);
          } else {
            resolve("eeerorr");
          }
        },
        error: function() {
          reject("Erreur AJAX");
        }
      });
    });
  }


  function attendreClic(element) {
    return new Promise(resolve => {
      $(element).one('click', function(event) {
        resolve(event);
      });
    });
  }
  


  // Ajout : reset_textarea_on_escape
  var escapeListenerAdded = false;
  function reset_textarea_on_escape() {
    if (escapeListenerAdded) return;
    escapeListenerAdded = true;
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        
        if ($('.desc_please').length > 1) {
            if (!window.confirm("ESCAPE va fermer les zonnes de textes en cours d'édition (textareas)...\n\nPlusieurs textareas sont ouvertes. \n\nVoulez-vous toutes les fermer sans sauvegarder ?")) return;
        }

        $('.desc_please').each(function() {
          // alb($(".desc_please").length)
          var $parent = $(this).parent();
          // alb($parent.attr("class"))
          var $textarea = $parent.find('textarea');
          
          var $subDesc = $parent.closest('.sub_desc');
          var taskId = $subDesc.data('taskid');
          var subtaskId = $subDesc.data('subid');
          // alb("ok");
          if (!taskId || !subtaskId) csl("error");
          // Appel AJAX pour récupérer le texte d'origine
          $.ajax({
            url: "/assets/php/get_subdescription.php",
            type: "POST",
            dataType: "json",
            data: {
              task_id: taskId,
              subtask_id: subtaskId,
              what: "due_description"
            },
            success: function(response) {
              // csl(response.due_description)
              var md_due_description = response.due_description ? marked.parse(response.due_description) : '';

              var linkified = linkify(md_due_description);

              // Supprime la textarea et affiche le texte d'origine
              $textarea.remove();
              // On cherche ou insérer le texte :
              if ($parent.find('.wrap_desc').length) {
                $parent.find('.wrap_desc').remove();
              }
              let html_original=$parent.find('.original').html().trim().replace('<div class="original">','').replace("</div>","")


              $parent.append(html_original);
              $parent.removeClass('textarea_active');
              // On retire aussi le bouton si présent
              $parent.find('.sub_task_title_only_button, .submit_sub_desc_edit').remove();

              $parent.find('.wrap_desc').addClass("after_escape")
              $parent.find('.original,.submit_sub_desc_edit').remove()
              $parent.parent().find('.submit_sub_desc_edit').remove()
              // $(this).remove()
            },
            error: function(xhr) {
              alb("Erreur AJAX : " + xhr.statusText);
            }
          });

          // $parent.removeClass("active")
          // alb("stop")
        });

        $('html').removeClass('wait_clic').removeClass('largeview');
        $('.edit_me').removeClass('edit_me')
        $('.edit_mod_place').remove()

      }


    }, true); // <--- true active la capture

    $("html").css("overflow", "auto")
    $('html').removeClass('wait_clic').removeClass('largeview');
  }  

  function linkify(text) {
    return text.replace(
      /(\bhttps?:\/\/[^\s<]+)/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  /// ESCAPE CIBLE
  var escapeCibleListenerAdded = false;
  function reset_cible_on_escape() {
    if (escapeCibleListenerAdded) return;
    escapeCibleListenerAdded = true;
    document.addEventListener('keydown', function(e) {
      
      if (e.key === 'Escape') {
        
        // Supprimer les classes ajoutées
        $('.clicked_parent').removeClass('clicked_parent');
        $('.first_clic_origine').removeClass('first_clic_origine');
        // Supprimer les overlays ajoutés
        $('.subt_overlay').remove();
        // Optionnel : retirer la classe d’attente
        $('html').removeClass('wait_clic').removeClass('largeview');
        // Optionnel : reset d’autres effets visuels si besoin
      }
    }, true);
  }

  $('.subt_tr').each(function() {

    
    let fulltxt_l = $(this).find(".wrap_desc").text().trim().length
    let fulltxt = ( $(this).find(".wrap_desc").text().trim() == "vide" ) ? 0 : fulltxt_l;
    
    // alert(fulltxt)
    let longeure;
    switch (true) {
      case (fulltxt == 0):
        longeure = "vide";
        break;
      case (fulltxt < 600):
        longeure = "court";
        break;
      case (fulltxt < 800):
        longeure = "normal";
        break;
      default:
        longeure = "long";
    }
    $(this).find(".sub_task_title_only").before("<span class='count_caracter_desc "+longeure+"'>"+fulltxt+"</span>")
  })












  // Variables pour la position de la souris
let mouseX, mouseY;

// Tracker la position de la souris
$(document).on('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Fonction pour vérifier si une textarea est en cours d'utilisation
function isTextareaActive() { /// Textarea is editing ?
  
  const activeElement = document.activeElement;
  
  // Vérifier si l'élément actif est une textarea
  if (activeElement && activeElement.tagName.toLowerCase() === 'textarea') {
      return true;
  }
  
  // Vérifier si l'élément actif est un input text
  if (activeElement && activeElement.tagName.toLowerCase() === 'input' && 
      ['text', 'email', 'password', 'search', 'url'].includes(activeElement.type)) {
      return true;
  }
  
  // Vérifier si l'élément actif est contenteditable
  if (activeElement && activeElement.contentEditable === 'true') {
      return true;
  }
  
  return false;

} /// isTextareaActive




////////// EDIT
/// PRESS E - edit_mod trouver wrap_desc (plus proche de l'élément survolé par la sourie)
function find_subt_tr(elementUnderMouse) {
  // const $container = $(elementUnderMouse).closest(".subt_tr");
  const $wrap = $(elementUnderMouse).closest(".subt_tr");
  return $wrap;
}

/// PRESS E/button a.edit_mode -> edit_mode ()
/// TOGGLE display textarea open
/// CSS html.largeview
function edit_mod(elementUnderMouse) {

  if ( !$("html").hasClass("largeview") ) { /// ? notAlready largeview

    if (elementUnderMouse) {
      
      const $nearest_subt_tr = find_subt_tr(elementUnderMouse)
      if ($nearest_subt_tr.find(".wrap_desc").length > 0) {
        //// GOOOO
        $nearest_subt_tr.find(".wrap_desc").click();
  
        /// CSS
        $("html").addClass("largeview");
        $nearest_subt_tr.addClass('edit_me')
  
        /// GOOO SHOW Textarera (un.collapse)
        /// Eye Toggle = display sub_desc
        $nearest_subt_tr.find(".sub_desc").addClass("active");
        //// Checkbox, display textarea
        $nearest_subt_tr.find(".toggle_sub_desc_checkbox").prop("checked", false);
  
        /// CLONE FAKE TITLE place -- edit_mod_place
        let title_text=$nearest_subt_tr.find(".title_text").text()
        $nearest_subt_tr.after('<tr class="subt_tr edit_mod_place"><td>'+title_text+'</td></tr>')
  
        // return $nearestToggle_sub_desc;
      } else { 
          console.log('--- Aucun .subt_tr trouvé');
      }
    } 
    
  } else { // ? html.largeview
    console.log('--- already largeview');
  } // ? html.largeview

} /// edit_mod


//// BUG RECURSSIV BUG
// function cible_mod(elementUnderMouse) {
//     if (elementUnderMouse) {
//       const $nearest_subt_tr = find_subt_tr(elementUnderMouse)
//       console.log($nearest_subt_tr)
//       cible_mod("keypress", $nearest_subt_tr)
//     } 
// } /// cible_mod



//// KEYPRESS
$(document).on('keydown', function(e) {
  // Vérifier si une textarea est active - si oui, sortir de la fonction
  if (isTextareaActive()) { // Textarea en court d'edit
      return;
  }

  /// E edit_mod
  if (e.key === 'e' || e.key === 'E') {
    // Récupérer l'élément sous la souris
    const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
    if (elementUnderMouse) {
      edit_mod(elementUnderMouse);
    } else {
      console.log("---- debug NO elementUnderMouse")
    }
  } /// E

  /// C cible_mod
  // if (e.key === 'c' || e.key === 'C') { /// RECURSSIV BUG
  //   // Récupérer l'élément sous la souris
  //   const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
  //   if (elementUnderMouse) {
  //     cible_mod(elementUnderMouse);
  //   } else {
  //     console.log("---- debug NO elementUnderMouse")
  //   }
  // } /// C
  
  /// H Hide / show : toggle
  if (e.key === 'h' || e.key === 'H') {
      // Récupérer l'élément sous la souris
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      
      if (elementUnderMouse) {
          // Chercher le .subt_tr le plus proche
          const $nearestToggle_sub_desc = $(elementUnderMouse).closest('.subt_tr').find(".toggle_sub_desc_a");
          
          if ($nearestToggle_sub_desc.length > 0) {
              //// GOOOO
              $nearestToggle_sub_desc.click();
              // console.log('Élément .subt_tr trouvé:', $nearestToggle_sub_desc[0]);
              return $nearestToggle_sub_desc;
          } else {
              console.log('Aucun .subt_tr trouvé');
          }
      }

      const $nearestToggle_all_sub = $(elementUnderMouse).closest('.task-board-expanded').find(".all_toggle");
      if ($nearestToggle_all_sub.length > 0) {
          $nearestToggle_all_sub.click();
          console.log('Élément .all_toggle:', $nearestToggle_all_sub[0]);
          return $nearestToggle_all_sub;
      } else {
          console.log('Aucun .all_toggle trouvé');
      }

  } /// H

  /// M bug
  if (e.key === 'm' || e.key === 'M') {
      // Récupérer l'élément sous la souris
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      
      if (elementUnderMouse) {
          const $nearestHandle = $(elementUnderMouse).closest('.board-task-list');
              
          if ($nearestHandle.length > 0) {
              $nearestHandle.mousedown();
              console.log('Élément .board-task-list:', $nearestHandle[0]);
              return $nearestHandle;
          } else {
              console.log('Aucun .board-task-list trouvé');
          }
      }
  } /// M

});

//// CHECK If textarea in use --> if yes, disable Ket Triggers
function isTextareaFocused() {
  return document.activeElement && document.activeElement.tagName.toLowerCase() === 'textarea';
}


$(document).on("click", ".edit_close", function (e) {
  reset_textarea_on_escape();
  $("html").removeClass("largeview")
  // alert('close')
  $(".edit_mod_place").remove()
  const $nearest_subt_tr = $(this).parent().parent().parent();
  $nearest_subt_tr.removeClass("edit_me")
});


$(document).on("click", ".edit_mod", function (e) {
  const elementUnderMouse = $(this).parent().parent().parent();
  edit_mod(elementUnderMouse);
});





// alert("ready 111");
$(document).ready(function() {
  var isDragging = false;
  var draggedElement = null;
  
  $('.board-task-list').on('mousedown', function() {
      isDragging = true;
      draggedElement = $(this).closest('.board-task');
      console.log('Début drag:', draggedElement);
  });
  
  $(document).on('mouseup', function() {
      if (isDragging) {
          setTimeout(function() {
              // console.log('Fin drag-drop');
              dragndropend();
              isDragging = false;
              draggedElement = null;
          }, 100); // Petit délai pour laisser le DOM se mettre à jour
      }
  });
});

function dragndropend() {
  console.log("todo on dndrop end")
}

} ///// IF ( $("#board").length != 0 ) {


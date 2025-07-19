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

const adebug_active = "oui";
const off="off"

if ( $("#board").length != 0 ) {

  /// MV Menu
  $(".project-header").insertAfter(".title-container > h1");

  /// Modal links
  $(".task-board-title a").on("click", function(e) {
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
  $("a.board-swimlane-toggle").after("<span class='quick_swimlane'> \
    <a title='Modifier Swimelines' href='/?controller=SwimlaneController&action=index&project_id="+projectId+"'> \
       <i class='fa fa-align-justify' aria-hidden='true'></i>  \
    </a> \
    <a title='Modifier Colones' href='/?controller=ColumnController&action=index&project_id="+projectId+"'> \
       <i class='fa fa fa-columns' aria-hidden='true'></i>  \
    </a> \
    </span>")

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
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }  
    }

    if (subtaskId) { // ### avec sub id (ex: after mv subtask (cible))
      /// USED after moving subtask (cible)
      // alb(subtaskId)
      const sub_el_scroll=document.querySelector(`[data-subtask_id="${subtaskId}"]`)
      let sub_el=$(".sub_title_form[data-subtask_id="+subtaskId+"]")
      $(sub_el).parent().next(".sub_desc").addClass('sub_task-highlighted');
      $(sub_el).parent().addClass('sub_task-highlighted');
      sub_el_scroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

  }
  // Exécuter au chargement de la page
  highlightTaskById();



  $(".task-board-header").each(function () {
    let dragme='<i class="fa fa-hand-paper-o header_task" aria-hidden="true" onclick=""></i>';
    $(this).append(dragme)
  });


  // VBULLE SUBTASK on clic +
  $(document).on("click", ".dropdown-submenu-open_alt li a", function (e) {
      e.preventDefault();
      let url=$(this).attr("href")
      KB.modal.open(url, "medium", !0);
  });

  /// INIT TOGGLE
  initToggleSubDesc("mess");


  function initToggleSubDesc(mess) {
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

  // var coco=coco_hide=0
  /// SHOW/HIDE ALL
  $(document).on("click", ".all_toggle", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $this=$(this)
    var $task_wrp = $(this).parent().parent().parent()
    var $desc=$task_wrp.find(".sub_desc")
    let $checkbox= $desc.find(".toggle_sub_desc_checkbox")
    let $checkbox_a= $task_wrp.find(".toggle_sub_desc_a")


    // alb($desc.length)
    
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
    // if (coco_hide == coco) {
    //   $this.closest(".all_toggle").removeClass("active")
    //   alb("yes")
    // }

  })


  ////////////
  //////////// AJAX
  ////////////
  function ajax_this(subtaskId,taskId,newText,newTitle,$this,project_id, $title) {

   console.log("----" + taskId +
    "\nsubtaskId " + subtaskId +
    "\nnewText " + newText +
    "\nnewTitle " + newTitle
    // "\ntitle " + $title
  ) 
  ////// TITLE
    $.ajax({
      url: "/assets/php/change_subdescription.php",
      type: "POST",
      data: {
          task_id: taskId,
          subtask_id: subtaskId,
          title: newTitle,
          text: newText
          // title: $title
          // csrf_token: csrf_token // si tu utilises le CSRF
      },
      success: function(response) {
          // Optionnel : remettre le texte initial au blur
          var $form = $this;
          // alb("ok ajax")
          ////// END -> DO
          if ((newTitle!="") && (newText!="")) {
             //// USE on paste (title + desc_text)
            reset_textarea("success onclick", $form, "title_and_desc", taskId, subtaskId)
          } else {
            reset_textarea("success onclick", $form, "title")
          }
      },
      error: function(xhr) {
          alb("Erreur AJAX : " + xhr.statusText);
      }
    });
    

    //// COOL not PHP but ask user+Pass
  // let newText_fix = newText.replace("---","<br>")
  // $.ajax({
  //   url: "/jsonrpc.php",
  //   type: "POST",
  //   contentType: "application/json",
  //   data: JSON.stringify({
  //       "jsonrpc": "2.0",
  //       "method": "updateSubtask",
  //       "id": Date.now(),
  //       "params": {
  //           "id": subtaskId,
  //           "task_id": taskId,
  //           "title": newText_fix
  //       }
  //   }),
  //   success: function(response) {
  //       // Optionnel : remettre le texte initial au blur
  //       // var $form = $subDesc;
  //       // reset_textarea($form)
  //       // alb("sssss")
        
  //       $($this).text(newText_fix) 
  //       $textarea=$($this).find("textarea")
  //       $textarea.remove()
  //       // sub_title_clic()

  //       setTimeout(function () {
  //         // sub_title_clic()
  //         // sub_dec_clic()
  //         // initToggleSubDesc()  
  //         // window.location.reload();
  //         window.location.href = "https://kb.vincent-bonnefille.fr/?controller=BoardViewController&action=show&project_id="+project_id+"&data-task-id="+taskId+"&highlight=no";
  //       },100);

  //   },
  // });


  }

  // VBULLE SUBTASK on clic +
  function sub_title_clic() {
    // alb("sub_dec_clic")
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
      var $textarea = $('<textarea class="title_please" name="text" tabindex="-1" placeholder="Titre">').val(currentText);
      $this.append($textarea);
      $textarea.focus();
      $this.find(".title_text").remove()

      /// AUTO HEIGHT
      autoResizeTextarea($textarea[0]);
      $textarea.on('input', function() {
        autoResizeTextarea(this);
      });



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
        ajax_this(subtaskId,taskId,newText,"",$this,project_id,currentText)
      
      }); /// END $('.submit_sub_desc_edit') ONCLICK SUBMIT BUTTON


    }); /// END .sub_desc CLICK



    /// ON SUBTASK TEXTAREA SUBMIT --- TITLE
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
        ajax_this(subtaskId,taskId,newText,"",$this,project_id)
      }
    }); /// SUBMIT
  } /// FUN sub_dec_clic
  
  /////// INIT
  sub_title_clic()
  //////////////
  
  // VBULLE SUBTASK on clic +
  function sub_dec_clic(message, context) {
    // alb("sub_dec_clic")
    // alb($('.sub_desc').length)

    // SUBTASK -> TEXTAREA -> PHP MAJ DUE_DESCRIPTION
    $('.sub_desc_title').on('click', function(e) {
      e.preventDefault(); // 1. Empêche le comportement par défaut
      e.stopPropagation();

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
        // alb("submit_sub_desc_edit")
    
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
                reset_textarea("success onclick",$form)
                // alb("kkk")
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

            var $textarea = $('<textarea class="desc_please" name="text" tabindex="-1" placeholder="Markdown">').val(response.due_description);
            $wrap_desc.replaceWith($textarea);
            $textarea.focus();
  
            // /// AUTO HEIGHT
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
        
        // alb($(this).attr("class"))
        // alb(subtaskId)
        // if (!subtaskId) return

        var taskId = $subDesc.data('taskid');
        var project_id = $subDesc.data('projectid');
        
        // alb(subtaskId)
        // alb(taskId)
        // alb(project_id)

        let newTitle = lines.slice(0, sepIndex).join('\n').trim();
        let newText = lines.slice(sepIndex + 1).join('\n').trim();
        // alb(newTitle)
        // alb(newText)

        ajax_this(subtaskId,taskId,newText,newTitle,$form,project_id) // DESC !inversed_order==first
        // ajax_this(subtaskId,taskId,newText,"",$form,project_id) // DESC !inversed_order==first

        // alb("ok")

    } else {

      $.post(url, data, function(response) {
        // alb("Description mise à jour !");
        ///// END -> DO
        reset_textarea("on submit",$form)
        /////
      }).fail(function(xhr) {
          alb("Erreur AJAX : " + xhr.statusText);
      }); /// POST

    }


  
  }); /// SUBMIT
  



  /// DEPRECIATED (localstorage)
  // $(function() {
  //     let task_id = $(".table-suboncard").data("taskid");
  //     /// GET LOCAL ORDER ( replaced --> MYSQL -> change_suborder.php)
  //     // let order = localStorage.getItem("subtasks_order_" + task_id);
  //     if (order) {
  //         order = JSON.parse(order);
  //         let tbody = $(".table-suboncard tbody");
  //         // On trie les lignes selon l'ordre stocké
  //         order.forEach(function(subtask_id) {
  //             let row = tbody.find('.sub_desc[data-subid="' + subtask_id + '"]').closest(".subt_tr");
  //             if (row.length) {
  //                 tbody.append(row); // déplace la ligne à la fin (donc dans l'ordre)
  //             }
  //         });
  //     }
  // });



  $(".wrap_desc a").on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let url = $(this).attr("href")
    window.open(url, '_kan_url');
    // alb(url)
  })


  ///// DRAGNDROP
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

  // $(".table-suboncard").each(function() {
    // alb($(this).attr("data-have_desc"))
    // if ($(this).attr("data-have_desc")) {
// 
    // }
  // })




  

  ///// FUNCTIONS
  /// RESET TEXTAREA
  /// ( USE ON SUBTASK TEXTAREA SUBMIT )
  function alb(message, active) {
    if (adebug_active=="oui" && active!="off") alert(message);
  }

  function reset_textarea($message, $form, context, taskId, subtaskId) {
    // alb("reset_textarea == "+$message)
    var $textarea = $form.find("textarea");
    var newText = $textarea.val();
    // alb(context)
    // alb($form.attr("class"))
    // alb(newText)

    // LOAD marked JS --> 
    // app/Template/layout.php
    // <?= $this->asset->js('assets/js/marked.min.js') ?>

    var html = marked.parse(newText);
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
          $formform.append('<span class="wrap_desc tmp_modified 0">'+md_due_description+'</span>');
          $titltitle.html('<span class="title_text">'+md_title.replace(/\n$/,"").replace(/---/,"\n")+'</span>');

          var $button = $form.parent().find(".submit_sub_desc_edit");
          $button.remove();

        }
        
      });

    
    } else if (context=="title") {
    //// TITLE

      // alb(html)
      // alb(($form).attr("class"))
      $form.parent().find(".sub_task_title_only").html('<span class="title_text">'+html.replace(/\n$/,"").replace(/---/,"\n")+'</span>');
      var $button = $form.parent().find(".sub_task_title_only_button");
      // alb("reset")
      // alb($form.parent().attr("class"))
      $form.parent().removeClass("textarea_active")
      $button.remove();


    } else {
    //// DESC
      // alb("desc")
      $form.append('<span class="wrap_desc tmp_modified 0">'+html+'</span>');
      // alb($form.parent().attr("class"))
      var $button = $form.parent().find(".submit_sub_desc_edit");
      $button.remove();

    }

    $textarea.remove();


    setTimeout(function () {
      // alb("re.init sub_dec_clic")
      /////// RE.INIT  SUBTASK CLICK -> TEXTAREA...
      sub_dec_clic("re", context)
      ////////
    },400);
    
  }







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


  $(".description-inside-task").each(function() {
    if ($(this).find("p").length == 0) {
      // alb("yes")
      $(this).addClass("vide")
    }
  })


  //// MV SUB TASKS
  $(".cible").on("click", function(e) {
    let delay_before_reload_page = 900
    let clicli=0
    e.preventDefault();
    e.stopPropagation();

    $('html').addClass('wait_clic');
    // Ajoute les overlays si besoin
    // $('.subt_tr').each(function() {
    //     if ($(this).find('.subt_overlay').length === 0) {
    //         $(this).append('<div class="subt_overlay"></div>');
    //     }
    // });

    //// THIS IS FIRST CLICKED <-----
    let subid = $(this).parent().parent().parent().find(".sub_desc").data('subid');

    $(this).closest(".task-board").addClass("clicked_parent")
    $(this).closest(".subt_tr").addClass('first_clic_origine');
    
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
                  // Optionnel : recharger la page ou mettre à jour l’UI
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

    }); /// subt_td each



    
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

                // Optionnel : recharger la page ou mettre à jour l’UI
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

  }) //// CIBLE







const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre" ]

function frenchTodayDate() {

  let today = new Date();
  let year = today.getFullYear()
  let dayNumber = today.getDate()
  let month = mois[today.getMonth()]
  let weekday = today.toLocaleDateString("fr-FR", { weekday: "long" });

  return { weekday, dayNumber, month, year }
}
// console.log(frenchTodayDate())
//=> { weekday: 'mercredi', dayNumber: 12, month: 'octobre', year: 2022 }


  $('.task-board').each(function() {
    const thiis = $(this)

    /// ADD cpclip_all button
    $(thiis).find(".rm_task_quickaction").before("\
    <a class='cpclip_all' onclick=''> \
       <i class='fa fa-clipboard'></i> \
    </a>")


    $(thiis).find(".cpclip_all").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      let clip_text="";
      clip_text+="# "
      clip_text+=md( $(thiis).find(".task-board-title a").text() ) +"\n"
      clip_text+=md( $(thiis).find(".description-inside-task").html() ) +"\n\n"

      $(thiis).find('.subt_tr').each(function() {
        clip_text+="-----\n- "
        clip_text+=md( $(this).find('.sub_title_form').html() ) +"\n"
        // SI DESC != VIDE
        let txt_desc = ($(this).find('.wrap_desc').text() == "vide") ? clip_text+=md( $(this).find('.wrap_desc').html() ) +"\n": "";
        clip_text+="-----\n\n"
      })




      /*So let's say you want to print date according tothe french languages rules*/
      const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
      const {weekday, dayNumber, month, year} = frenchTodayDate()
      const aujourdhui = `${capitalize(weekday)}, le ${dayNumber} ${month} ${year}`
      // console.log(aujourdhui)
      //=> Mercredi, le 12 octobre 2022
      clip_text+=aujourdhui;
      clip_text+="\n" + $(thiis).find(".task-board-title a").attr("href").replace("\/?","")
      // alb(clip_text)

      navigator.clipboard.writeText(clip_text).then(() => {
        alert(clip_text);
      }).catch(err => {
          // console.error('Failed to copy text: ', err);
          alert('Failed to copy text: ', err);
      });
    })

  }) //// task-board
  

  ///// TEXTAREA AUTO HEIGHT
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto'; // Réinitialise d'abord la hauteur
    textarea.style.height = (textarea.scrollHeight + 4) + 'px'; // Ajuste à la hauteur du contenu (+10px)
  }
  /////





  function attendreClic(element) {
    return new Promise(resolve => {
      $(element).one('click', function(event) {
        resolve(event);
      });
    });
  }
  


  


} ///// IF ( $("#board").length != 0 ) {

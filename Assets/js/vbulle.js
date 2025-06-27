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

  /// MV Menu
  $(".project-header").insertAfter(".title-container > h1");


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
      
      // alert(url)

      // 2. Ajouter le nouveau paramètre "search"
      urlObj.searchParams.append('search', `+tag:"${tagname}"`);

      let tagurl = urlObj.toString().replace("%2B","+")
      // alert(tagurl)
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
  // 2. Chercher l'élément correspondant dans la page
  function highlightTaskById() {
    // alert("highlightTaskById")
    const taskId = getTaskIdFromUrl();
    if (taskId) {
      const el = document.querySelector(`[data-task-id="${taskId}"]`);
      if (el) {
        // Par exemple, on ajoute une classe pour le mettre en évidence
        el.classList.add('task-highlighted');
        // Ou on peut scroller jusqu'à l'élément
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  // Exécuter au chargement de la page
  highlightTaskById();



  // VBULLE SUBTASK on clic +
  $(document).on("click", ".dropdown-submenu-open_alt li a", function (e) {
      e.preventDefault();
      let url=$(this).attr("href")
      KB.modal.open(url, "medium", !0);
  });

  /// INIT TOGGLE
  initToggleSubDesc("mess");


  function initToggleSubDesc(mess) {
    // alert("initToggleSubDesc== "+mess)

    /// SHOW/HIDE SUBTASK (checkboxs)
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
      
      if (saved !== null) {
        if (saved=="true") {
          $($checkbox).prop("checked", true);
          $desc.removeClass("active")
          $(this).removeClass("active")
          // coco_hide++
        } else {
          $($checkbox).prop("checked", false);
          $desc.addClass("active")
          $(this).addClass("active")
          // coco++
        }
      }

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


    // alert($desc.length)
    
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
      // coco++;
      // alert($(this).attr("class"))
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

        // alert(checkis)
        /// GET LOCAL SHOW/HIDE chekbox 1
        localStorage.setItem("sub_desc_checkbox_"+task_id+"_"+subtask_id, checkis);

      },10);

    })
    // if (coco_hide == coco) {
    //   $this.closest(".all_toggle").removeClass("active")
    //   alert("yes")
    // }

  })

  
  // VBULLE SUBTASK on clic +
  function sub_dec_clic() {
    // alert("sub_dec_clic")
    // alert($('.sub_desc').length)

    // SUBTASK -> TEXTAREA -> PHP MAJ DUE_DESCRIPTION
    $('.sub_desc').on('click', function(e) {
      e.preventDefault(); // 1. Empêche le comportement par défaut

      // 2. Transforme le contenu en textarea
      var $this = $(this);
      var $wrap_desc = $(this).find(".wrap_desc");
      var $button = $('<button class="submit_sub_desc_edit" type="submit">Valider</button>');
      $wrap_desc.after($button);

      /// ONCLICK SUBMIT BUTTON
      $(".submit_sub_desc_edit").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // alert("submit_sub_desc_edit")
    
        // Récupérer les éléments nécessaires
        var $subDesc = $(this).closest('.sub_desc');
        var subtaskId = $subDesc.data('subid');
        var taskId = $subDesc.data('taskid');
        var newText = $subDesc.find('textarea[name="text"]').val();
    
        // Optionnel : CSRF token si besoin
        var csrf_token = $subDesc.find('input[name="csrf_token"]').val();
    
        //// AJAX POST DATAS
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
                reset_textarea($form)
            },
            error: function(xhr) {
                alert("Erreur AJAX : " + xhr.statusText);
            }
        });
        //// END AJAX
        
      }); 
      /// END $('.submit_sub_desc_edit') ONCLICK SUBMIT BUTTON

      /// CONTINUE .sub_desc DESC ACTIONS
      /// POP TEXTAREA
      var currentText = $this.attr("data-text");
      var $textarea = $('<textarea name="text" tabindex="-1" placeholder="Écrivez votre texte en Markdown">').val(currentText);
      $wrap_desc.replaceWith($textarea);
      $textarea.focus();

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
  
    $.post(url, data, function(response) {
      // alert("Description mise à jour !");
      /////
      reset_textarea($form)
      /////
  
    }).fail(function(xhr) {
        alert("Erreur AJAX : " + xhr.statusText);
    });
  });
  


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

  ///// DRAGNDROP
  $(".table-suboncard tbody").sortable({
      forcePlaceholderSize: true,
      handle: ".drame", // ou ".draggable-row-handle"
      helper: function (e, ui) {
          ui.children().each(function () {
              $(this).width($(this).width());
          });
          return ui;
      },
      stop: function (event, ui) {
        var subtask = ui.item;
        // alert(subtask.attr("class"))
        // let index=0
        let order = [];
        let current_table=$(subtask).parent("tbody")
        // let project_id=$(subtask).find(".sub_desc").attr("data-projectid")
        let task_id=$(subtask).find(".sub_desc").attr("data-taskid")

        $(current_table).find(".subt_tr").each(function(index) {
          index++
          $(this).attr("index", index)

          let desc_tr=$(this).find(".sub_desc")
          let subtask_id=$(desc_tr).attr("data-subid")
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
          }
        }); // AJAX

      }, /// STOP_END dragndrop
      start: function (event, ui) {
          ui.item.addClass("draggable-item-selected");
      }
  }).disableSelection();

  /// REPLACED --> MYSQL ( change_suborder.php )
  /// REDO (spon) subtasks in order 
  // $(".table-suboncard").each(function() {
  //     let task_id = $(this).find(".sub_desc").data("taskid");
  //     let project_id = $(this).find(".sub_desc").data("projectid");

  //     /// GET LOCAL ORDER
  //     let order = localStorage.getItem("subtasks_order_" + project_id + "_" + task_id);

  //     if (order) {
  //         order = JSON.parse(order);
  //         let tbody = $(this).find("tbody");
  //         order.forEach(function(subtask_id) {
  //             let row = tbody.find('.sub_desc[data-subid="' + subtask_id + '"]').closest(".subt_tr");
  //             if (row.length) {
  //                 tbody.append(row); // déplace la ligne à la fin (donc dans l'ordre)
  //             }
  //         });
  //     }
  // });
  

  ///// FUNCTIONS
  /// RESET TEXTAREA
  /// ( USE ON SUBTASK TEXTAREA SUBMIT )
  function reset_textarea($form) {
    // alert("reset_textarea")
    var $textarea = $form.find("textarea");
    var $button = $form.find(".submit_sub_desc_edit");
    var newText = $textarea.val();
    // alert(newText)

    // LOAD marked JS --> 
    // app/Template/layout.php
    // <?= $this->asset->js('assets/js/marked.min.js') ?>
    var html = marked.parse(newText); // Conversion Markdown -> HTML
    var $formform = $(this).find("form");
    $form.append('<span class="wrap_desc">'+html+'</span>');
    $button.remove();
    $textarea.remove();


    setTimeout(function () {
      // alert("re.init sub_dec_clic")
      /////// RE.INIT  SUBTASK CLICK -> TEXTAREA...
      sub_dec_clic("re")
      ////////
    },400);
    
  }

  //// SAVE TOGGLE SHOW/HIDE
  function toggle_save_checkboxs($this, $desc, task_id, subtask_id) {
    // alert("toggle_save_checkboxs")
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

  ///// TEXTAREA AUTO HEIGHT
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto'; // Réinitialise d'abord la hauteur
    textarea.style.height = (textarea.scrollHeight + 4) + 'px'; // Ajuste à la hauteur du contenu (+10px)
  }
  /////


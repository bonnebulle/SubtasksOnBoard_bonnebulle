// vbulle_inits_after_dragndrop.js
// DO (re)trigger vbulle functione after drangndrop tasks

// AUTOLOADED
/// VBULLE
// Charger dynamiquement un autre JS 
// --> LOAD THIS ( vbulle_inits_after_dragndrop )
//// var script = document.createElement('script');
//// script.src = 'assets/js/vbulle_inits_after_dragndrop.js';
//// document.head.appendChild(script);

// AJOUTÉ dans
// /kanboard/assets/js/app.min.js 
// LIGNE 4084 
// (APRES drag n drop stop)
// AFTER "task.removeClass("draggable-item-selected");"

//// VBULLE
setTimeout(function () {  
  sub_title_clic()
  sub_dec_clic()
  initToggleSubDesc();
  cibles()
  drame_subtasks()
},500);
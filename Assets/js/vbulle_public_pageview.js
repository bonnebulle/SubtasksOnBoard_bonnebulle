// vbulle_public
// alert("vbulle_public_pageview")

$('#description_wrap_public .accordion-title').text("Plan")
$('#subtask_wrap_public .accordion-title').text("Sous-parties")


// let publink=$("#lienpub").find("a").attr("href")
// alert(publink)
// $("#top_title_span").wrap("<a id='parmalink_title' href='"+publink+"'></a>")


$(document).ready(function() {

  function normalizeString(str) {
    // Remplacer les caractères accentués par leur version sans accent
    const accentMap = {
      'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
      'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
      'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
      'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
      'ý': 'y', 'ÿ': 'y',
      'ñ': 'n', 'ç': 'c',
      'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
      'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
      'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
      'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
      'Ý': 'Y',
      'Ñ': 'N', 'Ç': 'C'
    };

    return str.replace(/[àáâãäåèéêëìíîïòóôõöøùúûüýÿñçÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖØÙÚÛÜÝÑÇ]/g, function(match) {
      return accentMap[match] || match;
    });
  }



  const filename_fix=normalizeString($("#parmalink_title").find("a").text()).replace(/[\s\'\"\<\>]/gm, "_")

  function exportMarkdownToPdf(page_bloc_content, filename = filename_fix) {
      // const texteAvecCesure = ajouterCesureAutomatique(markdownText);
      const htmlContent = page_bloc_content;
      
      const container = document.createElement('div');
      container.innerHTML = `
        <style>

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

          .task-position-info {
          display: block;
          }
          .pdf-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11pt;
            line-height: 1.2;
            color: #333;
            padding: 20px;
            margin-left: 30px;
            
            text-align: justify;
            word-wrap: break-word;
            overflow-wrap: break-word;

              margin-left: 0px;
              margin-top: -20px;

          }
          .pdf-container .table-suboncard {  width: 630px; 
          font-family: "Times New Roman", Times, serif;
            line-height: 1.4;

          }
            .subtask-title,
              h1, h2, h3, h4, h5, h6 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
            

          .title_js, h1 {
          margin-top: 0;
          margin-bottom: 4px;   /* ou moins/0 selon ton besoin */
          -webkit-margin-before: 0;
          -webkit-margin-after: 0;
          line-height: 1.1;
          }


          .task-summary-container .title_js, 
          .task-summary-container h1 {
          margin-top: 0;
          }

          .task-summary-container {
          padding-top: 0;      /* ou une petite valeur seulement */
          }
          .title_js, h1 {
          page-break-after: avoid;
          page-break-inside: avoid;
          margin-top: 0;
          padding-top: 0px;
          clear: both;
          width: 100%;
          display: block;
          float: left;
          }
          .wrap_desc :is(h1, h2, h3, h4, h5, h6)::after {display:none;}
          
          #subtask_wrap_public {
              margin-top: 10px;
          }
          #toc_container {
          margin-bottom: -20px;
          }
          .table-suboncard {
              margin-left: -0px;
          }
          #toc_list * {
              font-size 10px !important;
          }
          #toc_list li:is(.toc-div) {
              margin-top: 0 !important;
          }
          #toc_list,
          #toc_list li {
          margin-left: 0; padding-left:0;
          }
          summary {
          list-style: none; /* supprime le marqueur de liste */
          }
          
          #bottom_helper,
          h2#toc_title,
          [data-num="2"] {
              display:none;
          }
          #parmalink_title {
              display:bloack;
              margin: auto;
              text-align:center;
          }

          [data-num="1"],
          .swim_text, #nav_top  {
              display: block; float: none;
          }

          .swim_text {
              text-align: center;
          }

          .accordion-title {

              clear: both;
              float: left;
              width: 100%;
              margin-top: 20px;
              font-size: 20px;
              color: #000;
              }

              a.title_js.php_show {
                  font-size: 20px;
                    background-color: rgba(255, 250, 231, 0.8);
                    padding: 10px;
                    margin: -2Opx;
                    position: relative;
                    left: -13px;
                    top: -10px;
                    display: block;
                    width: calc(100% + 12px);
                    float: left;
              }
                    .subtask-item {
                    min-height: 100px;
                    }
        </style>
        <div class="pdf-container" lang="fr">
          ${htmlContent}
        </div>
      `;
      
      const options = {
        margin: [10, 0, 20, 10],
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
        pagebreak: { mode: ['css', 'legacy'] }
      };
      
      html2pdf().set(options).from(container).save();
    }
  
    function exporterEnPdf(clip_text) {
      console.log("GO --- exporterEnPdf")
      // console.log(clip_text)
      // alert("vcs"+filename_fix)
      exportMarkdownToPdf(clip_text, filename_fix);
    }


    $(".md_to_pdf, .html_to_print").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      // alert($(this).attr("class"))  // Pour debug si nécessaire
      let page_bloc_content = "";
      
      if ($(this).attr("class")!="html_to_print"){
        page_bloc_content += $('.taskview_summary_stitles').html();
        page_bloc_content += $('#nav_top').html();
        page_bloc_content += "<br /><br />";
      }
      page_bloc_content += document.querySelector('.task-summary-container').innerHTML;
      fn_get_blocs_texts(page_bloc_content, $(this).attr("class"))
    })


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

    let clip_text=""
    function fn_get_blocs_texts(page_bloc_content, contexte_printpdf) {

      // alert(contexte_printpdf)
      let today = new Date(),
      time = today.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

      /// INFOS
      const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
      const {weekday, dayNumber, month, year} = frenchTodayDate();
      const aujourdhui = `${capitalize(weekday)}, le ${dayNumber} ${month} ${year}`;
      
      clip_text += "<center>"+aujourdhui + " -- " + time + "</center>\n";

      clip_text += page_bloc_content

      if (contexte_printpdf === "md_to_pdf") {
          exporterEnPdf(clip_text);
      } else if (contexte_printpdf === "html_to_print") {
          exporterEnPdf_print(clip_text);
      }
    }
      

    function exporterEnPdf_print(htmlContent) {
      // Créer une nouvelle fenêtre
      const printWindow = window.open('', '_blank');
      
      // Copier tous les styles inline de la page actuelle
      const inlineStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            // Gérer les CORS pour les CSS externes
            return '';
          }
        })
        .join('\n');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Export PDF - Kanboard</title>
          
          <!-- Charger les feuilles de style externes -->
          <link rel="stylesheet" href="/assets/css/vbulle_kanboard.css?1764755506" media="all">
          <link rel="stylesheet" href="/assets/css/vbulle_kanboard_public.css?1757262017" media="all">
          <!-- <link rel="stylesheet" href="/assets/css/print.min.css?1750627458" media="all"> -->
          
          <style>
            /* Styles inline de la page */
            ${inlineStyles}
            
            /* Styles spécifiques pour l'impression */
            @media print {
              body {
                margin: 0;
                padding: 0mm;
              }
              @page {
                size: A4;
                margin: 10mm 0mm 10mm 0mm;
              }
            }
              #toc_list  + #toc_list { display: none; }
            .wrap_desc :is(h1, h2, h3, h4, h5, h6)::after {
              display:none;
            }

            /* Forcer l'affichage même en dehors du contexte print */
            body {
              margin: 0;
              padding: 20mm;
            }
              #subtask_wrap_public { max-width: none; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Attendre que les CSS soient chargées avant d'imprimer
      printWindow.addEventListener('load', function() {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          // Optionnel : fermer après impression
          // printWindow.onafterprint = function() { printWindow.close(); };
        }, 500);
      });
    }



    function getSubTaskIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        // alert(params.get('data-subtask-id'))
        return params.get('data-subtask-id');
      }
    //   alert(getSubTaskIdFromUrl())

    
    const subtaskId = getSubTaskIdFromUrl();
    
    if (subtaskId) {
        const el = document.querySelector(`[data-subtask-id="${subtaskId}"]`);
        el.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'center' });
    }


if ($(".table-suboncard").length != 0) {

    let num = 1;
    $('.accordion-title').each(function() {
        $(this).attr('data-num', num);
        num++;
    });

  $("#description_wrap_public").find(".accordion-section").attr("open", "open")


    // Helper function to sanitize text for use in HTML IDs
    function sanitizeTextForId(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }

    // Existing logic for wrapping subtask-item titles (modified to use sanitizeTextForId)
    $('.subtask-item').each(function() {
        $(this).find('h1, h2, h3, h4, h5, h6').each(function() {
            var titleText = $(this).text();
            var sanitizedId = sanitizeTextForId(titleText);
            // The ID and href are on the <a> wrapper as per previous instruction
            if (!$(this).parent('a.title_js').length) { // Prevent double wrapping if somehow run twice
                $(this).wrap('<a id="' + sanitizedId + '" href="#' + sanitizedId + '" class="title_js"></a>');
            }
        });
    });

    // Process h1.subtask-title elements: ensure they have an ID if not already wrapped
    $('.subtask-title').each(function() {
        var heading = $(this);
        // Check if this h1.subtask-title is already a child of an 'a.title_js' wrapper
        if (!heading.parent('a.title_js').length) {
            if (!heading.attr('id')) { // Only add ID to the heading itself if it doesn't have one
                var titleText = heading.text();
                var id = sanitizeTextForId(titleText);
                heading.attr('id', id);
            }
        }
    });

    // TOC Generation
    var tocHtml = '<div id="toc_container"><h2 id="toc_title">Table des matières</h2><ul id="toc_list"></ul></div>';
    if ($('#toc_container').length === 0) {
      $('#description_wrap_public').find("article").append(tocHtml);
  }


    var addedIds = new Set();

    // Iterate over elements that serve as TOC entries: either 'a.title_js' wrappers or stand-alone '.subtask-title' headings.
    // The order of elements in the DOM will determine the order in the TOC.
    $('.subtask-title, a.title_js').each(function() {
        var element = $(this);
        var id, text, tagName;

        // Determine if the current element is an 'a.title_js' wrapper
        if (element.is('a.title_js')) {
            // For 'a.title_js', the actual heading (h1-h6) is its child.
            // We need to get the ID from the 'a' element and the text/tag from the child heading.
            var childHeading = element.children('h1, h2, h3, h4, h5, h6').first();
            if (childHeading.length) {
                id = element.attr('id');
                text = childHeading.text();
                tagName = childHeading.prop('tagName').toLowerCase();
            } else {
                // If an a.title_js exists but has no heading child, skip it
                return;
            }
        } else if (element.hasClass('subtask-title')) {
            // For '.subtask-title' elements (which are not wrapped by 'a.title_js'),
            // the heading itself holds the ID, text, and tag name.
            // This case handles h1.subtask-title, h2.subtask-title, etc. that are not part of subtask-item's wrapper logic.
            id = element.attr('id');
            text = element.text();
            tagName = element.prop('tagName').toLowerCase();
        } else {
            // Should not happen with the current selector, but good for robustness
            return;
        }

        // Add to TOC if a valid ID exists and hasn't been added yet
        if (id && !addedIds.has(id)) {
            var listItem = '<li class="toc-' + tagName + '" data-tagName="'+tagName+'"><a href="#' + id + '">' + text + '</a></li>';
            $('#toc_list').append(listItem);
          
            
            addedIds.add(id);
        }



    });
    setTimeout(function () {
        $(".loading").removeClass("loading")
     },600);
     

}


$('.subtask-item').each(function() {
    $(this).find('p, li').each(function() {
        let rawinput=$(this).html();
        let rawfix=rawinput.replace(/ ([:!?;»"\)\/%€])/g,"&nbsp$1")
        // alert(  rawinput.replace(" :","&nbsp:") )
        $(this).html(rawfix)
        
    });
    $(this).find('a:not(.title_js)').each(function() {
        let href=$(this).attr("href")
        $(this).after("<a href='"+href+"' target='OpenPopup'><i class='fa fa-fw fa-external-link pop'></i><a>")
    });

    
});





// # https://stackoverflow.com/a/55975847
function returnFilename(url) {
    var fileName = url.split(/[#\?]/).shift().split('/').pop()
    let regeximgend =/(png|jpg|svg|jpeg)$/
    var matchimg = fileName.match(regeximgend);
    if ( matchimg ) {
        // alert(fileName)
        return fileName
    } else {
        // alert(url)
        return "notimage"
    }
}

// # https://stackoverflow.com/a/50761037
function titlepath(url,name){
    // var randomWindowName = "Popup_" + Math.random().toString(36).substr(2, 9); // Générer un nom de fenêtre aléatoire
    var randomWindowName = "OpenPopup";

    // alert(name)
    if (name!="notimage") {
        var prntWin = window.open(url, randomWindowName, "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");
        prntWin.document.write("<html><head><title>"+name+" -- popupdncorpus</title><style>* {margin:0; padding: 0;}</style></head><body>"
            + '<embed width="100%" height="100%" name="plugin" src="'+ url+ '" '
            + 'type="image/jpg" internalinstanceid="21"></body></html>');
            prntWin.document.close();

    } else {
        // // var randomWindowName = "OpenPopup";
        // var prntWin = window.open(url, randomWindowName, "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");
        //     prntWin.document.write("<html><head><style>* {margin:0; padding: 0;}</style></head><body>"
        //         + '<iframe width="100%" height="100%" name="page" src="'+ url+ '"></body></html>');
        //         prntWin.document.close();
        // alert("00")
        if (url && url.endsWith("=1")) {
            // alert("001")
            // $(this).attr("href", url.slice(0, -2)); // Retire les deux derniers caractères
            let url_fix=url.slice(0, -2);
            newWindow = window.open(url_fix, randomWindowName, "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");

        } else {
            // alert("002")
            newWindow = window.open(url, randomWindowName, "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes");
        }
    }
}

$("[target='OpenPopup']").each(function() {
    let url = $(this).attr("href");
    let fn = returnFilename(url)
    if (fn != "notimage") {
        var finameRegexMatch = decodeURI(returnFilename(url));
        $(this).attr("title",finameRegexMatch)
    } else {
        $(this).attr("title","ouvrir dans un popup")
    }

    $(this).on("click", (event) => {
        if (fn != "notimage") {
            titlepath(url,finameRegexMatch)
        } else {
            // alert("0")
            titlepath(url,"notimage")
        }
        event.preventDefault();
    });
});

});



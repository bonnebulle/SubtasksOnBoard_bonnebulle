<!-- <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> -->

<?php
    $subtasks = $this->helper->subtasklistHelper->subtasks($task['id']);
    if (sizeof($subtasks) > 0):
    // print_r($subtasks)
?>



<?php $subtask_num=0 ?>
<?php  $have_desc = ( empty($subtask['due_description']) ) ? "sans" : "avec" ?>

<table class="table-suboncard" data-have_desc="<?=$have_desc ?>">
    <div class="dropdown-submenu-open_alt" onclick="">
    <li>
            <i class="fa fa-info ok" aria-hidden="true"></i>
            <a href="/?controller=SubtaskController&action=create&task_id=<?=$task["id"] ?>" class="js-modal-medium" title="add"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></a>
        </li>        
        <!-- <li>
            <i class="fa fa-bullseye cible" aria-hidden="true"></i>
        </li>         -->
    </div>
    <span class='all_toggle_wraper' onclick="">
        <a href="" class="all_toggle active">
            <i class="fa fa-eye ok" aria-hidden="true" onclick=""></i>
        </a>
    </span>
    
    <!-- ///// -->
    <?php foreach ($subtasks as $subtask): ?>
        <tr class="subt_tr">
            <td class="subt_td" onclick="">


            <!-- EDIT btns -->
            <div class='edit_subtask'>

                <!-- <span class="extra_icns"> -->
                <!-- /// CLIPBOARD store data -->
                <!-- <?php if($subtask["due_description"] != "0"): ?> -->
                    <a class="cpclip" onclick='cpclip(<?= $task["id"] ?>,<?=$subtask["id"] ?>)'>
                        <i class="fa fa-clipboard"></i>
                    </a>
                <!-- <?php endif ?> -->

                <!-- /// TOGGLE SHOW/HIDE -->
                <a class="toggle_sub_desc_a" onclick="" data-task_id="<?= $task["id"] ?>" data-subtask_id="<?=$subtask["id"] ?>">
                    <label class="toggle_sub_desc" for="toggle_sub_desc_<?= $subtask_id ?>"><i class='fa fa-eye'></i></label>
                </a>
                <!-- </span> -->
                <?php if ($this->projectRole->canUpdateTask($task)): ?>
                    <!-- /// RM -->
                    <a class="js-modal-medium rmbutt" href="/?controller=SubtaskController&action=confirm&task_id=<?= $task["id"] ?>&subtask_id=<?=$subtask["id"] ?>">
                        <i class="fa fa-trash-o fa-fw js-modal-large" aria-hidden="true"></i>
                    </a>
                    <!-- /// MOD EDIT -->
                    <a class="js-modal-medium editbutt" href="/?controller=SubtaskController&action=edit&task_id=<?= $task["id"] ?>&subtask_id=<?=$subtask["id"] ?>">
                        <i class="fa fa-edit fa-fw js-modal-large" aria-hidden="true"></i>
                    </a>
                <?php endif ?>
                <!-- <li> -->
                    <i class="fa fa-bullseye cible" aria-hidden="true"></i>
                <!-- </li>      -->
                <!-- //// DRAG N DROP   -->
                <span class='drame dragbutt' onclick="">
                    <a href="" class="dragme_a" onclick="">
                        <i class="fa fa-hand-paper-o" aria-hidden="true" onclick=""></i>
                    </a>
                </span>
            </div>

            <!-- TASKS CONTENT Render -->
            <!-- <span class='hideme'>
                <?= 
                    $ids = $this->subtask->renderids($task, $subtask);
                ?>
            </span> -->

                <!-- TASKS TITLE Render -->
                <form class="sub_title_form" data-task_id="<?= $task["id"] ?>" data-subtask_id="<?=$subtask["id"] ?>" data-project_id="<?=$ids['project_id'] ?>" data-position="<?=$subtask["position"] ?>" method="post">
                    <span class="sub_task_title_only" onclick="">
                        <span class="title_text"><?= $subtask["title"] ?></span>
                    </span>
                </form>
                
                   
            </td>

            <?= $this->hook->render('template:board:tooltip:subtasks:rows', array( 'subtask' => $subtask, "csrf_token" => $ids['csrf_token'], "task_id" => $ids['task_id'], "subtask_id" => $ids['subtask_id'], "project_id" => $ids['project_id']) ) ?>

        </tr>

        <?php endforeach ?>
    </table>
    
<?php else: ?>

    <table class="table-suboncard">
        <div class="dropdown-submenu-open_alt">
            <li>
                <i class="fa fa-eye ok1 hideme" aria-hidden="true"></i>
                <a href="/?controller=SubtaskController&action=create&task_id=<?php print_r($task["id"]) ?>" class="js-modal-medium ok" title="add"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></a>
            </li>
        </div>    
    </table>

<?php endif ?>


<script>
function cpclip(id,subid) {
    // let text_fixed = text.replace(/---ppp/g, "\\n").replace(/\\n/g, "");
    // alert($($this).attr("class"))
    var $task_cibling = $('[data-subid="'+subid+'"][data-taskid="'+id+'"]')
    // var $wrap_desc = $task_cibling.find(".wrap_desc");
    // var $wrap_title = $task_cibling.prev(".subt_td").find(".title_text");
    // alert($wrap_title.length)
    // var currentText = md($wrap_desc.html())
    // var currentTitle = md($wrap_title.html())
    // alert($wrap_title)
    // var final_cp = currentTitle.replace("<br>","\n")+"\n------\n"+currentText.replace("<br>","\n")
    let taskId = id;
    let subtaskId = subid;

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

          if (response.title) {

            let final_cp = response.title +"\n-------\n"+ response.due_description;
            navigator.clipboard.writeText(final_cp).then(() => {
                // console.log('Text copied to clipboard!');
                alert(final_cp);
            }).catch(err => {
                // console.error('Failed to copy text: ', err);
                alert('Failed to copy text: ', err);
            });

          }
        }
    });

}
</script>







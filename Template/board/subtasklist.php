<!-- <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> -->

<?php
    $subtasks = $this->helper->subtasklistHelper->subtasks($task['id']);
    if (sizeof($subtasks) > 0):
?>
    <table class="table-suboncard">
    <div class="dropdown-submenu-open_alt">
        <li>
            <i class="fa fa-eye ok" aria-hidden="true"></i>
            <a href="/?controller=SubtaskController&action=create&task_id=<?php print_r($task["id"]) ?>" class="js-modal-medium" title="add"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></a>
        </li>
    </div>
    <?php foreach ($subtasks as $subtask): ?>
        <tr class="subt_tr">
            <td class="subt_td">

                <!-- TASKS TITLE Render -->
                <?= $this->subtask->renderToggleStatus($task, $subtask) ?>
                    
                <!-- EDIT btns -->
                <div class='edit_subtask'>

                    <?php if($subtask["due_description"] != "0"): ?>
                        <a class="cpclip" onclick="cpclip('<?=
                            str_replace(
                                ["\"","'", "\n", "\r"],
                                ["\\“", "\\'", "\\n", "---ppp"],
                                $subtask["due_description"]
                            )
                        ?>')">
                           <i class="fa fa-clipboard"></i>
                        </a>
                    <?php endif ?>
                    <a class="toggle_sub_desc_a" onclick="" data-task_id="<?= $task["id"] ?>" data-subtask_id="<?=$subtask["id"] ?>">
                        <label class="toggle_sub_desc" for="toggle_sub_desc_<?= $subtask_id ?>"><i class='fa fa-arrows-alt'></i></label>
                    </a>
                    <a class="js-modal-medium" href="/?controller=SubtaskController&action=confirm&task_id=<?= $task["id"] ?>&subtask_id=<?=$subtask["id"] ?>">
                        <i class="fa fa-trash-o fa-fw js-modal-large" aria-hidden="true"></i>
                    </a>
                    <a class="js-modal-medium" href="/?controller=SubtaskController&action=edit&task_id=<?= $task["id"] ?>&subtask_id=<?=$subtask["id"] ?>">
                        <i class="fa fa-edit fa-fw js-modal-large" aria-hidden="true"></i>
                    </a>
                </div>
            </td>

            <!-- TASKS CONTENT Render -->
            <span class='hideme'>
                <?= 
                    $ids = $this->subtask->renderids($task, $subtask);
                ?>
            </span>
            <?= $this->hook->render('template:board:tooltip:subtasks:rows', array( 'subtask' => $subtask, "csrf_token" => $ids['csrf_token'], "task_id" => $ids['task_id'], "subtask_id" => $ids['subtask_id'], ) ) ?>

        </tr>

        <?php endforeach ?>
    </table>
    
<?php else: ?>

    <table class="table-suboncard">
        <div class="dropdown-submenu-open_alt">
            <li>
                <i class="fa fa-eye hideme" aria-hidden="true"></i>
                <a href="/?controller=SubtaskController&action=create&task_id=<?php print_r($task["id"]) ?>" class="js-modal-medium ok" title="add"><i class="fa fa-plus fa-fw" aria-hidden="true"></i></a>
            </li>
        </div>    
    </table>

<?php endif ?>


<script>
function cpclip(text) {
    let text_fixed = text.replace(/---ppp/g, "\\n").replace(/\\n/g, "");
    // alert(text_fixed)
  navigator.clipboard.writeText(text_fixed).then(() => {
    console.log('Text copied to clipboard!');
    alert('Text copied to clipboard : \n'+text_fixed);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy text: ', err);
  });
}



</script>
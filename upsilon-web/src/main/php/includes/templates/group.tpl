{if isset($singleGroup)} 
<a href = "updateGroup.php?id={$itemGroup.id}">Update</a>

<a href = "createGroup.php">Create</a>

<a href = "listGroups.php">List</a>

<a href = "deleteGroup.php?id={$itemGroup.id}">Delete</a>
{/if}

{if !empty($itemGroup.listServices) || !empty($itemGroup.listSubgroups)}

<div class = "metricGroup block" {if $hidden}style = "display: none"{/if}>
	<h3>{if $drawNavigation}<a href = "viewGroup.php?id={$itemGroup.id}">{/if}{$itemGroup.name}{if $drawNavigation}</a>{/if}</h3>

	{if !empty($itemGroup.listServices)}
	{include file = "metricList.tpl" listServices = $itemGroup.listServices}
	{/if}

	{foreach from = $itemGroup.listSubgroups item = itemSubgroup}
		<h4>{if $drawNavigation}<a href = "viewGroup.php?id={$itemSubgroup.id}">{/if}{$itemSubgroup.name}{if $drawNavigation}</a>{/if}</h4>
		{include file = "metricList.tpl" listServices = $itemSubgroup.listServices}
	{/foreach}
</div>
{/if}
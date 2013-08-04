{if $tutorialMode}
<div class = "box tutorialMessage">
	<p><strong>Nodes</strong> are responsible for executing <a href = "index.php">service checks</a> and optionally sending those results their node peers.</p>
</div>
{/if}

<div class = "box">
	<h3>Nodes</h3>
<table class = "hover dataTable" data-dojo-type="dojox.grid.DataGrid">
	<thead>
		<tr>
			<th>id</th>
			<th>Title</th>
			<th>Type</th>
			<th>Service count</th>
			<th>Last updated</th>
			<th>Status</th>
		</tr>
	</thead>

	<tbody>
		{foreach from = $listNodes item = itemNode}
		<tr>
			<td>{$itemNode.id}</td>
			<td><a class = "node" href = "viewNode.php?id={$itemNode.id}">{$itemNode.identifier}</a></td>
			<td>{$itemNode.nodeType} (version {$itemNode.instanceApplicationVersion})</td>
			<td>{$itemNode.serviceCount}</td>
			<td>{$itemNode.lastUpdated} {$itemNode.lastUpdateRelative}</td>
			<td class = "{$itemNode.karma|strtolower}">{$itemNode.karma}</td>
		</tr>
		{/foreach}
	</tbody>
</table>
<script>
require(["dojox/grid/DataGrid"]);
</script>
</div>

window.karmaColors = {}
window.karmaColors["GOOD"] = '#90ee90';
window.karmaColors["BAD"] =  '#fa8072';
window.karmaColors["STALLED"] = '#000099';
window.karmaColors["WARNING"] = '#ffa500';
window.karmaColors["UNKNOWN"] = '#666';

function rawPlot(plot, ctx) {
    var data = plot.getData();
    var axes = plot.getAxes();
    var offset = plot.getPlotOffset();

    for (var i = 0; i < data.length; i++) {
        var series = data[i];
        for (var j = 0; j < series.data.length; j++) {
            var d = (series.data[j]);
            var x = offset.left + axes.xaxis.p2c(d[0]);
            var y = offset.top + axes.yaxis.p2c(d[1]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x,y,4,0,Math.PI*2,true);
            ctx.closePath();           
            ctx.fillStyle = window.karmaColors[d[2]]
            ctx.fill();
        }    
    }
}

function labelDateAxis(date) {
	require(["dojo/date/locale", "dojo/query"
	], function(locale, query) {
		locale.format
	});
	var d = new Date(date * 1000);

	return d.getDay() + " " + d.getMonth();
}

function updateGraph(results) {
	require([
		"dojox/charting/Chart",
		"dojo/date/stamp",
		"dojox/charting/plot2d/Lines",
		"dojox/charting/axis2d/Default"
	], function(Chart, stamp) {
		$('#graphService' + results.graphIndex).empty();

		/*
		xaxis: {mode: "time", timeformat: "%a\n %H:%M"},
		{colors: ["#cecece", '#cecece'] }
		*/

		var c = new Chart("graphService" + results.graphIndex);
		c.addPlot("default", {
			type: "Lines",
			markers: true
		});

		c.addAxis("x", {vertical: false });
		c.addAxis("y", {vertical: true});

		$(results.services).each(function(index, service) {
			axisData = []

			$(service.metrics).each(function(index, result) {
				axisData.push({y: result.value, x: result.date})
			});

			c.addSeries("service " + service.serviceId, axisData);
		});

		c.render();


		window.plots[results.graphIndex] = c;
	});
}

function getAxisColor(index) {
	switch(index) {
		default: return "black";
	}
}

window.plots = {};
window.plotMarkings = {};

function fetchServiceMetricResultGraph(metric, id, graphIndex) {
	data = {
		"services": id,
		"metric": metric,
		"graphIndex": graphIndex
	}

	window.serviceResultGraphUrl = 'viewServiceResultGraph.php';

	$.getJSON(window.serviceResultGraphUrl, data, updateGraph);
}


function animatePreRelayout() {
	$('div.metricGroup').fadeOut(0, function() {
		$('#loadingAnimation').fadeIn();
	});
}

function animatePostRelayout() {
	$('#loadingAnimation').fadeOut(400, function() {
		$('div.metricGroup').fadeIn();
	});
}

function layoutBoxes(animate) {
	animate && animatePreRelayout();

	new Masonry('div.blockContainer', {itemSelector: 'div.block', columnWidth: 200, isFitWidth: true });

	animate && animatePostRelayout();
}

function cookieOrDefault(cookieName, defaultValue) {
	require(["dojo/cookie"], function(cookie) {
		cookieValue = cookie(cookieName)

		if (cookieValue == null) {
			return defaultValue;
		} else {
			return cookieValue;
		}
	});	
}

window.shortcutToggleNighttime = 78;
window.shortcutToggleEmptyGroups = 77;
window.shortcutToggleGroups = 71;

window.nighttime = cookieOrDefault("nighttime", false);
window.showGoodGroups = cookieOrDefault("groups", false);
window.showEmptyGroups = cookieOrDefault("showEmptyGroups", false);

function toggleEmptyGroups() {
	$('.metricGroup').each(function(index,container) {
		container = $(container);
		var services = container.find('.metricList li');

		if (!window.showEmptyGroups && services.size() == 0) {
			container.hide();
		}
	});
}

function toggleNightVision() {
	window.nighttime = !window.nighttime;
	var stylesheet = $('link[title=nighttime]');

	if (window.nighttime) {
		$(stylesheet).attr('rel', 'stylesheet');
	} else {
		$(stylesheet).attr('rel', 'disabled');
	}
}

function toggleSingleGroup(group) {
//	console.log(group);
}

function toggleGroups() {
	var desc = $('.metricListContainer').each(function(index,container) {
		container = $(container);
		var desc  = container.find('.metricListDescription');
		var services = container.find('.metricList li');

		desc.empty();
		services.show();
		services.children().show();

		var servicesGood = services.find('div span.metricIndicator.good').parent().parent('li');
		var servicesBad = services.find('div span.metricIndicator.bad').parent().parent('li');
		var servicesSkipped = services.find('div span.metricIndicator.skipped').parent().parent('li');
		var servicesWarning = services.find('div span.metricIndicator.warning').parent().parent('li');

		if (!window.showGoodGroups) {
			if ((servicesGood.size() + servicesWarning.size()) == services.size()) {
				servicesGood.hide();
				servicesWarning.hide();
				desc.append($('<div style = "display:inline-block"><span class = "metricIndicator good grouped">~</span></div> <div class = "metricText">All <strong>' + servicesGood.size() + '</strong> services are good.</div>'));

				if (servicesWarning.size() > 0) {
					desc.append(' <span class = "warning"><strong>' + servicesWarning.size() + '</strong> have a warning</span>.')
				}

				desc.click(toggleSingleGroup)
			}

			if (servicesSkipped.size() > 0) {
				servicesSkipped.hide();
				desc.append($('<div style = "display:inline-block"><span class = "metricIndicator skipped grouped">~</span></div> <div class = "metricText">Skipped <strong>' + servicesSkipped.size() + '</strong> services</div>'));
			}			
		}
	});
}

$(document).bind('keydown', function(e) {
	var keypressNode = $(e.target).context.nodeName;

	if (keypressNode != "BODY") {
		return;
	}

	// Dont interfere with browser shortcuts
	if (e.ctrlKey) {
		return;
	}

	switch(e.which) {
		case window.shortcutToggleNighttime:
			e.preventDefault();

			toggleNightVision();	
			break;
		case window.shortcutToggleGroups:
			e.preventDefault();

			window.showGoodGroups = !window.showGoodGroups;

			toggleGroups();
			layoutBoxes(false);
			
			break;
		case window.shortcutToggleEmptyGroups:
			e.preventDefault();

			window.shortcutToggleEmptyGroups = !window.shortcutToggleEmptyGroups;

			toggleEmptyGroups();
			break;
		default:
	}
});

function setupCollapseableForms() {
	$('p.collapseable').each(function(index,sectionTitle) {
		sectionTitle = $(sectionTitle);

		var list = $('<div />');

		list.append(sectionTitle.nextUntil('p.collapseable', 'fieldset'));

		sectionTitle.after(list);

	});
}

function setupEnhancedSelectBoxes() {
	require(["dojo/query", "dijit/form/Select", "dojo/_base/array"], function(query, Select, array) {
		var selects = query("select");

		array.forEach(selects, function(entry, index) {
	//		new Select({}, entry);
		});
	});
}


function setupSortableTables() {
	return;

	$('table.dataTable').dataTable({
		'sDom': 'flpitpil',
		'aaSorting': [[ 1, 'desc ']],
		'oLanguage': {
		'oPaginate': {
			'sNext': '&nbsp;',
			'sPrevious': '&nbsp;'
		}
		}
	});

	$('a.paginate_enabled_next').html('&nbsp;');
	$('a.paginate_enabled_previous').html('&nbsp;');
	$('a.paginate_disabled_next').html('&nbsp;');
	$('a.paginate_disabled_previous').html('&nbsp;');
}

function serviceIconChanged() {
	var icon = $('select#updateMetadata-icon').val();

	if (icon != '') {
		icon = 'resources/images/serviceIcons/' + icon;
		
		$('span#serviceIconPreview').html('<img src = "' + icon + '" alt = "serviceIcon" />');
	}
}

function menuButtonClick(address) {
	// Hide your eyes. This will be temporary.
	if (address.contains(".php")) {
		window.location = address;
	} else {
		eval(address);
	}
}

function requestRescanWidgets() {
	var proBar = new dijit.ProgressBar();
	proBar.placeAt("body");

	proBar.set("value", 50);
}

var time_line_view = null;
var collegues_time_line_views = [];

$(function() {
	const year = new Date().getFullYear();
	$('.js-year').val(year);

	renderTimeline(year);
	initListeners();
});

async function renderTimeline(year) {
	const time_line_wrapper = $('.js-timelines-wrapper');

	const time_line_model = new TimeLineModel(year);
	try {
		await time_line_model.fetchIntervals();
		time_line_view = new TimeLineView({ 
			model: time_line_model, 
			width: time_line_wrapper.width(),
			is_editable: true
		});

		time_line_wrapper.html(time_line_view.el);
		time_line_view.render();
	} catch(resp) {
		alert(resp.message);
	}
}

function initListeners() {
	$('.js-year').on('change', e => {
		time_line_view.model.options.start_year = $(e.target).val();
		time_line_view.render();

		collegues_time_line_views.forEach(view => {
			view.model.options.start_year = $(e.target).val();
			view.render();
		});
	});

	$('.js-show-collegues').on('click', e => {
		// todo: Заглушка получения интервалов с сервера
		const intervals = [
			[
				[1613595600, 1614718800, 5],
				[1619816400, 1620939600, 6],
				[1623272400, 1624136400, 7]
			],
			[
				[1613336400, 1614459600, 8],
				[1619816400, 1620939600, 9],
				[1623272400, 1624136400, 10]
			]
		];

		const time_line_wrapper = $('.js-timelines-collegues-wrapper');
		time_line_wrapper.empty();

		intervals.forEach(item => {
			const year = $('.js-year').val();
			const time_line_model = new TimeLineModel(year, item);
			const time_line_view = new TimeLineView({ 
				model: time_line_model, 
				width: time_line_wrapper.width(),
				is_editable: false
			});

			time_line_wrapper.append(time_line_view.el);
			time_line_view.render();

			collegues_time_line_views.push(time_line_view);
		});
	});
}
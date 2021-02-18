class TimeLineModel {
	constructor(year, intervals = []) {
		this.intervals = intervals;
		this.options = {
			interval_color: '#d45500',
			interval_stroke_color: '#ff6600',
			background_color: '#004488',
			scale_color: '#ffffff',
			title_color	: '#000000',
			scale_font: '16px arial',
			title_font: '26px arial',
			background_height: 40,
			day_pixels: 4,
			day_seconds: 86400,
			start_year: year
		};
		this.current_interval = null;
	}

	fetchIntervals() {
		return new Promise((resolve, reject) => {
			// todo: Здесь будет запрос на сервер, пока заглушка
			this.intervals = [
				[1613595600, 1614459600, 1],
				[1619816400, 1620939600, 2],
				[1623272400, 1624136400, 3],
				[1589823075, 1590859875, 4]
			];
			resolve(this.intervals);
		});
	}

	deleteInterval(interval) {
		let pos = null;
		for(let i in this.intervals) {
			if(this.intervals[i] == interval) {
				pos = i;
				break;
			}
		}

		return new Promise((resolve, reject) => {
			if(pos === null) {
				reject({message: 'Интервал не найден'});
			} else if(!this.checkStartInterval(interval[0]) || !this.checkEndInterval(interval[1])) {
				reject({message: 'Из этого периода нельзя удалить интервал'});
				return false;
			} else {
				// todo: Здесь будет запрос на сервер, пока заглушка
				this.intervals.splice(pos, 1);
				resolve(interval);
			}
		});
	}

	addInterval(x) {
		const timestamp = this.pixelsToTime(x);
		const interval = [timestamp - this.getOption('day_seconds'), timestamp + this.getOption('day_seconds')];
		return new Promise((resolve, reject) => {
			if(!this.checkStartInterval(interval[0]) || !this.checkEndInterval(interval[1])) {
				reject({message: 'В этот период нельзя добавить интервал'});
				return false;
			}

			this.current_interval = interval;
			if(this.hasIntervalsIntersection(interval[0]) || this.hasIntervalsIntersection(interval[1])) {
				this.current_interval = null;
				reject({message: 'Слишком близко к соседнему интервалу'});
				return false;
			}

			// todo: Здесь будет запрос на сервер, пока заглушка
			this.intervals.push(interval);
			resolve(interval);
		});
	}

	getIntervals() {
		return this.intervals;
	}

	getIntervalPosX(interval) {
		return this.timeToPixels(interval[0]);
	}

	getIntervalPosX2(interval) {
		return this.timeToPixels(interval[1]);
	}

	getOption(name) {
		return this.options[name];
	}

	getStartTime() {
		const start_date = new Date(`${this.getOption('start_year')}-01-01`);
		return Math.floor(start_date / 1000);
	}

	timeToPixels(timestamp) {
		return Math.round( (timestamp - this.getStartTime()) / this.getOption('day_seconds') * this.getOption('day_pixels') );
	}

	pixelsToTime(pixels) {
		return this.getStartTime() + pixels / this.getOption('day_pixels') * this.getOption('day_seconds');
	}

	getNextMonth(timestamp) {
		let date = new Date(timestamp * 1000);
		date = new Date( date.setMonth(date.getMonth() + 1) );
		return Math.floor(date / 1000);
	}

	getMonthTitle(timestamp) {
		const map = [
			'Январь', 'Февраль', 'Март', 'Апрель', 'Май',
			'Июнь', 'Июль', 'Август', 'Сентябрь', 
			'Октябрь', 'Ноябрь', 'Декабрь'
		];
		const date = new Date(timestamp * 1000);
		return map[date.getMonth()];
	}

	getYear(timestamp) {
		const date = new Date(timestamp * 1000);
		return date.getFullYear();
	}

	getDay(timestamp) {
		const date = new Date(timestamp * 1000);
		return date.getDate();
	}

	isFirstMonth(timestamp) {
		const date = new Date(timestamp * 1000);
		return !date.getMonth();
	}

	isHoverToggled(x) {
		let hovered_interval = null;
		const timestamp = this.pixelsToTime(x);
		for(let i in this.intervals) {
			const interval = this.intervals[i];
			if(this.isInInterval(interval, timestamp)) {
				hovered_interval = interval;
				break;
			}
		}

		if(this.current_interval != hovered_interval) {
			this.current_interval = hovered_interval;
			return true;
		}

		return false;
	}

	isNearbyStart(x) {
		if(!this.current_interval) {
			return false;
		}

		const start_x = this.timeToPixels(this.current_interval[0]);
		return x > start_x && x - start_x <= 4;
	}

	isNearbyEnd(x) {
		if(!this.current_interval) {
			return false;
		}

		const end_x = this.timeToPixels(this.current_interval[1]);
		return x < end_x && end_x - x <= 4;
	}

	isInInterval(interval, timestamp) {
		return interval[0] <= timestamp && interval[1] >= timestamp;
	}

	editCurrentInterval(x, type) {
		if(!this.current_interval) {
			return false;
		}

		const timestamp = this.pixelsToTime(x);

		if(type == 'start' && this.checkStartInterval(timestamp)) {
			this.current_interval[0] = timestamp;
		} else if(type == 'end' && this.checkEndInterval(timestamp)) {
			this.current_interval[1] = timestamp;
		}
	}

	checkStartInterval(timestamp) {
		if(this.current_interval && this.current_interval[1] - timestamp < 2) {
			return false;
		}

		if(this.current_interval && this.hasIntervalsIntersection(timestamp)) {
			return false;
		}

		const date = new Date(timestamp * 1000);
		if((new Date().getFullYear()) > date.getFullYear()) {
			return false;
		}

		return true;
	}

	checkEndInterval(timestamp) {
		if(this.current_interval && timestamp - this.current_interval[0] < 2) {
			return false;
		}

		if(this.current_interval && this.hasIntervalsIntersection(timestamp)) {
			return false;
		}

		const date = new Date(timestamp * 1000);
		if((new Date().getFullYear()) > date.getFullYear()) {
			return false;
		}

		return true;
	}

	hasIntervalsIntersection(timestamp) {
		for(let i in this.intervals) {
			const item = this.intervals[i];
			if(item == this.current_interval) {
				continue;
			}

			if(item[0] <= timestamp && item[0] > this.current_interval[0]) {
				return true;
			}

			if(item[1] >= timestamp && item[1] <= this.current_interval[1]) {
				return true;
			}
		}

		return false;
	}

	getIntervalByPosX(x) {
		const timestamp = this.pixelsToTime(x);
		let interval = null;
		this.intervals.forEach(item => {
			if(item[0] <= timestamp && item[1] >= timestamp) {
				interval = item;
			}
		});

		return interval;
	}
}
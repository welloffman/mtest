class TimeLineView {
	constructor(options) {
		this.model = options.model;
		this.width = options.width || 1000;
		this.height = options.height || 120;
		this.is_editable = options.is_editable || false;
		this.edit_on = null
		this.init();
	}

	init() {
		this.canvas = $('<canvas>').get(0);
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.getContext().translate(0.5, 0.5);

		this.el = $('<div>', {'class': 'time-line-view'});
		this.el.append(this.canvas);
	}

	render() {
		this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawBackground();
		this.drawIntervals();
		this.drawScale();
		this.drawIntervalText();

		this.initHoverListener();
		if(this.is_editable) {
			this.initEditListener();
			this.initAddRemoveListener();
		}
	}

	drawBackground() {
		const ctx = this.getContext();
		ctx.fillStyle = this.getOption('background_color');
		const x = 0;
		const y = this.getBackgroundY();
		ctx.fillRect(x, y, this.canvas.width, this.getOption('background_height'));
	}

	drawIntervals() {
		const ctx = this.getContext();
		ctx.strokeStyle = this.getOption('interval_stroke_color');
		ctx.lineWidth = 2;
		ctx.fillStyle = this.getOption('interval_color');
		this.model.getIntervals().forEach(interval => {
			const x = this.model.getIntervalPosX(interval);
			const x2 = this.model.getIntervalPosX2(interval);

			if(x > this.canvas.width || x2 < 0) {
				return;
			}

			const y = this.getBackgroundY();
			const width = x2 - x;
			const height = this.getOption('background_height');
			ctx.fillRect(x, y, width, height);

			if(interval == this.model.current_interval) {
				ctx.strokeRect(x, y, width, height);
			}
		});
	}

	drawScale() {
		const ctx = this.getContext();
		ctx.strokeStyle = this.getOption('scale_color');
		ctx.lineWidth = 1;
		const y1 = this.getBackgroundY();
		const y2 = y1 + this.getOption('background_height');

		let timestamp = this.model.getStartTime();
		while(this.model.timeToPixels(timestamp) <= this.canvas.width) {
			ctx.fillStyle = this.getOption('scale_color');
			const x = this.model.timeToPixels(timestamp);
			ctx.beginPath();
			ctx.moveTo(x, y1);
			ctx.lineTo(x, y2);
			ctx.closePath();
			ctx.stroke();

			ctx.font = this.getOption('scale_font');
			ctx.fillText(this.model.getMonthTitle(timestamp), x + 5, y1 + 25);

			if(this.model.isFirstMonth(timestamp)) {
				ctx.fillStyle = this.getOption('title_color');
				ctx.font = this.getOption('title_font');
				ctx.fillText(this.model.getYear(timestamp), x + 5, y1 + 70);
			}

			timestamp = this.model.getNextMonth(timestamp);
		}
	}

	drawIntervalText() {
		if(!this.model.current_interval) {
			return;
		}

		const ctx = this.getContext();
		const y = this.getBackgroundY() - 10;
		ctx.fillStyle = this.getOption('title_color');
		ctx.font = this.getOption('title_font');
		ctx.fillText(`С ${this.model.getDay( this.model.current_interval[0] )} по ${this.model.getDay( this.model.current_interval[1] )}`, 5, y);
	}

	getContext() {
		return this.canvas.getContext("2d");
	}

	getOption(name) {
		return this.model.options[name];
	}

	getMousePos(e) {
		var rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	getBackgroundY() {
		return this.canvas.height / 2 - this.getOption('background_height') / 2;
	}

	initHoverListener() {
		this.el.off('mousemove').on('mousemove', e => {
			const mouse_pos = this.getMousePos(e);
			const min_y = this.getBackgroundY();
			const max_y = min_y + this.getOption('background_height');
			if(mouse_pos.y < min_y || mouse_pos.y > max_y) {
				return;
			}

			if(this.edit_on) {
				this.editInterval(mouse_pos.x);
			} else if(this.model.isHoverToggled(mouse_pos.x)) {
				this.render();
			}

			if(this.model.isNearbyStart(mouse_pos.x) || this.model.isNearbyEnd(mouse_pos.x)) {
				document.body.style.cursor = "col-resize";
			} else {
				document.body.style.cursor = "auto";
			}
		});
	}

	initEditListener() {
		this.el.off('mousedown').on('mousedown', e => {
			const mouse_pos = this.getMousePos(e);
			const min_y = this.getBackgroundY();
			const max_y = min_y + this.getOption('background_height');
			if(mouse_pos.y < min_y || mouse_pos.y > max_y) {
				return;
			}

			if(this.model.isNearbyStart(mouse_pos.x)) {
				this.edit_on = 'start';
			} else if(this.model.isNearbyEnd(mouse_pos.x)) {
				this.edit_on = 'end';
			}
		});

		$(document).off('mouseup.timeline').on('mouseup.timeline', e => {
			this.edit_on = null;
		});
	}

	editInterval(x) {
		this.model.editCurrentInterval(x, this.edit_on);
		this.render();
	}

	initAddRemoveListener() {
		this.el.off('dblclick').on('dblclick', async (e) => {
			const mouse_pos = this.getMousePos(e);
			const min_y = this.getBackgroundY();
			const max_y = min_y + this.getOption('background_height');
			if(mouse_pos.y < min_y || mouse_pos.y > max_y) {
				return;
			}

			const interval = this.model.getIntervalByPosX(mouse_pos.x);
			if(interval) {
				try {
					await this.model.deleteInterval(interval);
					this.render();
				} catch(resp) {
					alert(resp.message);
				}
			} else {
				try {
					await this.model.addInterval(mouse_pos.x);
					this.render();
				} catch(resp) {
					alert(resp.message);
				}
			}
		});
	}
}
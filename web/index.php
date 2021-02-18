<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="UTF-8">
		<title>План отпусков</title>
		<base href="/">
		
		<link href="data:image/x-icon;base64,AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAA==" rel="icon" type="image/x-icon" />

		<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
		
		<script src="/js/models/TimeLineModel.js"></script>
		<script src="/js/views/TimeLineView.js"></script>
		<script src="/js/index.js"></script>
	</head>

	<body>
		<div class="container-fluid">
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<a class="navbar-brand" href="/index.php">Менеджер отпусков</a>
			</nav>

			<div class="row">
				<div class="col mt-3">
					<button type="button" class="btn btn-primary js-show-collegues">Отпуска коллег</button>
				</div>
			</div>

			<div class="row">
				<div class="col-2 mt-3">
					<label>Год</label>
					<input type="number" class="form-control js-year">
				</div>
			</div>

			<div class="row">
				<div class="col mt-3 js-timelines-wrapper"></div>
			</div>

			<div class="row">
				<div class="col mt-3 js-timelines-collegues-wrapper"></div>
			</div>
		</div>
	</body>
</html>
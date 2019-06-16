<script>
	import { onMount } from 'svelte';
	import * as filters from './utils/imageFilters'

	let image, canvas, ctx, imageData, alt = '',  src = '';
	
	let defaultValues = {
		colors: [255, 255, 255, 255],
		contrast: 0, 
		brightness: 0,
		gamma: 1, 
		temperature: 0, 
		tint: 0, 
		solarize: 0,
		saturation: 0, 
		vibrance: 0,
		grayscale: 0, 
		shades: 0,
		posterize: 0, 
		nearest: 0, 
		threshold: 0,
		dithering: 0, 
		halftone: 0, 
		invert: 0,
		highpass: 0, 
		sharpen: 0, 
		sobel: 0
	}, values = {...defaultValues};
	
	onMount(() => {
		image = document.querySelector('img');
		canvas = document.querySelector('canvas');
		ctx = canvas.getContext('2d');
		src = './images/lena.png';

		resetData();
	});

	const handleFile = e => {
		const files = Object.values(e.target.files).filter(file => file.type.match('image.*'));

		if(files.length == 0) {
			alert('No Image Selected');
			return;
		}

		const file = files[0];

		// use createObject better than readAsDataURL
		// https://stackoverflow.com/a/31743665/1578100
		const URLApi = window.webkitURL || window.URL;
		const imageURL = URLApi.createObjectURL(file);

		alt = file.name;

		// load image
		image.src = imageURL;
	};

	const handleLoad = e => {
		const {width, height} = e.currentTarget;
		console.log(width, height);

		canvas.width = width;
		canvas.height = height;

		// free up memory
		const URLApi = window.webkitURL || window.URL;
		URLApi.revokeObjectURL(image.src);

		applyFilters();
	}

	const resetData = () => {
		values = {...defaultValues};
	}

	const resetImageData = () => {
		imageData = null;
	}

	const setImageData = () => {
		if(!imageData) {
			const {width, height} = canvas;
			imageData = ctx.getImageData(0, 0, width, height);
		}
	}

	const resetFilters = () => {
		resetData();
		applyFilters();
	}

	const applyFilters = () => {
		// reset
		resetImageData();

		// redraw
		const {width, height} = canvas;
		ctx.drawImage(image, 0, 0, width, height);
		setImageData();

		// apply filters
		Object.keys(filters).filter(key => key != 'applyFilter').map(key => {
			if(values[key] !== undefined && values[key] !== 0) filters[key](imageData, values[key]);
		})
		//filters.colors(imageData, values.colors);
		
		if(!imageData) return;
	
		// render
		ctx.clearRect(0, 0, width, height);
		ctx.putImageData(imageData, 0, 0);
	}

	const handleDownload = e => {
		
		e.currentTarget.href = canvas.toDataURL('image/jpeg');
		e.currentTarget.download = 'canvas.jpeg';
	}
</script>

<style type="text/scss">
	h1 {
		color: purple;
	}

	.table {
		display: table;
		table-layout: fixed;
	}

	.image,
	.filters {
		display: table-cell;
		vertical-align: top;
	}

	.image {
		position: relative;
		width: calc(100vw - 200px);
	}

	.filters {
		text-align: left;
		padding: 0 10px;
	}

	ul {
		padding: 0;
		margin: 0 0 15px;
		list-style-type: none;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	li {
		display: table;
		text-align: right;
		width: 100%;
		margin-bottom: 6px;
		
		span, input {
			vertical-align: middle;
			display: table-cell
		}

		span {
			text-align: left;
			padding: 0;
		}
	}
	
	canvas, img {
		max-width: 100%;
		left: 50%;
		transform: translateX(-50%);
	}

	canvas {
		position: relative;
		z-index: 1;
	}

	img {
		position: absolute;
		visibility: hidden;
	}

	.button-download {
		font-size: 11px;
		text-decoration: none;
		color: #FFF;
		background-color: #2C3E50;
		border: none;//#2C3E50 solid 1px;
		border-radius: 5px;
		padding: 2px 6px;
		margin-left: 10px;

		cursor: pointer;

		&:hover {
			background-color: #000;
			//border: #2C3E50 solid 1px;
		}
	}

	@media screen and (max-width: 700px) {
		.image {
			width: calc(100vw);
		}
		ul {
			padding-right: 5px;
		}
		li {
			span, input {
				width: 100%;
				display: table-row;
			}
		}
	}

</style>

<h1>Canvas Image Filters</h1>
<div class="table">
	<div class="image">
		<img src={src} alt={alt} on:load={handleLoad}>
		<canvas></canvas>
	</div>
	<div class="filters">
		<input type="file" id="files" accept="image/*" on:change={handleFile}><br><br>
		<ul>
			<li>
				<span>Red</span>
				<input type="range" min="0" max="510" bind:value={values.colors[0]} on:change={applyFilters}>
			</li>
			<li>
				<span>Green</span>
				<input type="range" min="0" max="510" bind:value={values.colors[1]} on:change={applyFilters}>
			</li>
			<li>
				<span>Blue</span>
				<input type="range" min="0" max="510" bind:value={values.colors[2]} on:change={applyFilters}>
			</li>
			<li>
				<span>Alpha</span>
				<input type="range" min="0" max="255" bind:value={values.colors[3]} on:change={applyFilters}>
			</li>
			<li><hr></li>
			<li>
				<span>Contrast</span>
				<input type="range" min="-255" max="255" bind:value={values.contrast} on:change={applyFilters}>
			</li>	
			<li>
				<span>Brightness</span>
				<input type="range" min="-255" max="255" bind:value={values.brightness} on:change={applyFilters}>
			</li>	
			<li>
				<span>Gamma</span>
				<input type="range" min="0.01" max="7.99" step="0.01" bind:value={values.gamma} on:change={applyFilters}>
			</li>			
			<li>
				<span>Temperature</span>
				<input type="range" min="-100" max="100" bind:value={values.temperature} on:change={applyFilters}>
			</li>	
			<li>
				<span>Tint</span>
				<input type="range" min="-100" max="100" bind:value={values.tint} on:change={applyFilters}>
			</li>	
			<li>
				<span>Saturation</span>
				<input type="range" min="-1" max="1" step="0.1" bind:value={values.saturation} on:change={applyFilters}>
			</li>	
			<li>
				<span>Vibrance</span>
				<input type="range" min="-1" max="1" step="0.1" bind:value={values.saturation} on:change={applyFilters}>
			</li>	
			<li><hr></li>
			<li>
				<span>Grayscale</span>
				<input type="range" min="0" max="9" bind:value={values.grayscale} on:change={applyFilters}>
			</li>	
			<li>
				<span>Shades</span>
				<input type="range" min="0" max="16" step="4" bind:value={values.shades} on:change={applyFilters}>
			</li>	
			<li>
				<span>Posterize</span>
				<input type="range" min="-255" max="255" bind:value={values.Posterize} on:change={applyFilters}>
			</li>	
			<li>
				<span>Nearest</span>
				<input type="range" min="0" max="8" bind:value={values.nearest} on:change={applyFilters}>
			</li>	
			<li>
				<span>Threshold</span>
				<input type="range" min="0" max="255" bind:value={values.threshold} on:change={applyFilters}>
			</li>	
			<li>
				<span>Dithering</span>
				<input type="range" min="0" max="8" bind:value={values.dithering} on:change={applyFilters}>
			</li>	
			<li>
				<span>Halftone</span>
				<input type="range" min="0" max="255" bind:value={values.halftone} on:change={applyFilters}>
			</li>	
			<li><hr></li>
			<li>
				<span>Invert</span>
				<input type="range" min="0" max="255" bind:value={values.invert} on:change={applyFilters}>
			</li>	
			<li>
				<span>Solarize</span>
				<input type="range" min="-128" max="128" bind:value={values.solarize} on:change={applyFilters}>
			</li>	
			<li>
				<span>Highpass</span>
				<input type="range" min="-10" max="10" bind:value={values.highpass} on:change={applyFilters}>
			</li>	
			<li>
				<span>Sharpen</span>
				<input type="range" min="-1" max="1" step="0.1" bind:value={values.sharpen} on:change={applyFilters}>
			</li>	
			<li>
				<span>Sobel</span>
				<input type="range" min="0" max="10" bind:value={values.sobel} on:change={applyFilters}>
			</li>	
		</ul>
		<button on:click={resetFilters}>Reset</button>
		<a href="" class="button-download" on:click={handleDownload}>Download</a>
	</div>
</div>


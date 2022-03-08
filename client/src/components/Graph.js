import React, { useEffect, useRef, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Filler,
	defaults,
	BarElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";

const Utils = {
	id: "utils",
	beforeInit: function (chart) {
		const originalFit = chart.legend.fit;
		chart.legend.fit = function fit() {
			originalFit.bind(chart.legend)();
			this.height += 10;
		};
	},
};

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Filler,
	Utils,
	BarElement
);

const Graph = () => {
	const chartRef = useRef();

	const labels = ["Positive", "Neutral", "Negative"];

	const randomNumberInRange = (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const getRandomData = options =>
		Array(options.size)
			.fill(0)
			.map(() => randomNumberInRange(options.min, options.max));

	const accentColor = "219, 39, 119";
	const borderColor = "120, 121, 135";

	const options = {
		responsive: true,
		indexAxis: "y",
		scales: {
			x: {
				ticks: {
					color: `rgba(${borderColor},1)`,
				},
			},
			y: {
				ticks: {
					color: `rgba(${borderColor},1)`,
				},
			},
		},
		plugins: {
			tooltip: {
				padding: {
					x: 12,
					y: 16,
				},
				backgroundColor: "hsla(240, 10%, 16%,0.9)",
				borderColor: `rgb(${borderColor})`,
				borderWidth: 2,
				boxPadding: 8,
				bodyColor: "hsl(240, 6%, 75%)",
			},
			legend: {
				display: false,
				position: "top",
				align: "end",
				labels: {
					pointStyle: "circle",
					usePointStyle: true,
					boxWidth: 8,
				},
			},
			zoom: {
				zoom: {
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
					drag: {
						enabled: true,
					},
					mode: "x",
				},
			},
		},
	};

	const [data, setData] = useState({
		labels,
		datasets: [],
	});

	useEffect(() => {
		defaults.animation.easing = "easeOutQuart";
		defaults.animation.duration = 750;
		defaults.font.family = `"Wotfard", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif`;
		defaults.font.size = 12;
		defaults.font.weight = 600;
		defaults.scale.grid.borderColor = `rgb(${borderColor})`;
		defaults.scale.grid.borderWidth = 2;
		defaults.scale.grid.borderDash = [6];
		defaults.scale.grid.color = `rgba(${borderColor},0.125)`;
		defaults.elements.line.fill = "start";
		defaults.elements.line.tension = 0.5;
		defaults.elements.line.borderJoinStyle = "round";
		defaults.elements.line.borderColor = `rgba(${accentColor}, 1)`;
		defaults.elements.point.borderColor = "rgba(255,255,255,1)";
		defaults.elements.point.radius = 4;
		defaults.elements.point.hoverRadius = 4;
		defaults.elements.point.hitRadius = 18;
		defaults.elements.point.borderWidth = 2;
		defaults.elements.point.hoverBorderWidth = 2;

		const chart = chartRef.current;
		const gradientBottomOffset = 50;

		if (!chart) return;

		let gradient = chart.ctx.createLinearGradient(
			0,
			0,
			0,
			chart.height - gradientBottomOffset
		);
		gradient.addColorStop(0, `rgba(${accentColor}, 1)`);
		gradient.addColorStop(1, `rgba(${accentColor}, 0.33)`);

		setData({
			...data,
			datasets: [
				{
					backgroundColor: gradient,
					borderRadius: 4,
					pointBackgroundColor: `rgba(${accentColor}, 1)`,
					data: getRandomData({
						size: labels.length,
						min: 0,
						max: 100,
					}),
				},
			],
		});
		//eslint-disable-next-line
	}, []);

	return <Chart ref={chartRef} type="bar" options={options} data={data} />;
};

export default Graph;

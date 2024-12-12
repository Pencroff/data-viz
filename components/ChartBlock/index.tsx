import './style.scss';
import type { ChartBlockProps } from '$cmp/types/DtGridTypes';
import { set } from 'lodash-es';
import { useEffect, useRef, useState } from 'preact/hooks';
import Plot from 'react-plotly.js';

export function ChartBlock({ rawData, chartMap, mappers }: ChartBlockProps) {
	const chartContainer = useRef(null);
	const [keyList] = useState(Object.keys(chartMap ?? {}));
	const [idx, setIdx] = useState(0);
	const [data, setData] = useState([]);
	const [layout, setLayout] = useState({});

	// biome-ignore lint/correctness/useExhaustiveDependencies: it depends just from Idx
	useEffect(() => {
		const key = keyList[idx];
		const newData = chartMap[key].charts.map((chart) => {
			const mapper = mappers[chart.mapper];
			return {
				...mapper(rawData, chart.group),
				type: chart.type,
				name: chart.group,
			};
		});
		const newLayout = {
			...chartMap[key].layout,
			width: chartContainer.current.clientWidth - 16,
			title: chartMap[key].title,
			xaxis: { title: chartMap[key].description },
		};
		if (chartMap[key].yLabel) {
			set(newLayout, 'yaxis.title', chartMap[key].yLabel);
		}
		setData(newData);
		setLayout(newLayout);
	}, [idx]);

	return (
		<div class="container container-fluid pb-2">
			<div class="row chart">
				<div
					ref={chartContainer}
					class="col-9 p-2 d-flex justify-content-center"
				>
					<Plot
						data={data}
						layout={layout}
						config={{
							responsive: true,
							displaylogo: false,
						}}
					/>
				</div>
				<div class="col-3">
					<ul class="list-group list-group-flush">
						{keyList.map((key, i) => (
							<li
								key={key}
								class={`list-group-item ${i === idx ? 'list-group-item-success' : ''}`}
								onClick={() => setIdx(i)}
								onKeyUp={() => setIdx(i)}
							>
								{chartMap[key].listTitle}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

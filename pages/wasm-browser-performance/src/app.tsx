import { ChartBlock } from '$cmp/ChartBlock';
import { DtGridBlock } from '$cmp/DtGridBlock';
import { formatters as fmt } from '$cmp/DtGridUtils';
import type { InnColumnDefinition } from '$cmp/types/DtGridTypes';
import { FilterAsType } from '$cmp/types/DtGridTypes';
import { useFirstRender } from '$lib';
import _ from 'lodash';
// @ts-ignore
import data from '../data/benchmark_browser_2024-11-01.json5';

type WasmBrowserBenchmarkEntry = {
	env: string;
	engine: string;
	version: string;
	name: string;
	size: number;
	duration: number;
	alloc: number;
	sys: number;
	scale: number;
};

const columnsConfig: InnColumnDefinition[] = [
	{
		title: 'Browser',
		field: 'engine',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Version',
		field: 'version',
		headerSort: false,
		meta: { filterAs: FilterAsType.asString },
	},
	{
		title: 'Implementation',
		field: 'name',
		meta: { filterAs: FilterAsType.asEnum },
	},
	{
		title: 'Size',
		field: 'size',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatMemorySize,
		formatterParams: {
			precision: 2,
			minUnit: 'KiB',
			maxUnit: 'MiB',
		},
	},
	{
		title: 'Duration',
		field: 'duration',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatFloat,
		formatterParams: {
			precision: 2,
		},
	},
	{
		title: 'Allocated memory',
		field: 'alloc',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatMemorySize,
		formatterParams: {
			precision: 2,
			minUnit: 'KiB',
			maxUnit: 'MiB',
		},
	},
	{
		title: 'Reserved memory',
		field: 'sys',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatMemorySize,
		formatterParams: {
			precision: 2,
			minUnit: 'KiB',
			maxUnit: 'MiB',
		},
	},
	{
		title: 'Scale',
		field: 'scale',
		meta: { filterAs: FilterAsType.asNumber },
		formatter: fmt.formatFloat,
		formatterParams: {
			precision: 2,
		},
	},
];

export const App = () => {
	let gridData = [];
	if (useFirstRender()) {
		gridData = dtGridTransformData(data);
	}
	return (
		<div class="container">
			<div class="row">
				<div class="col">
					<ChartBlock
						rawData={gridData}
						chartMap={{
							scale: {
								listTitle: 'Browser scale',
								title: 'Browser scale, last version',
								yLabel: 'Scale, times',
								description:
									'Comparison with "Binary" baseline, lower is better',
								charts: [
									{ type: 'bar', group: 'safari', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'chrome', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'firefox', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'edge', mapper: 'scaleMapper' },
									{ type: 'bar', group: 'arc', mapper: 'scaleMapper' },
								],
								layout: {
									autosize: true,
									shapes: [
										{
											type: 'line',
											x0: 0,
											y0: 1,
											x1: 1,
											y1: 1,
											xref: 'paper',
											yref: 'y',
											line: {
												color: 'black',
												width: 2,
												dash: 'dash',
											},
										},
									],
									annotations: [
										{
											x: 0.01,
											y: 2.3,
											xref: 'paper',
											yref: 'y',
											text: 'Binary baseline = 1.00',
											showarrow: false,
											font: {
												size: 16,
												color: '#111',
											},
										},
									],
								},
							},
							duration: {
								listTitle: 'Browser duration',
								title: 'Browser duration, last version',
								yLabel: 'Duration, milliseconds',
								description:
									'Comparison with "Binary" baseline, lower is better',
								charts: [
									{ type: 'bar', group: 'safari', mapper: 'durationMapper' },
									{ type: 'bar', group: 'chrome', mapper: 'durationMapper' },
									{ type: 'bar', group: 'firefox', mapper: 'durationMapper' },
									{ type: 'bar', group: 'edge', mapper: 'durationMapper' },
									{ type: 'bar', group: 'arc', mapper: 'durationMapper' },
								],
								layout: {
									autosize: true,
									shapes: [
										{
											type: 'line',
											x0: 0,
											y0: 19.9,
											x1: 1,
											y1: 19.9,
											xref: 'paper',
											yref: 'y',
											line: {
												color: 'black',
												width: 2,
												dash: 'dash',
											},
										},
									],
									annotations: [
										{
											x: 0.01,
											y: 45,
											xref: 'paper',
											yref: 'y',
											text: 'Binary baseline = 19.9 ms',
											showarrow: false,
											font: {
												size: 16,
												color: '#111',
											},
										},
									],
								},
							},
							alloc: {
								listTitle: 'Allocated memory',
								title: 'Allocated memory, last version',
								yLabel: 'Memory',
								description: 'Memory allocated in KiB',
								charts: [
									{ type: 'bar', group: 'safari', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'chrome', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'firefox', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'edge', mapper: 'memoryMapper' },
									{ type: 'bar', group: 'arc', mapper: 'memoryMapper' },
								],
								layout: {
									autosize: true,
									yaxis: { type: 'log' },
								},
							},
						}}
						mappers={{
							scaleMapper,
							memoryMapper,
							durationMapper,
						}}
						height={350}
					/>
				</div>
			</div>
			<div class="row">
				<div class="col">&nbsp;</div>
			</div>
			<div class="row">
				<div class="col">
					<DtGridBlock
						title="Performance data"
						data={gridData}
						columns={columnsConfig}
					/>
				</div>
			</div>
		</div>
	);
};

function dtGridTransformData(data: WasmBrowserBenchmarkEntry[]) {
	return data.map((row) => {
		const nameFormatterMap = {
			sieve_primes: 'Binary',
			'sieve_primes.wasm': 'WASM',
			'sieve_primes.js': 'JS',
		};
		row.name = nameFormatterMap[row.name];
		return row;
	});
}

// Utility function for processing grouped data
function processData(
	data: WasmBrowserBenchmarkEntry[],
	groupKey: string,
	valueKey: 'scale' | 'alloc' | 'duration',
	transformFn: (value: number) => number,
): { x: string[]; y: number[] } {
	const groupedData = _.chain(data)
		.groupBy('engine') // Group by 'engine'
		.get(groupKey) // Limit to the specified group
		.groupBy('name'); // Further group by 'name'

	const x = groupedData.keys().value() as string[]; // Extract names as x axis
	const y = groupedData
		.mapValues((values) => transformFn(_.last(_.map(values, valueKey)) || 0)) // Transform the value using the provided function
		.values()
		.value() as number[]; // Collect transformed y-axis values

	return { x, y };
}

// Reuse of the utility function for both 'memoryMapper' and 'scaleMapper'
function memoryMapper(
	data: WasmBrowserBenchmarkEntry[],
	groupKey: string,
): { x: string[]; y: number[] } {
	return processData(
		data,
		groupKey,
		'alloc', // Use 'alloc' key
		(value) => _.round(value / 1024, 2), // Convert bytes to KiB
	);
}

function scaleMapper(
	data: WasmBrowserBenchmarkEntry[],
	groupKey: string,
): { x: string[]; y: number[] } {
	return processData(
		data,
		groupKey,
		'scale', // Use 'scale' key
		(value) => _.round(value, 2), // Round to 2 decimal places
	);
}

function durationMapper(
	data: WasmBrowserBenchmarkEntry[],
	groupKey: string,
): { x: string[]; y: number[] } {
	return processData(
		data,
		groupKey,
		'duration',
		(value) => _.round(value, 2), // Round to 2 decimal places
	);
}
